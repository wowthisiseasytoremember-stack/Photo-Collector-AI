import { useItems } from "@/hooks/use-items";
import { ItemCard } from "@/components/ItemCard";
import { ProcessForm } from "@/components/ProcessForm";
import { Box, Layers } from "lucide-react";

export default function Home() {
  const { data: items, isLoading, isError } = useItems();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-background border-b border-border/40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
        
        <div className="container relative mx-auto px-4 py-16 md:py-24 max-w-7xl">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-foreground">
              Collectible <span className="text-gradient">Intelligence</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Extract, identify, and catalog your collection instantly. 
              Paste a Google Photos album link to unleash Gemini AI analysis.
            </p>
          </div>

          <ProcessForm />
        </div>
      </div>

      {/* Content Section */}
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[400px] rounded-2xl bg-muted/50 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive mb-4">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Failed to load items</h3>
            <p className="text-muted-foreground mt-2">Could not retrieve your collection. Please try again later.</p>
          </div>
        ) : items && items.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Box className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold font-display">
                  Your Collection
                  <span className="ml-3 text-sm font-normal text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full">
                    {items.length} items
                  </span>
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item, i) => (
                <ItemCard key={item.id} item={item} index={i} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary text-muted-foreground mb-6">
              <Box className="w-10 h-10 opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-foreground font-display">No items yet</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              Your collection is empty. Paste a Google Photos album URL above to start processing your collectibles.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
