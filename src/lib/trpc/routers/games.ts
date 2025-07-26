import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { playerActions, playerStats, users } from '../../db/schema'
import { protectedProcedure, router } from '../server'

export const gamesRouter = router({
  // Round 1 Games - Technical Challenges (20 points each)

  // Game 1: Hidden Message Inspector
  inspectElementGame: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      answer: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0])
        throw new Error('User not found')

      const correctAnswer = 'FIREFOX_CIPHER_2025'
      const isCorrect = input.answer.toUpperCase() === correctAnswer
      const points = isCorrect ? 20 : 0

      // Record the attempt
      await ctx.db.insert(playerActions).values({
        userId: user[0].id,
        gameSessionId: input.gameSessionId,
        actionType: 'submitted_flag',
        result: isCorrect ? 'success' : 'failed',
        target: 'inspect_element_game',
        pointsEarned: points,
        metadata: {
          gameType: 'inspect_element',
          submittedAnswer: input.answer,
          correctAnswer,
        },
      })

      // Update player stats if correct
      if (isCorrect) {
        const currentStats = await ctx.db.select().from(playerStats).where(
          and(
            eq(playerStats.userId, user[0].id),
            eq(playerStats.gameSessionId, input.gameSessionId),
          ),
        )

        if (currentStats[0] != null && currentStats[0].points != null && currentStats[0].round1Points != null) {
          await ctx.db
            .update(playerStats)
            .set({
              points: currentStats[0].points + points,
              round1Points: (currentStats[0].round1Points ?? 0) + points,
            })
            .where(and(
              eq(playerStats.userId, user[0].id),
              eq(playerStats.gameSessionId, input.gameSessionId),
            ))
        }
      }

      return {
        success: isCorrect,
        points,
        message: isCorrect
          ? 'Correct! You found the hidden message in the HTML comments.'
          : 'Incorrect. Look for hidden HTML comments in the page source.',
      }
    }),

  // Game 2: Base64 Decoder
  base64DecoderGame: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      decodedMessage: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0])
        throw new Error('User not found')

      const correctAnswer = 'THE_TRUTH_IS_IN_THE_METADATA'
      const isCorrect = input.decodedMessage.toUpperCase() === correctAnswer
      const points = isCorrect ? 20 : 0

      await ctx.db.insert(playerActions).values({
        userId: user[0].id,
        gameSessionId: input.gameSessionId,
        actionType: 'submitted_flag',
        result: isCorrect ? 'success' : 'failed',
        target: 'base64_decoder_game',
        pointsEarned: points,
        metadata: {
          gameType: 'base64_decoder',
          submittedAnswer: input.decodedMessage,
          correctAnswer,
        },
      })

      if (isCorrect) {
        const currentStats = await ctx.db.select().from(playerStats).where(
          and(
            eq(playerStats.userId, user[0].id),
            eq(playerStats.gameSessionId, input.gameSessionId),
          ),
        )

        if (currentStats[0]) {
          await ctx.db
            .update(playerStats)
            .set({
              points: currentStats[0].points + points,
              round1Points: (currentStats[0].round1Points ?? 0) + points,
            })
            .where(and(
              eq(playerStats.userId, user[0].id),
              eq(playerStats.gameSessionId, input.gameSessionId),
            ))
        }
      }

      return {
        success: isCorrect,
        points,
        message: isCorrect
          ? 'Excellent! You decoded the base64 string correctly.'
          : 'Try decoding the base64 string found in the image metadata.',
      }
    }),

  // Game 3: Network Analysis
  networkAnalysisGame: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      endpoint: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0])
        throw new Error('User not found')

      const correctAnswer = '/api/secret/cipher-key'
      const isCorrect = input.endpoint === correctAnswer
      const points = isCorrect ? 20 : 0

      await ctx.db.insert(playerActions).values({
        userId: user[0].id,
        gameSessionId: input.gameSessionId,
        actionType: 'submitted_flag',
        result: isCorrect ? 'success' : 'failed',
        target: 'network_analysis_game',
        pointsEarned: points,
        metadata: {
          gameType: 'network_analysis',
          submittedAnswer: input.endpoint,
          correctAnswer,
        },
      })

      if (isCorrect) {
        const currentStats = await ctx.db.select().from(playerStats).where(
          and(
            eq(playerStats.userId, user[0].id),
            eq(playerStats.gameSessionId, input.gameSessionId),
          ),
        )

        if (currentStats[0]) {
          await ctx.db
            .update(playerStats)
            .set({
              points: currentStats[0].points + points,
              round1Points: (currentStats[0].round1Points ?? 0) + points,
            })
            .where(and(
              eq(playerStats.userId, user[0].id),
              eq(playerStats.gameSessionId, input.gameSessionId),
            ))
        }
      }

      return {
        success: isCorrect,
        points,
        message: isCorrect
          ? 'Perfect! You found the secret endpoint through network analysis.'
          : 'Check the Network tab in Developer Tools for hidden API calls.',
      }
    }),

  // Game 4: JavaScript Console Puzzle
  consolePuzzleGame: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      solution: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0])
        throw new Error('User not found')

      const correctAnswer = 'MOZILLA_FOUNDATION_1998'
      const isCorrect = input.solution.toUpperCase() === correctAnswer
      const points = isCorrect ? 20 : 0

      await ctx.db.insert(playerActions).values({
        userId: user[0].id,
        gameSessionId: input.gameSessionId,
        actionType: 'submitted_flag',
        result: isCorrect ? 'success' : 'failed',
        target: 'console_puzzle_game',
        pointsEarned: points,
        metadata: {
          gameType: 'console_puzzle',
          submittedAnswer: input.solution,
          correctAnswer,
        },
      })

      if (isCorrect) {
        const currentStats = await ctx.db.select().from(playerStats).where(
          and(
            eq(playerStats.userId, user[0].id),
            eq(playerStats.gameSessionId, input.gameSessionId),
          ),
        )

        if (currentStats[0]) {
          await ctx.db
            .update(playerStats)
            .set({
              points: currentStats[0].points + points,
              round1Points: (currentStats[0].round1Points ?? 0) + points,
            })
            .where(and(
              eq(playerStats.userId, user[0].id),
              eq(playerStats.gameSessionId, input.gameSessionId),
            ))
        }
      }

      return {
        success: isCorrect,
        points,
        message: isCorrect
          ? 'Brilliant! You solved the JavaScript console puzzle.'
          : 'Open the browser console and run the cipher function with the correct parameters.',
      }
    }),

  // Game 5: Form Data Extraction
  formExtractionGame: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      extractedData: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0])
        throw new Error('User not found')

      const correctAnswer = 'HIDDEN_FORM_VALUE_2025'
      const isCorrect = input.extractedData.toUpperCase() === correctAnswer
      const points = isCorrect ? 20 : 0

      await ctx.db.insert(playerActions).values({
        userId: user[0].id,
        gameSessionId: input.gameSessionId,
        actionType: 'submitted_flag',
        result: isCorrect ? 'success' : 'failed',
        target: 'form_extraction_game',
        pointsEarned: points,
        metadata: {
          gameType: 'form_extraction',
          submittedAnswer: input.extractedData,
          correctAnswer,
        },
      })

      if (isCorrect) {
        const currentStats = await ctx.db.select().from(playerStats).where(
          and(
            eq(playerStats.userId, user[0].id),
            eq(playerStats.gameSessionId, input.gameSessionId),
          ),
        )

        if (currentStats[0]) {
          await ctx.db
            .update(playerStats)
            .set({
              points: currentStats[0].points + points,
              round1Points: (currentStats[0].round1Points ?? 0) + points,
            })
            .where(and(
              eq(playerStats.userId, user[0].id),
              eq(playerStats.gameSessionId, input.gameSessionId),
            ))
        }
      }

      return {
        success: isCorrect,
        points,
        message: isCorrect
          ? 'Excellent! You extracted the hidden data from the broken form.'
          : 'Look for hidden input fields or data attributes in the form elements.',
      }
    }),

  // Get game progress for a player
  getGameProgress: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0])
        throw new Error('User not found')

      const gameActions = await ctx.db
        .select()
        .from(playerActions)
        .where(
          and(
            eq(playerActions.userId, user[0].id),
            eq(playerActions.gameSessionId, input.gameSessionId),
            eq(playerActions.actionType, 'submitted_flag'),
          ),
        )

      const completedGames = gameActions
        .filter(action => action.result === 'success')
        .map(action => action.target)

      const totalPoints = gameActions
        .filter(action => action.result === 'success')
        .reduce((sum, action) => sum + (action.pointsEarned || 0), 0)

      // Calculate attempt counts for each game
      const gameTargets = [
        'inspect_element_game',
        'base64_decoder_game',
        'network_analysis_game',
        'console_puzzle_game',
        'form_extraction_game',
      ]

      const attemptCounts = gameTargets.reduce((acc, target) => {
        const attempts = gameActions.filter(action => action.target === target)
        acc[target] = {
          total: attempts.length,
          successful: attempts.filter(action => action.result === 'success').length,
          failed: attempts.filter(action => action.result === 'failed').length,
          isCompleted: attempts.some(action => action.result === 'success'),
        }
        return acc
      }, {} as Record<string, { total: number, successful: number, failed: number, isCompleted: boolean }>)

      return {
        completedGames,
        totalPoints,
        gamesCompleted: completedGames.length,
        totalGames: 5,
        attemptCounts,
      }
    }),

  // Get game hints (costs 5 points)
  getGameHint: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      gameType: z.enum(['inspect_element', 'base64_decoder', 'network_analysis', 'console_puzzle', 'form_extraction']),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0])
        throw new Error('User not found')

      // Check if player has enough points
      const currentStats = await ctx.db.select().from(playerStats).where(
        and(
          eq(playerStats.userId, user[0].id),
          eq(playerStats.gameSessionId, input.gameSessionId),
        ),
      )

      if (!currentStats[0] || currentStats[0].points < 5) {
        throw new Error('Not enough points for hint (5 points required)')
      }

      const hints = {
        inspect_element: 'Look for HTML comments in the page source. They often contain hidden messages.',
        base64_decoder: 'Check the metadata of images on the page. Base64 strings often look like random letters and numbers.',
        network_analysis: 'Open Developer Tools and check the Network tab. Look for API calls that might reveal secret endpoints.',
        console_puzzle: 'Open the browser console (F12) and look for any JavaScript functions that might need to be called.',
        form_extraction: 'Inspect form elements for hidden input fields or data attributes that might contain secret values.',
      }

      // Deduct 5 points for hint
      await ctx.db
        .update(playerStats)
        .set({
          points: currentStats[0].points - 5,
        })
        .where(and(
          eq(playerStats.userId, user[0].id),
          eq(playerStats.gameSessionId, input.gameSessionId),
        ))

      // Record hint usage
      await ctx.db.insert(playerActions).values({
        userId: user[0].id,
        gameSessionId: input.gameSessionId,
        actionType: 'used_hint',
        result: 'neutral',
        target: `${input.gameType}_hint`,
        pointsEarned: -5,
        metadata: {
          gameType: input.gameType,
          hintUsed: true,
          pointsCost: 5,
        },
      })

      return {
        hint: hints[input.gameType],
        gameType: input.gameType,
        pointsDeducted: 5,
      }
    }),

  // Skip a game (no points awarded)
  skipGame: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      gameType: z.enum(['inspect_element', 'base64_decoder', 'network_analysis', 'console_puzzle', 'form_extraction']),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0])
        throw new Error('User not found')

      const gameTargets = {
        inspect_element: 'inspect_element_game',
        base64_decoder: 'base64_decoder_game',
        network_analysis: 'network_analysis_game',
        console_puzzle: 'console_puzzle_game',
        form_extraction: 'form_extraction_game',
      }

      // Record skip action
      await ctx.db.insert(playerActions).values({
        userId: user[0].id,
        gameSessionId: input.gameSessionId,
        actionType: 'submitted_flag',
        result: 'neutral',
        target: gameTargets[input.gameType],
        pointsEarned: 0,
        metadata: {
          gameType: input.gameType,
          skipped: true,
        },
      })

      return {
        success: true,
        message: 'Game skipped. You can continue to the next challenge.',
        gameType: input.gameType,
      }
    }),
})
