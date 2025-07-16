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
      try {
        const existingUser = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
        if (existingUser.length > 0) {
          return existingUser[0]
        }

        const userValues: Record<string, any> = {
          clerkId: ctx.userId,
          email: input.email,
        }

        if (input.firstName)
          userValues.firstName = input.firstName
        if (input.lastName)
          userValues.lastName = input.lastName
        if (input.imageUrl)
          userValues.imageUrl = input.imageUrl

        const user = await ctx.db.insert(users).values(userValues as any).returning()

        return user[0]
      }
      catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('unique constraint') || error.message.includes('duplicate key')) {
            const existingUser = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
            if (existingUser.length > 0) {
              return existingUser[0]
            }
          }
          throw new Error(`Failed to create user: ${error.message}`)
        }
        throw new Error('Failed to create user: Unknown error')
      }
    }),

  onboardUser: protectedProcedure
    .input(z.object({
      username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be less than 50 characters'),
      email: z.string().email(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const existingUser = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
        if (existingUser.length > 0) {
          throw new Error('User already exists')
        }

        const usernameExists = await ctx.db.select().from(users).where(eq(users.username, input.username))
        if (usernameExists.length > 0) {
          throw new Error('Username is already taken')
        }

        const userValues: Record<string, any> = {
          clerkId: ctx.userId,
          email: input.email,
          username: input.username,
        }

        if (input.firstName)
          userValues.firstName = input.firstName
        if (input.lastName)
          userValues.lastName = input.lastName
        if (input.imageUrl)
          userValues.imageUrl = input.imageUrl

        const user = await ctx.db.insert(users).values(userValues as any).returning()

        return user[0]
      }
      catch (error) {
        if (error instanceof Error) {
          throw error
        }
        throw new Error('Failed to create user account')
      }
    }),

  checkUsernameAvailability: protectedProcedure
    .input(z.object({
      username: z.string().min(3).max(50),
    }))
    .query(async ({ ctx, input }) => {
      const existingUser = await ctx.db.select().from(users).where(eq(users.username, input.username))
      return {
        available: existingUser.length === 0,
      }
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
