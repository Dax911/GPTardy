import { createTRPCRouter } from "y/server/api/trpc";
import { exampleRouter, chatGPTRouter } from "y/server/api/routers/example";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  chatGPT: chatGPTRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
