import { motion } from "framer-motion";
import { Calendar, Tag, AlertCircle, CheckCircle2 } from "lucide-react";
import { type Item } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ItemCardProps {
  item: Item;
  index: number;
}

export function ItemCard({ item, index }: ItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="h-full overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img 
            src={item.imageUrl} 
            alt={item.itemName || "Collectible"} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <a 
              href={item.imageUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white text-sm font-medium hover:underline truncate"
            >
              View Full Image
            </a>
          </div>
        </div>
        
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-display font-bold text-lg leading-tight text-foreground line-clamp-2">
              {item.itemName || "Unknown Item"}
            </h3>
            {item.estimatedYear && (
              <Badge variant="outline" className="shrink-0 bg-background/50 font-mono text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {item.estimatedYear}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tag className="w-3 h-3" />
            <span>{item.category || "Uncategorized"}</span>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-2 space-y-4">
          {/* Condition Section */}
          <div className="bg-muted/30 rounded-lg p-3 text-sm border border-border/50">
            <div className="flex items-center gap-2 mb-1 text-primary font-medium">
              <AlertCircle className="w-3 h-3" />
              <span>Condition Notes</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {item.conditionNotes || "No condition notes available."}
            </p>
          </div>

          {/* Key Features */}
          {item.keyFeatures && item.keyFeatures.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground/70 uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3" />
                Key Features
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.keyFeatures.map((feature, i) => (
                  <Badge 
                    key={i} 
                    variant="secondary" 
                    className="px-2 py-0.5 text-xs font-normal bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
