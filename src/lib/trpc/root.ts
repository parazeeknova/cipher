import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { users } from '../db/schema'
import { protectedProcedure, publicProcedure, router } from './server'

export const appRouter = router({
  health: publicProcedure
    .query(() => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'tRPC is working correctly!',
      }
    }),

  dbHealth: publicProcedure
    .query(async ({ ctx }) => {
      try {
        const result = await ctx.db.select().from(users).limit(1)
        return {
          status: 'ok',
          message: 'Database connection successful',
          userCount: result.length,
          timestamp: new Date().toISOString(),
        }
      }
      catch (error) {
        return {
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown database error',
          timestamp: new Date().toISOString(),
        }
      }
    }),

  getPrivateMessage: protectedProcedure
    .query(({ ctx }) => {
      return {
        message: `Hello authenticated user! Your ID is: ${ctx.userId}`,
        userId: ctx.userId,
      }
    }),

  getUserProfile: protectedProcedure
    .query(({ ctx }) => {
      return {
        userId: ctx.userId,
        message: 'This is your private profile data',
        timestamp: new Date().toISOString(),
      }
    }),

  // Database procedures
  createUser: protectedProcedure
    .input(z.object({
      email: z.string().email(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.insert(users).values({
        clerkId: ctx.userId,
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        imageUrl: input.imageUrl,
      }).returning()

      return user[0]
    }),

  getUser: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      return user[0] || null
    }),

  getAllUsers: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.select().from(users)
    }),
})

export type AppRouter = typeof appRouter
