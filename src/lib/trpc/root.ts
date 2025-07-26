import { and, desc, eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import {
  challenges,
  challengeSubmissions,
  chatMessages,
  gameSessions,
  notifications,
  playerActions,
  playerStats,
  users,
} from '../db/schema'
import { generatePlayerId } from '../utils/player-id'
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
  createOrGetUser: protectedProcedure
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

        let playerId = generatePlayerId()
        let attempts = 0
        const maxAttempts = 10

        while (attempts < maxAttempts) {
          const playerIdExists = await ctx.db.select().from(users).where(eq(users.playerId, playerId))
          if (playerIdExists.length === 0) {
            break
          }
          playerId = generatePlayerId()
          attempts++
        }

        if (attempts >= maxAttempts) {
          throw new Error('Failed to generate unique player ID')
        }

        const userValues: Record<string, any> = {
          clerkId: ctx.userId,
          playerId,
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

  onboardUser: protectedProcedure
    .input(z.object({
      username: z.string().min(3).max(50),
      email: z.string().email(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if username is already taken
        const existingUser = await ctx.db.select().from(users).where(eq(users.username, input.username))
        if (existingUser.length > 0) {
          throw new Error('Username already exists')
        }

        // Check if user already exists
        const existingUserByClerkId = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
        if (existingUserByClerkId.length > 0) {
          // Update existing user with username
          const updatedUser = await ctx.db
            .update(users)
            .set({
              username: input.username,
              firstName: input.firstName,
              lastName: input.lastName,
              imageUrl: input.imageUrl,
            })
            .where(eq(users.clerkId, ctx.userId))
            .returning()

          return updatedUser[0]
        }

        let playerId = generatePlayerId()
        let attempts = 0
        const maxAttempts = 10

        while (attempts < maxAttempts) {
          const playerIdExists = await ctx.db.select().from(users).where(eq(users.playerId, playerId))
          if (playerIdExists.length === 0) {
            break
          }
          playerId = generatePlayerId()
          attempts++
        }

        if (attempts >= maxAttempts) {
          throw new Error('Failed to generate unique player ID')
        }

        const userValues = {
          clerkId: ctx.userId,
          playerId,
          username: input.username,
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          imageUrl: input.imageUrl,
        }

        const user = await ctx.db.insert(users).values(userValues).returning()

        return user[0]
      }
      catch (error) {
        if (error instanceof Error) {
          throw error
        }
        throw new Error('Failed to onboard user')
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

  // Game procedures
  getCurrentGameSession: protectedProcedure
    .query(async ({ ctx }) => {
      const session = await ctx.db
        .select()
        .from(gameSessions)
        .where(eq(gameSessions.isActive, true))
        .orderBy(desc(gameSessions.createdAt))
        .limit(1)

      return session[0] || null
    }),

  createGameSession: protectedProcedure
    .input(z.object({
      name: z.string(),
      settings: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.db.insert(gameSessions).values({
        name: input.name,
        settings: input.settings || {},
      }).returning()

      return session[0]
    }),

  getPlayerStats: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0])
        return null

      const stats = await ctx.db
        .select()
        .from(playerStats)
        .where(
          and(
            eq(playerStats.userId, user[0].id),
            eq(playerStats.gameSessionId, input.gameSessionId),
          ),
        )

      return stats[0] || null
    }),

  getLeaderboard: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const leaderboard = await ctx.db
        .select({
          id: playerStats.id,
          userId: playerStats.userId,
          points: playerStats.points,
          rank: playerStats.rank,
          status: playerStats.status,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
        })
        .from(playerStats)
        .innerJoin(users, eq(playerStats.userId, users.id))
        .where(eq(playerStats.gameSessionId, input.gameSessionId))
        .orderBy(desc(playerStats.points))

      // Calculate ranks
      return leaderboard.map((player, index) => ({
        ...player,
        rank: index + 1,
      }))
    }),

  getPlayerActions: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      limit: z.number().optional().default(50),
    }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0])
        return []

      const actions = await ctx.db
        .select({
          id: playerActions.id,
          actionType: playerActions.actionType,
          result: playerActions.result,
          target: playerActions.target,
          pointsEarned: playerActions.pointsEarned,
          createdAt: playerActions.createdAt,
        })
        .from(playerActions)
        .where(
          and(
            eq(playerActions.userId, user[0].id),
            eq(playerActions.gameSessionId, input.gameSessionId),
          ),
        )
        .orderBy(desc(playerActions.createdAt))
        .limit(input.limit)

      return actions
    }),

  getChatMessages: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      limit: z.number().optional().default(100),
    }))
    .query(async ({ ctx, input }) => {
      const messages = await ctx.db
        .select({
          id: chatMessages.id,
          message: chatMessages.message,
          createdAt: chatMessages.createdAt,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
        })
        .from(chatMessages)
        .innerJoin(users, eq(chatMessages.userId, users.id))
        .where(eq(chatMessages.gameSessionId, input.gameSessionId))
        .orderBy(desc(chatMessages.createdAt))
        .limit(input.limit)

      return messages.reverse() // Show oldest first
    }),

  sendChatMessage: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      message: z.string().min(1).max(1000),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0])
        throw new Error('User not found')

      const chatMessage = await ctx.db.insert(chatMessages).values({
        gameSessionId: input.gameSessionId,
        userId: user[0].id,
        message: input.message,
      }).returning()

      return chatMessage[0]
    }),

  getNotifications: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      limit: z.number().optional().default(20),
    }))
    .query(async ({ ctx, input }) => {
      const notificationsList = await ctx.db
        .select({
          id: notifications.id,
          type: notifications.type,
          title: notifications.title,
          message: notifications.message,
          createdAt: notifications.createdAt,
        })
        .from(notifications)
        .where(
          eq(notifications.gameSessionId, input.gameSessionId)
          && eq(notifications.isActive, true),
        )
        .orderBy(desc(notifications.createdAt))
        .limit(input.limit)

      return notificationsList
    }),

  createNotification: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      type: z.enum(['info', 'warning', 'success', 'error']),
      title: z.string().optional(),
      message: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const notification = await ctx.db.insert(notifications).values({
        gameSessionId: input.gameSessionId,
        type: input.type,
        title: input.title,
        message: input.message,
      }).returning()

      return notification[0]
    }),

  recordPlayerAction: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      actionType: z.enum(['started_challenge', 'completed_challenge', 'used_hint', 'submitted_flag', 'used_lifeline', 'formed_alliance', 'betrayed_alliance']),
      result: z.enum(['success', 'failed', 'neutral']),
      target: z.string().optional(),
      pointsEarned: z.number().optional().default(0),
      challengeId: z.number().optional(),
      metadata: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0])
        throw new Error('User not found')

      const action = await ctx.db.insert(playerActions).values({
        userId: user[0].id,
        gameSessionId: input.gameSessionId,
        actionType: input.actionType,
        result: input.result,
        target: input.target,
        pointsEarned: input.pointsEarned,
        challengeId: input.challengeId,
        metadata: input.metadata,
      }).returning()

      return action[0]
    }),

  updatePlayerStats: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      points: z.number().optional(),
      status: z.enum(['online', 'away', 'offline']).optional(),
      lifelines: z.record(z.string(), z.number()).optional(),
      currentStreak: z.number().optional(),
      level: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0])
        throw new Error('User not found')

      // Check if player stats exist
      const existingStats = await ctx.db
        .select()
        .from(playerStats)
        .where(
          eq(playerStats.userId, user[0].id)
          && eq(playerStats.gameSessionId, input.gameSessionId),
        )

      if (existingStats.length === 0) {
        // Create new player stats
        const stats = await ctx.db.insert(playerStats).values({
          userId: user[0].id,
          gameSessionId: input.gameSessionId,
          points: input.points || 0,
          status: input.status || 'online',
          lifelines: input.lifelines || { snitch: 2, sabotage: 1, boost: 1, intel: 3 },
          currentStreak: input.currentStreak || 0,
          level: input.level || 1,
        }).returning()

        return stats[0]
      }
      else {
        // Update existing stats
        const updateData: any = {}
        if (input.points !== undefined)
          updateData.points = input.points
        if (input.status !== undefined)
          updateData.status = input.status
        if (input.lifelines !== undefined)
          updateData.lifelines = input.lifelines
        if (input.currentStreak !== undefined)
          updateData.currentStreak = input.currentStreak
        if (input.level !== undefined)
          updateData.level = input.level
        updateData.lastActiveAt = new Date()

        const stats = await ctx.db
          .update(playerStats)
          .set(updateData)
          .where(and(
            eq(playerStats.userId, user[0].id),
            eq(playerStats.gameSessionId, input.gameSessionId),
          ))
          .returning()

        return stats[0]
      }
    }),

  getChallenges: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      round: z.enum(['round_1', 'round_2', 'round_3']).optional(),
      isActive: z.boolean().optional().default(true),
    }))
    .query(async ({ ctx, input }) => {
      let whereCondition = eq(challenges.gameSessionId, input.gameSessionId)

      if (input.round) {
        whereCondition = whereCondition && eq(challenges.round, input.round)
      }

      if (input.isActive !== undefined) {
        whereCondition = whereCondition && eq(challenges.isActive, input.isActive)
      }

      const challengesList = await ctx.db
        .select()
        .from(challenges)
        .where(whereCondition)
        .orderBy(challenges.createdAt)

      return challengesList
    }),

  submitChallengeFlag: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      challengeId: z.number(),
      flag: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0])
        throw new Error('User not found')

      // Get the challenge
      const challenge = await ctx.db
        .select()
        .from(challenges)
        .where(eq(challenges.id, input.challengeId))

      if (!challenge[0])
        throw new Error('Challenge not found')

      const isCorrect = challenge[0].flag === input.flag
      const pointsAwarded = isCorrect ? challenge[0].points : 0

      // Record submission
      const submission = await ctx.db.insert(challengeSubmissions).values({
        userId: user[0].id,
        challengeId: input.challengeId,
        gameSessionId: input.gameSessionId,
        submittedFlag: input.flag,
        isCorrect,
        pointsAwarded,
      }).returning()

      // Record player action
      await ctx.db.insert(playerActions).values({
        userId: user[0].id,
        gameSessionId: input.gameSessionId,
        challengeId: input.challengeId,
        actionType: 'submitted_flag',
        result: isCorrect ? 'success' : 'failed',
        target: challenge[0].title,
        pointsEarned: pointsAwarded,
      })

      // Update player stats if correct
      if (isCorrect) {
        const currentStats = await ctx.db
          .select()
          .from(playerStats)
          .where(
            and(
              eq(playerStats.userId, user[0].id),
              eq(playerStats.gameSessionId, input.gameSessionId),
            ),
          )

        if (currentStats.length > 0) {
          await ctx.db
            .update(playerStats)
            .set({
              points: sql`${playerStats.points} + ${pointsAwarded}`,
              currentStreak: sql`${playerStats.currentStreak} + 1`,
            })
            .where(and(
              eq(playerStats.userId, user[0].id),
              eq(playerStats.gameSessionId, input.gameSessionId),
            ))
        }
      }

      return {
        submission: submission[0],
        isCorrect,
        pointsAwarded,
      }
    }),
})

export type AppRouter = typeof appRouter
