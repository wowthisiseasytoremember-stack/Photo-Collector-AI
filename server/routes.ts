import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { scrapeGooglePhotos } from "./scrapper";
import { analyzeImage } from "./analyzer";
import { batchProcess } from "./replit_integrations/batch";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.items.process.path, async (req, res) => {
    try {
      const input = api.items.process.input.parse(req.body);
      const { albumUrl } = input;

      // 1. Scrape
      console.log("Scraping...");
      const imageUrls = await scrapeGooglePhotos(albumUrl);
      
      if (imageUrls.length === 0) {
        return res.status(400).json({ message: "No images found in that album. Is it shared publicly?" });
      }

      // 2. Analyze in Batch
      console.log("Analyzing...");
      const processedItems = await batchProcess(
        imageUrls,
        async (imageUrl) => {
          const item = await analyzeImage(imageUrl, albumUrl);
          // 3. Save to DB
          return await storage.createItem(item);
        },
        { concurrency: 3 } // Process 3 images at a time
      );

      res.json({
        message: `Successfully processed ${processedItems.length} items.`,
        items: processedItems
      });

    } catch (err) {
      console.error("Process error:", err);
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      } else {
        res.status(500).json({ message: (err as Error).message || "Internal Server Error" });
      }
    }
  });

  app.get(api.items.list.path, async (req, res) => {
    const items = await storage.getItems();
    res.json(items);
  });

  return httpServer;
}
