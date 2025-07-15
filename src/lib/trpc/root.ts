import { publicProcedure, router } from './server'

/**
 * This is the primary router for your server.
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  health: publicProcedure
    .query(() => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'tRPC is working correctly!',
      }
    }),
  // Add more routers here as your app grows
})

// Export type definition of API
export type AppRouter = typeof appRouter
