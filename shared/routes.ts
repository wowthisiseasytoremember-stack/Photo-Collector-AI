import { z } from 'zod';
import { insertItemSchema, items, processAlbumSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  items: {
    process: {
      method: 'POST' as const,
      path: '/api/items/process',
      input: processAlbumSchema,
      responses: {
        200: z.object({
          message: z.string(),
          items: z.array(z.custom<typeof items.$inferSelect>())
        }),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/items',
      responses: {
        200: z.array(z.custom<typeof items.$inferSelect>()),
      },
    },
  },
};
