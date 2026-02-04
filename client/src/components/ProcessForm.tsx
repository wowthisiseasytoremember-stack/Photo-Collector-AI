import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { processAlbumSchema, type ProcessAlbumRequest } from "@shared/schema";
import { useProcessAlbum } from "@/hooks/use-items";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Link as LinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ProcessForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProcessAlbumRequest>({
    resolver: zodResolver(processAlbumSchema),
  });

  const { mutate, isPending } = useProcessAlbum();
  const [isFocused, setIsFocused] = useState(false);

  const onSubmit = (data: ProcessAlbumRequest) => {
    mutate(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="relative z-10">
        <motion.div 
          className={`
            relative p-1 rounded-2xl transition-all duration-300
            ${isFocused || isPending ? 'bg-gradient-to-r from-primary via-accent to-primary p-[2px]' : 'bg-border'}
          `}
          animate={{
            backgroundPosition: isPending ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%"
          }}
          transition={{ 
            duration: 3, 
            repeat: isPending ? Infinity : 0, 
            ease: "linear" 
          }}
          style={{ backgroundSize: "200% 200%" }}
        >
          <div className="relative flex flex-col md:flex-row gap-2 bg-background rounded-[14px] p-2 shadow-sm">
            <div className="relative flex-1 group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                <LinkIcon className="w-5 h-5" />
              </div>
              <Input
                {...register("albumUrl")}
                placeholder="Paste Google Photos Album URL..."
                disabled={isPending}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="pl-10 h-12 text-base border-0 shadow-none focus-visible:ring-0 bg-transparent"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isPending}
              size="lg"
              className="h-12 px-8 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Process Album
                </>
              )}
            </Button>
          </div>
        </motion.div>
        
        <AnimatePresence>
          {errors.albumUrl && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute mt-2 text-sm text-destructive font-medium ml-4"
            >
              {errors.albumUrl.message}
            </motion.p>
          )}
        </AnimatePresence>
      </form>
      
      {/* Loading Status Indicator */}
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 text-center"
          >
            <p className="text-muted-foreground animate-pulse font-medium">
              Scanning album and identifying collectibles...
            </p>
            <div className="w-full h-1 bg-secondary rounded-full mt-4 overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
