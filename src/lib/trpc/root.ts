import { and, desc, eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import {
  challenges,
  challengeSubmissions,
  chatMessages,
  gameSessions,
  lifelineUsage,
  notifications,
  playerActions,
  playerStats,
  users,
} from '../db/schema'
import { generatePlayerId } from '../utils/player-id'
import { gamesRouter } from './routers/games'
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
      // Get all users and their stats (if they exist)
      const leaderboard = await ctx.db
        .select({
          id: users.id,
          userId: users.id,
          points: sql<number>`COALESCE(${playerStats.points}, 0)`.as('points'),
          status: sql<string>`COALESCE(${playerStats.status}, 'offline')`.as('status'),
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          imageUrl: users.imageUrl,
          playerStatsId: playerStats.id,
        })
        .from(users)
        .leftJoin(playerStats, and(
          eq(playerStats.userId, users.id),
          eq(playerStats.gameSessionId, input.gameSessionId),
        ))
        .orderBy(sql`COALESCE(${playerStats.points}, 0) DESC`)

      // Auto-create player stats for users who don't have them
      const usersWithoutStats = leaderboard.filter(player => !player.playerStatsId)

      if (usersWithoutStats.length > 0) {
        await Promise.all(
          usersWithoutStats.map(user =>
            ctx.db.insert(playerStats).values({
              userId: user.userId,
              gameSessionId: input.gameSessionId,
              points: 0,
              status: 'offline',
              lifelines: { snitch: 2, sabotage: 1, boost: 1, intel: 3 },
              currentStreak: 0,
              level: 1,
            }).onConflictDoNothing(),
          ),
        )

        // Re-fetch the leaderboard with the newly created stats
        const updatedLeaderboard = await ctx.db
          .select({
            id: users.id,
            userId: users.id,
            points: sql<number>`COALESCE(${playerStats.points}, 0)`.as('points'),
            status: sql<string>`COALESCE(${playerStats.status}, 'offline')`.as('status'),
            username: users.username,
            firstName: users.firstName,
            lastName: users.lastName,
            imageUrl: users.imageUrl,
            playerStatsId: playerStats.id,
          })
          .from(users)
          .leftJoin(playerStats, and(
            eq(playerStats.userId, users.id),
            eq(playerStats.gameSessionId, input.gameSessionId),
          ))
          .orderBy(sql`COALESCE(${playerStats.points}, 0) DESC`)

        // Calculate ranks with proper tie handling
        let currentRank = 1
        let previousPoints: number | null = null
        let playersAtCurrentRank = 0

        return updatedLeaderboard.map((player, _index) => {
          const points = Number(player.points) || 0

          if (previousPoints !== null && points < previousPoints) {
            // Points decreased, so rank increases by the number of players at the previous rank
            currentRank += playersAtCurrentRank
            playersAtCurrentRank = 1
          }
          else if (previousPoints === null || points === previousPoints) {
            // First player or same points as previous player (tie)
            playersAtCurrentRank++
          }

          previousPoints = points

          return {
            ...player,
            rank: currentRank,
            points,
            status: player.status as 'online' | 'away' | 'offline',
          }
        })
      }

      // Calculate ranks with proper tie handling
      let currentRank = 1
      let previousPoints: number | null = null
      let playersAtCurrentRank = 0

      return leaderboard.map((player, _index) => {
        const points = Number(player.points) || 0

        if (previousPoints !== null && points < previousPoints) {
          // Points decreased, so rank increases by the number of players at the previous rank
          currentRank += playersAtCurrentRank
          playersAtCurrentRank = 1
        }
        else if (previousPoints === null || points === previousPoints) {
          // First player or same points as previous player (tie)
          playersAtCurrentRank++
        }

        previousPoints = points

        return {
          ...player,
          rank: currentRank,
          points,
          status: player.status as 'online' | 'away' | 'offline',
        }
      })
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

      return messages.reverse()
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

  useLifeline: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      lifelineType: z.enum(['snitch', 'sabotage', 'boost', 'intel']),
      targetUserId: z.number().optional(),
      metadata: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0])
        throw new Error('User not found')

      // Get current player stats
      const playerStatsData = await ctx.db
        .select()
        .from(playerStats)
        .where(
          and(
            eq(playerStats.userId, user[0].id),
            eq(playerStats.gameSessionId, input.gameSessionId),
          ),
        )

      if (!playerStatsData[0])
        throw new Error('Player stats not found')

      const currentLifelines = playerStatsData[0].lifelines as Record<string, number> || {}
      const currentCount = currentLifelines[input.lifelineType] || 0

      if (currentCount <= 0)
        throw new Error('No lifelines of this type remaining')

      // Update lifelines count
      const newLifelines = {
        ...currentLifelines,
        [input.lifelineType]: currentCount - 1,
      }

      // Update player stats
      await ctx.db
        .update(playerStats)
        .set({
          lifelines: newLifelines,
          lastActiveAt: new Date(),
        })
        .where(and(
          eq(playerStats.userId, user[0].id),
          eq(playerStats.gameSessionId, input.gameSessionId),
        ))

      // Record lifeline usage
      const lifelineUsageRecord = await ctx.db.insert(lifelineUsage).values({
        userId: user[0].id,
        gameSessionId: input.gameSessionId,
        lifelineType: input.lifelineType,
        targetUserId: input.targetUserId,
        metadata: input.metadata,
      }).returning()

      // Record player action
      await ctx.db.insert(playerActions).values({
        userId: user[0].id,
        gameSessionId: input.gameSessionId,
        actionType: 'used_lifeline',
        result: 'success',
        target: input.lifelineType,
        metadata: { lifelineType: input.lifelineType, ...input.metadata },
      })

      return {
        lifelineUsage: lifelineUsageRecord[0],
        remainingCount: currentCount - 1,
      }
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

  // Player interaction procedures
  sabotagePlayer: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      targetUserId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0])
        throw new Error('User not found')

      // Get target player stats
      const targetStats = await ctx.db
        .select()
        .from(playerStats)
        .where(
          and(
            eq(playerStats.userId, input.targetUserId),
            eq(playerStats.gameSessionId, input.gameSessionId),
          ),
        )

      if (!targetStats[0])
        throw new Error('Target player not found')

      // Calculate 25% point loss
      const pointsToLose = Math.floor(targetStats[0].points * 0.25)
      const newPoints = Math.max(0, targetStats[0].points - pointsToLose)

      // Update target player points
      await ctx.db
        .update(playerStats)
        .set({
          points: newPoints,
          lastActiveAt: new Date(),
        })
        .where(and(
          eq(playerStats.userId, input.targetUserId),
          eq(playerStats.gameSessionId, input.gameSessionId),
        ))

      // Record the sabotage action
      await ctx.db.insert(playerActions).values({
        userId: user[0].id,
        gameSessionId: input.gameSessionId,
        actionType: 'used_lifeline',
        result: 'success',
        target: `sabotage_user_${input.targetUserId}`,
        pointsEarned: 0,
        metadata: {
          lifelineType: 'sabotage',
          targetUserId: input.targetUserId,
          pointsLost: pointsToLose,
        },
      })

      return {
        success: true,
        pointsLost: pointsToLose,
        targetNewPoints: newPoints,
      }
    }),

  getPlayerDetails: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      targetUserId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const targetUser = await ctx.db
        .select({
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          imageUrl: users.imageUrl,
        })
        .from(users)
        .where(eq(users.id, input.targetUserId))

      if (!targetUser[0])
        throw new Error('User not found')

      const targetStats = await ctx.db
        .select()
        .from(playerStats)
        .where(
          and(
            eq(playerStats.userId, input.targetUserId),
            eq(playerStats.gameSessionId, input.gameSessionId),
          ),
        )

      // Get recent actions for this player
      const recentActions = await ctx.db
        .select({
          actionType: playerActions.actionType,
          result: playerActions.result,
          pointsEarned: playerActions.pointsEarned,
          createdAt: playerActions.createdAt,
        })
        .from(playerActions)
        .where(
          and(
            eq(playerActions.userId, input.targetUserId),
            eq(playerActions.gameSessionId, input.gameSessionId),
          ),
        )
        .orderBy(desc(playerActions.createdAt))
        .limit(5)

      return {
        user: targetUser[0],
        stats: targetStats[0] || null,
        recentActions,
      }
    }),

  getTopPlayersDetails: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const topPlayers = await ctx.db
        .select({
          userId: playerStats.userId,
          points: playerStats.points,
          rank: playerStats.rank,
          status: playerStats.status,
          round1Points: playerStats.round1Points,
          round2Points: playerStats.round2Points,
          round3Points: playerStats.round3Points,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
        })
        .from(playerStats)
        .innerJoin(users, eq(playerStats.userId, users.id))
        .where(eq(playerStats.gameSessionId, input.gameSessionId))
        .orderBy(desc(playerStats.points))
        .limit(3)

      // Get recent actions for each top player
      const playersWithActions = await Promise.all(
        topPlayers.map(async (player) => {
          const recentActions = await ctx.db
            .select({
              actionType: playerActions.actionType,
              result: playerActions.result,
              pointsEarned: playerActions.pointsEarned,
              createdAt: playerActions.createdAt,
            })
            .from(playerActions)
            .where(
              and(
                eq(playerActions.userId, player.userId),
                eq(playerActions.gameSessionId, input.gameSessionId),
              ),
            )
            .orderBy(desc(playerActions.createdAt))
            .limit(3)

          return {
            ...player,
            recentActions,
          }
        }),
      )

      return playersWithActions
    }),

  grantUnderdogTokens: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      targetUserIds: z.array(z.number()),
      tokenCount: z.number().default(3),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0])
        throw new Error('User not found')

      // Update each target user's stats to add underdog tokens
      const results = await Promise.all(
        input.targetUserIds.map(async (targetUserId) => {
          const targetStats = await ctx.db
            .select()
            .from(playerStats)
            .where(
              and(
                eq(playerStats.userId, targetUserId),
                eq(playerStats.gameSessionId, input.gameSessionId),
              ),
            )

          if (targetStats[0]) {
            const currentLifelines = targetStats[0].lifelines as Record<string, number> || {}
            const newLifelines = {
              ...currentLifelines,
              underdog: (currentLifelines.underdog || 0) + input.tokenCount,
            }

            await ctx.db
              .update(playerStats)
              .set({
                lifelines: newLifelines,
                lastActiveAt: new Date(),
              })
              .where(and(
                eq(playerStats.userId, targetUserId),
                eq(playerStats.gameSessionId, input.gameSessionId),
              ))

            return { userId: targetUserId, tokensGranted: input.tokenCount }
          }
          return null
        }),
      )

      return results.filter(Boolean)
    }),

  // Games router
  games: gamesRouter,
})

export type AppRouter = typeof appRouter
