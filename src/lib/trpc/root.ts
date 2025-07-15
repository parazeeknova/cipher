import { protectedProcedure, publicProcedure, router } from './server'

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

  // Protected procedure - requires authentication
  getPrivateMessage: protectedProcedure
    .query(({ ctx }) => {
      return {
        message: `Hello authenticated user! Your ID is: ${ctx.userId}`,
        userId: ctx.userId,
      }
    }),

  // Protected procedure example with user profile
  getUserProfile: protectedProcedure
    .query(({ ctx }) => {
      return {
        userId: ctx.userId,
        message: 'This is your private profile data',
        timestamp: new Date().toISOString(),
      }
    }),

  // Add more routers here as your app grows
})

export type AppRouter = typeof appRouter
