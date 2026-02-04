import { chromium } from "playwright";

export async function scrapeGooglePhotos(albumUrl: string): Promise<string[]> {
  console.log("Starting scrape for:", albumUrl);
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    const page = await context.newPage();
    
    // Go to the album URL
    await page.goto(albumUrl, { waitUntil: 'networkidle' });
    
    // Scroll a bit to trigger lazy loading if needed, though for shared albums the initial load usually has the first batch
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2000);

    // Google Photos shared album structure is complex and obfuscated.
    // We look for image tags that are likely the photos.
    // A common pattern for the main photos is large images with specific classes or structure.
    // However, finding the *high res* URL often involves looking at the 'style' background-image or 'img' src.
    // Let's try to extract 'img' src that look like photo URLs (containing 'googleusercontent.com')
    
    // This selector targets the images in the grid. 
    // The class names change, but they usually reside in a div with role="img" or similar, or just standard img tags.
    // We'll grab all img tags and filter for the ones that look like content.
    const validUrls = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images
            .map(img => img.src)
            .filter(src => src.includes('googleusercontent.com') && !src.includes('s64-c')); // Exclude tiny thumbnails
    });

    // Remove duplicates
    const uniqueUrls = [...new Set(validUrls)];
    
    // Limit to first 10 for this demo/MVP to respect resources and time
    console.log(`Found ${uniqueUrls.length} images. Processing first 10.`);
    return uniqueUrls.slice(0, 10);
    
  } catch (error) {
    console.error("Scraping error:", error);
    throw new Error("Failed to scrape album. Make sure the link is a public shared album.");
  } finally {
    await browser.close();
  }
}
