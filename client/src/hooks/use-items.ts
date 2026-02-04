import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ProcessAlbumRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useItems() {
  return useQuery({
    queryKey: [api.items.list.path],
    queryFn: async () => {
      const res = await fetch(api.items.list.path);
      if (!res.ok) throw new Error("Failed to fetch items");
      return api.items.list.responses[200].parse(await res.json());
    },
  });
}

export function useProcessAlbum() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ProcessAlbumRequest) => {
      const validated = api.items.process.input.parse(data);
      const res = await fetch(api.items.process.path, {
        method: api.items.process.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.items.process.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        if (res.status === 500) {
          const error = api.items.process.responses[500].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to process album");
      }

      return api.items.process.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.items.list.path] });
      toast({
        title: "Success!",
        description: data.message,
      });
    },
    onError: (error) => {
      toast({
        title: "Error processing album",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
