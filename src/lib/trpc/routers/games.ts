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

  // Round 2 Games - Director's Game (Round 1 winner controls the game)

  // Check who is the current director (Round 1 winner)
  getRound1Winner: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const allPlayers = await ctx.db.select().from(playerStats).where(
        eq(playerStats.gameSessionId, input.gameSessionId),
      )

      // Find player with highest round1Points
      const winner = allPlayers.reduce((prev, current) => {
        return (current.round1Points || 0) > (prev.round1Points || 0) ? current : prev
      })

      if (!winner) {
        throw new Error('No Round 1 winner found')
      }

      const winnerUser = await ctx.db.select().from(users).where(eq(users.id, winner.userId))

      return {
        winnerId: winner.userId,
        winnerName: winnerUser[0]?.username || winnerUser[0]?.firstName || 'Unknown Player',
        winnerPoints: winner.round1Points || 0,
      }
    }),

  // Director selects two games out of three available options
  directorSelectGames: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      selectedGames: z.array(z.enum(['curse_distribution', 'pandoras_box', 'equi_blessing'])).length(2),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0]) {
        throw new Error('User not found')
      }

      // Verify user is the Round 1 winner (director)
      const round1Winner = await ctx.db.select().from(playerStats).where(
        eq(playerStats.gameSessionId, input.gameSessionId),
      )
      const winner = round1Winner.reduce((prev, current) => {
        return (current.round1Points || 0) > (prev.round1Points || 0) ? current : prev
      })

      if (winner.userId !== user[0].id) {
        throw new Error('Only the Round 1 winner can select games')
      }

      // Record the game selection
      await ctx.db.insert(playerActions).values({
        userId: user[0].id,
        gameSessionId: input.gameSessionId,
        actionType: 'started_challenge',
        result: 'success',
        target: 'director_game_selection',
        pointsEarned: 0,
        metadata: {
          gameType: 'director_selection',
          selectedGames: input.selectedGames,
          timestamp: new Date().toISOString(),
        },
      })

      return {
        success: true,
        selectedGames: input.selectedGames,
        message: `Director has selected: ${input.selectedGames.join(' and ').replace(/_/g, ' ').toUpperCase()}`,
      }
    }),

  // Get director's selected games
  getDirectorSelectedGames: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const selectionAction = await ctx.db.select().from(playerActions).where(
        and(
          eq(playerActions.gameSessionId, input.gameSessionId),
          eq(playerActions.target, 'director_game_selection'),
        ),
      )

      if (selectionAction.length === 0) {
        return { selectedGames: null, director: null }
      }

      const latest = selectionAction[selectionAction.length - 1]
      const directorUser = await ctx.db.select().from(users).where(eq(users.id, latest.userId))

      return {
        selectedGames: (latest.metadata as { selectedGames?: string[] })?.selectedGames || null,
        director: directorUser[0]?.username || directorUser[0]?.firstName || 'Unknown Player',
      }
    }),

  // Game 1: Community Vote for Curse Distribution (Auction-based)
  curseDistributionGame: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      bidAmount: z.number().min(10).max(100), // Must be multiple of 10
      targetPlayerId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0]) {
        throw new Error('User not found')
      }

      // Check if bidAmount is multiple of 10
      if (input.bidAmount % 10 !== 0) {
        throw new Error('Bid amount must be in multiples of 10')
      }

      // Check if user already placed a bid
      const existingBid = await ctx.db.select()
        .from(playerActions)
        .where(
          and(
            eq(playerActions.userId, user[0].id),
            eq(playerActions.gameSessionId, input.gameSessionId),
            eq(playerActions.target, 'curse_distribution_game'),
          ),
        )

      if (existingBid.length > 0) {
        throw new Error('You have already placed a bid in this auction')
      }

      // Count total bids so far
      const allBids = await ctx.db.select()
        .from(playerActions)
        .where(
          and(
            eq(playerActions.gameSessionId, input.gameSessionId),
            eq(playerActions.target, 'curse_distribution_game'),
          ),
        )

      if (allBids.length >= 5) {
        throw new Error('Maximum number of bids (5) has been reached')
      }

      const playerStats_ = await ctx.db.select().from(playerStats).where(
        and(
          eq(playerStats.userId, user[0].id),
          eq(playerStats.gameSessionId, input.gameSessionId),
        ),
      )

      if (!playerStats_[0] || (playerStats_[0].points || 0) < input.bidAmount) {
        throw new Error('Insufficient points for this bid')
      }

      // Record the bid
      await ctx.db.insert(playerActions).values({
        userId: user[0].id,
        gameSessionId: input.gameSessionId,
        actionType: 'submitted_flag',
        result: 'success',
        target: 'curse_distribution_game',
        pointsEarned: -input.bidAmount, // Deduct bid amount
        metadata: {
          gameType: 'curse_auction',
          bidAmount: input.bidAmount,
          targetPlayerId: input.targetPlayerId,
          timestamp: new Date().toISOString(),
        },
      })

      // Deduct bid amount immediately
      await ctx.db
        .update(playerStats)
        .set({
          points: (playerStats_[0].points || 0) - input.bidAmount,
          round2Points: (playerStats_[0].round2Points || 0) - input.bidAmount,
        })
        .where(and(
          eq(playerStats.userId, user[0].id),
          eq(playerStats.gameSessionId, input.gameSessionId),
        ))

      return {
        success: true,
        bidAmount: input.bidAmount,
        message: `Bid placed: ${input.bidAmount} points to curse target player`,
      }
    }),

  // Execute curse (called by admin/director after auction ends)
  executeCurse: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Find highest bidder
      const curseActions = await ctx.db.select().from(playerActions).where(
        and(
          eq(playerActions.gameSessionId, input.gameSessionId),
          eq(playerActions.target, 'curse_distribution_game'),
        ),
      )

      if (curseActions.length === 0) {
        throw new Error('No curse bids found')
      }

      // Find highest bid
      const highestBid = curseActions.reduce((prev, current) => {
        const prevBid = (prev.metadata as { bidAmount?: number })?.bidAmount || 0
        const currentBid = (current.metadata as { bidAmount?: number })?.bidAmount || 0
        return currentBid > prevBid ? current : prev
      })

      const targetPlayerId = (highestBid.metadata as { targetPlayerId?: number })?.targetPlayerId
      if (!targetPlayerId) {
        throw new Error('No target player found')
      }

      // Apply curse (-60 points to target)
      const targetStats = await ctx.db.select().from(playerStats).where(
        and(
          eq(playerStats.userId, targetPlayerId),
          eq(playerStats.gameSessionId, input.gameSessionId),
        ),
      )

      if (targetStats[0]) {
        await ctx.db
          .update(playerStats)
          .set({
            points: Math.max(0, (targetStats[0].points || 0) - 60),
            round2Points: (targetStats[0].round2Points || 0) - 60,
          })
          .where(and(
            eq(playerStats.userId, targetPlayerId),
            eq(playerStats.gameSessionId, input.gameSessionId),
          ))

        // Record curse execution
        await ctx.db.insert(playerActions).values({
          userId: targetPlayerId,
          gameSessionId: input.gameSessionId,
          actionType: 'submitted_flag',
          result: 'failed',
          target: 'curse_executed',
          pointsEarned: -60,
          metadata: {
            gameType: 'curse_effect',
            cursedBy: highestBid.userId,
            bidAmount: (highestBid.metadata as { bidAmount?: number })?.bidAmount,
          },
        })
      }

      return {
        success: true,
        highestBidder: highestBid.userId,
        bidAmount: (highestBid.metadata as { bidAmount?: number })?.bidAmount,
        targetPlayer: targetPlayerId,
        message: 'Curse executed successfully',
      }
    }),

  // Game 2: Pandora's Box
  pandorasBoxGame: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      selectedBox: z.number().min(1).max(4), // Box 1, 2, 3, or 4
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0]) {
        throw new Error('User not found')
      }

      // Check if user already selected a box
      const previousSelection = await ctx.db.select()
        .from(playerActions)
        .where(
          and(
            eq(playerActions.userId, user[0].id),
            eq(playerActions.gameSessionId, input.gameSessionId),
            eq(playerActions.target, 'pandoras_box_game'),
          ),
        )

      if (previousSelection.length > 0) {
        throw new Error('You have already selected a box in Pandora\'s Box game')
      }

      // Check if user is the director
      const round1Winner = await ctx.db.select().from(playerStats).where(
        eq(playerStats.gameSessionId, input.gameSessionId),
      )
      const winner = round1Winner.reduce((prev, current) => {
        return (current.round1Points || 0) > (prev.round1Points || 0) ? current : prev
      })

      const isDirector = winner.userId === user[0].id

      let boxOutcomes: number[]
      let pointsAwarded: number

      if (isDirector) {
        // Director has 1 guaranteed +100 box, 3 -50 boxes
        boxOutcomes = [100, -50, -50, -50]
        // Shuffle the outcomes
        for (let i = boxOutcomes.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[boxOutcomes[i], boxOutcomes[j]] = [boxOutcomes[j], boxOutcomes[i]]
        }
        pointsAwarded = boxOutcomes[input.selectedBox - 1]
      }
      else {
        // Other players have 50/50 chance: 2 boxes with +100, 2 boxes with -50
        boxOutcomes = [100, 100, -50, -50]
        // Shuffle the outcomes
        for (let i = boxOutcomes.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[boxOutcomes[i], boxOutcomes[j]] = [boxOutcomes[j], boxOutcomes[i]]
        }
        pointsAwarded = boxOutcomes[input.selectedBox - 1]
      }

      // Record the game play
      await ctx.db.insert(playerActions).values({
        userId: user[0].id,
        gameSessionId: input.gameSessionId,
        actionType: 'submitted_flag',
        result: pointsAwarded > 0 ? 'success' : 'failed',
        target: 'pandoras_box_game',
        pointsEarned: pointsAwarded,
        metadata: {
          gameType: 'pandoras_box',
          selectedBox: input.selectedBox,
          pointsAwarded,
          isDirector,
          allBoxOutcomes: boxOutcomes,
        },
      })

      // Update player stats
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
            points: Math.max(0, (currentStats[0].points || 0) + pointsAwarded),
            round2Points: (currentStats[0].round2Points || 0) + pointsAwarded,
          })
          .where(and(
            eq(playerStats.userId, user[0].id),
            eq(playerStats.gameSessionId, input.gameSessionId),
          ))
      }

      return {
        success: true,
        pointsAwarded,
        selectedBox: input.selectedBox,
        isDirector,
        message: pointsAwarded > 0
          ? `Lucky! Box ${input.selectedBox} contained +${pointsAwarded} points!`
          : `Unlucky! Box ${input.selectedBox} contained ${pointsAwarded} points.`,
      }
    }),

  // Game 3: Equi Blessing (Point Inflation)
  equiBlessingGame: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0]) {
        throw new Error('User not found')
      }

      // Give 10 points to all players
      const allPlayers = await ctx.db.select().from(playerStats).where(
        eq(playerStats.gameSessionId, input.gameSessionId),
      )

      for (const player of allPlayers) {
        await ctx.db
          .update(playerStats)
          .set({
            points: (player.points || 0) + 10,
            round2Points: (player.round2Points || 0) + 10,
          })
          .where(and(
            eq(playerStats.userId, player.userId),
            eq(playerStats.gameSessionId, input.gameSessionId),
          ))

        // Record the blessing for each player
        await ctx.db.insert(playerActions).values({
          userId: player.userId,
          gameSessionId: input.gameSessionId,
          actionType: 'submitted_flag',
          result: 'success',
          target: 'equi_blessing_game',
          pointsEarned: 10,
          metadata: {
            gameType: 'equi_blessing',
            pointsAwarded: 10,
            triggeredBy: user[0].id,
          },
        })
      }

      return {
        success: true,
        pointsAwarded: 10,
        playersAffected: allPlayers.length,
        message: 'Equi Blessing activated! All players received 10 bonus points.',
      }
    }),

  // Get Round 2 game progress
  getGameProgressRound2: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0]) {
        throw new Error('User not found')
      }

      // Get all players in the game session
      const allPlayers = await ctx.db
        .select()
        .from(playerStats)
        .where(eq(playerStats.gameSessionId, input.gameSessionId))
        .leftJoin(users, eq(playerStats.userId, users.id))

      // Get all game actions for the current user
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

      // Round 2 games are now director-controlled games
      const round2Games = [
        'curse_distribution_game',
        'pandoras_box_game',
        'equi_blessing_game',
      ]

      const round2Actions = gameActions.filter(action =>
        action.target && round2Games.includes(action.target),
      )

      const completedGames = round2Actions
        .filter(action => action.result === 'success' || action.target === 'curse_distribution_game') // Curse bids are always successful
        .map(action => action.target)

      // Get unique completed games (player might have played multiple times)
      const uniqueCompletedGames = [...new Set(completedGames)]

      // Get Pandora's Box selections for all players
      const pandoraSelections = await ctx.db
        .select()
        .from(playerActions)
        .where(
          and(
            eq(playerActions.gameSessionId, input.gameSessionId),
            eq(playerActions.target, 'pandoras_box_game'),
          ),
        )

      // Get Curse Distribution bids
      const curseBids = await ctx.db
        .select()
        .from(playerActions)
        .where(
          and(
            eq(playerActions.gameSessionId, input.gameSessionId),
            eq(playerActions.target, 'curse_distribution_game'),
          ),
        )

      // Get Equi Blessing activations
      const equiBlessing = await ctx.db
        .select()
        .from(playerActions)
        .where(
          and(
            eq(playerActions.gameSessionId, input.gameSessionId),
            eq(playerActions.target, 'equi_blessing_game'),
          ),
        )

      // Create participant status
      const participants = allPlayers.map((player) => {
        const playerId = player.player_stats.userId
        const pandoraSelection = pandoraSelections.find(p => p.userId === playerId)
        const curseBid = curseBids.find(b => b.userId === playerId)
        const blessingActivated = equiBlessing.some((b) => {
          const metadata = b.metadata as { triggeredBy?: number } | null
          return metadata?.triggeredBy === playerId
        })

        return {
          userId: playerId,
          username: player.users?.username || player.users?.firstName || 'Unknown',
          points: player.player_stats.points || 0,
          pandoraBoxSelected: !!pandoraSelection,
          curseBidPlaced: !!curseBid,
          blessingActivated,
        }
      })

      const totalPoints = round2Actions
        .reduce((sum, action) => sum + (action.pointsEarned || 0), 0)

      return {
        completedGames: uniqueCompletedGames,
        totalPoints,
        gamesCompleted: uniqueCompletedGames.length,
        totalGames: 3, // Only 3 games in Round 2 now
        participants,
        curseBidsCount: curseBids.length,
        maxCurseBids: 5, // Maximum number of curse bids allowed
      }
    }),

  // Get Round 2 game hints (costs 10 points)
  getGameHintRound2: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      gameType: z.enum(['mozillaTrivia', 'codeAnalysis', 'osintInvestigation', 'cipherDecryption', 'competitiveDebugging']),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0])
        throw new Error('User not found')

      const currentStats = await ctx.db.select().from(playerStats).where(
        and(
          eq(playerStats.userId, user[0].id),
          eq(playerStats.gameSessionId, input.gameSessionId),
        ),
      )

      if (!currentStats[0] || currentStats[0].points < 10) {
        throw new Error('Not enough points for hint (10 points required)')
      }

      const hints = {
        mozillaTrivia: 'Research Mozilla founders, Firefox release date (November 2004), and Project Quantum CSS.',
        codeAnalysis: 'The function processes array elements differently based on their index position - even vs odd.',
        osintInvestigation: 'Look for GitHub user @mozilla_dev_phantom. Check their commit history and contributions to Firefox DevTools.',
        cipherDecryption: 'Multiple encryption layers: start with ROT13, then Caesar cipher, finally Vigenère with key.',
        competitiveDebugging: 'Find: 1) Math.abs() issue with negatives, 2) Missing return statement, 3) Use array.map() instead of loop.',
      }

      await ctx.db
        .update(playerStats)
        .set({
          points: currentStats[0].points - 10,
        })
        .where(and(
          eq(playerStats.userId, user[0].id),
          eq(playerStats.gameSessionId, input.gameSessionId),
        ))

      await ctx.db.insert(playerActions).values({
        userId: user[0].id,
        gameSessionId: input.gameSessionId,
        actionType: 'used_hint',
        result: 'neutral',
        target: `${input.gameType}_hint_round2`,
        pointsEarned: -10,
        metadata: {
          gameType: input.gameType,
          hintUsed: true,
          pointsCost: 10,
          round: 2,
        },
      })

      return {
        hint: hints[input.gameType],
        gameType: input.gameType,
        pointsDeducted: 10,
      }
    }),

  // Get current curse auction status
  getCurseAuctionStatus: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const curseActions = await ctx.db.select().from(playerActions).where(
        and(
          eq(playerActions.gameSessionId, input.gameSessionId),
          eq(playerActions.target, 'curse_distribution_game'),
        ),
      )

      const bids = curseActions.map(action => ({
        userId: action.userId,
        bidAmount: (action.metadata as { bidAmount?: number })?.bidAmount || 0,
        targetPlayerId: (action.metadata as { targetPlayerId?: number })?.targetPlayerId,
        timestamp: (action.metadata as { timestamp?: string })?.timestamp,
      }))

      const highestBid = bids.length > 0 ? Math.max(...bids.map(bid => bid.bidAmount)) : 0
      const highestBidder = bids.find(bid => bid.bidAmount === highestBid)

      return {
        bids,
        highestBid,
        highestBidder,
        totalBids: bids.length,
      }
    }),

  // Get all players for curse targeting
  getAllPlayers: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const playersWithStats = await ctx.db
        .select({
          userId: playerStats.userId,
          points: playerStats.points,
          round1Points: playerStats.round1Points,
          round2Points: playerStats.round2Points,
          username: users.username,
          firstName: users.firstName,
        })
        .from(playerStats)
        .innerJoin(users, eq(playerStats.userId, users.id))
        .where(eq(playerStats.gameSessionId, input.gameSessionId))

      return playersWithStats
    }),

  // Round 3 Games - Betrayal Finale

  // Great Equalization - Adjust all player points to be within 50 points of each other
  executeGreatEqualization: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get all players in the game session
      const allPlayers = await ctx.db.select().from(playerStats).where(
        eq(playerStats.gameSessionId, input.gameSessionId),
      )

      if (allPlayers.length === 0) {
        throw new Error('No players found in game session')
      }

      // Calculate average points
      const totalPoints = allPlayers.reduce((sum, player) => sum + (player.points || 0), 0)
      const averagePoints = Math.floor(totalPoints / allPlayers.length)

      // Adjust all players to be within 50 points of average
      for (const player of allPlayers) {
        const currentPoints = player.points || 0
        let adjustedPoints = currentPoints

        if (currentPoints > averagePoints + 25) {
          adjustedPoints = averagePoints + 25
        }
        else if (currentPoints < averagePoints - 25) {
          adjustedPoints = averagePoints - 25
        }

        await ctx.db
          .update(playerStats)
          .set({
            points: adjustedPoints,
            round3Points: 0, // Reset round 3 points
          })
          .where(and(
            eq(playerStats.userId, player.userId),
            eq(playerStats.gameSessionId, input.gameSessionId),
          ))

        // Record equalization
        await ctx.db.insert(playerActions).values({
          userId: player.userId,
          gameSessionId: input.gameSessionId,
          actionType: 'submitted_flag',
          result: 'neutral',
          target: 'great_equalization',
          pointsEarned: adjustedPoints - currentPoints,
          metadata: {
            gameType: 'equalization',
            originalPoints: currentPoints,
            adjustedPoints,
            averagePoints,
          },
        })
      }

      return {
        success: true,
        averagePoints,
        playersAdjusted: allPlayers.length,
        message: 'Great Equalization complete! All players are now within 50 points of each other.',
      }
    }),

  // Get equalization status
  getEqualizationStatus: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0]) {
        throw new Error('User not found')
      }

      const equalizationAction = await ctx.db.select().from(playerActions).where(
        and(
          eq(playerActions.userId, user[0].id),
          eq(playerActions.gameSessionId, input.gameSessionId),
          eq(playerActions.target, 'great_equalization'),
        ),
      )

      if (equalizationAction.length === 0) {
        return null
      }

      const latest = equalizationAction[equalizationAction.length - 1]
      const metadata = latest.metadata as { adjustedPoints?: number, originalPoints?: number }

      return {
        adjustedPoints: metadata?.adjustedPoints || 0,
        originalPoints: metadata?.originalPoints || 0,
        pointsChanged: (metadata?.adjustedPoints || 0) - (metadata?.originalPoints || 0),
      }
    }),

  // Phase 1: The Trials (Individual challenge - 150 points)
  round3Phase1: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      answer: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0]) {
        throw new Error('User not found')
      }

      // Check if user already completed this phase
      const existingAttempt = await ctx.db.select()
        .from(playerActions)
        .where(
          and(
            eq(playerActions.userId, user[0].id),
            eq(playerActions.gameSessionId, input.gameSessionId),
            eq(playerActions.target, 'round3_phase1'),
            eq(playerActions.result, 'success'),
          ),
        )

      if (existingAttempt.length > 0) {
        throw new Error('You have already completed Phase 1')
      }

      // The correct answer is the decoded Phoenix Codex
      const correctAnswer = 'MOZILLA IS NOT JUST A COMPANY, IT IS A MOVEMENT. THE OPEN WEB IS OUR LEGACY.'
      const isCorrect = input.answer.toUpperCase().trim() === correctAnswer

      const points = isCorrect ? 150 : 0

      // Record the attempt
      await ctx.db.insert(playerActions).values({
        userId: user[0].id,
        gameSessionId: input.gameSessionId,
        actionType: 'submitted_flag',
        result: isCorrect ? 'success' : 'failed',
        target: 'round3_phase1',
        pointsEarned: points,
        metadata: {
          gameType: 'phase1_trials',
          submittedAnswer: input.answer,
          correctAnswer,
          phase: 1,
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

        if (currentStats[0]) {
          await ctx.db
            .update(playerStats)
            .set({
              points: (currentStats[0].points || 0) + points,
              round3Points: (currentStats[0].round3Points || 0) + points,
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
          ? 'Excellent! You decoded the Phoenix Codex and completed The Trials!'
          : 'Incorrect. Remember to work backwards through the encoding layers: hex → XOR → base64 → ROT13.',
      }
    }),

  // Phase 2: The Heist (Collaborative challenge - 150 points, only first 3 winners)
  round3Phase2: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      answer: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0]) {
        throw new Error('User not found')
      }

      // Check if user already completed this phase
      const existingAttempt = await ctx.db.select()
        .from(playerActions)
        .where(
          and(
            eq(playerActions.userId, user[0].id),
            eq(playerActions.gameSessionId, input.gameSessionId),
            eq(playerActions.target, 'round3_phase2'),
            eq(playerActions.result, 'success'),
          ),
        )

      if (existingAttempt.length > 0) {
        throw new Error('You have already completed Phase 2')
      }

      // Check how many players have already completed this phase
      const completedCount = await ctx.db.select()
        .from(playerActions)
        .where(
          and(
            eq(playerActions.gameSessionId, input.gameSessionId),
            eq(playerActions.target, 'round3_phase2'),
            eq(playerActions.result, 'success'),
          ),
        )

      if (completedCount.length >= 3) {
        return {
          success: false,
          points: 0,
          message: 'The Heist is complete. Only the first 3 players could claim the treasure.',
        }
      }

      // The correct answer combines all three layers
      // Layer 1: RmlyZWZveERpZ2l0YWxWYXVsdEFjY2Vzcw== decodes to "FirefoxDigitalVaultAccess"
      // Layer 2: Taking every 3rd char of "FirefoxDigitalVaultAccess" = "rfxgtlutcs", reversed = "scutlgtxfr", Caesar +7 = "zjbaspakmy"
      // Layer 3: CSS unicode decodes to "VAULT_OPEN"
      const correctAnswer = 'FIREFOXDIGITALVAULTACCESS_ZJBASPAKMY_VAULT_OPEN'
      const isCorrect = input.answer.toUpperCase().replace(/\s+/g, '_') === correctAnswer

      const points = isCorrect ? 150 : 0

      // Record the attempt
      await ctx.db.insert(playerActions).values({
        userId: user[0].id,
        gameSessionId: input.gameSessionId,
        actionType: 'submitted_flag',
        result: isCorrect ? 'success' : 'failed',
        target: 'round3_phase2',
        pointsEarned: points,
        metadata: {
          gameType: 'phase2_heist',
          submittedAnswer: input.answer,
          correctAnswer,
          phase: 2,
          completionOrder: completedCount.length + 1,
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

        if (currentStats[0]) {
          await ctx.db
            .update(playerStats)
            .set({
              points: (currentStats[0].points || 0) + points,
              round3Points: (currentStats[0].round3Points || 0) + points,
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
        completionOrder: isCorrect ? completedCount.length + 1 : null,
        message: isCorrect
          ? `Congratulations! You successfully infiltrated the Digital Vault! (${completedCount.length + 1}/3)`
          : 'Incorrect vault combination. Make sure to decode all three layers correctly.',
      }
    }),

  // Phase 3: Final Gambit (Point auction - 200 points + bid back if correct)
  round3Phase3: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      answer: z.string(), // Format: "bidAmount|solution"
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0]) {
        throw new Error('User not found')
      }

      // Check if user already attempted this phase
      const existingAttempt = await ctx.db.select()
        .from(playerActions)
        .where(
          and(
            eq(playerActions.userId, user[0].id),
            eq(playerActions.gameSessionId, input.gameSessionId),
            eq(playerActions.target, 'round3_phase3'),
          ),
        )

      if (existingAttempt.length > 0) {
        throw new Error('You have already attempted Phase 3')
      }

      // Parse bid and solution
      const parts = input.answer.split('|')
      if (parts.length !== 2) {
        throw new Error('Invalid format. Use: bidAmount|solution')
      }

      const bidAmount = Number.parseInt(parts[0])
      const solution = parts[1].trim()

      if (Number.isNaN(bidAmount) || bidAmount < 50) {
        throw new Error('Bid amount must be at least 50 points')
      }

      // Check if user has enough points
      const currentStats = await ctx.db.select().from(playerStats).where(
        and(
          eq(playerStats.userId, user[0].id),
          eq(playerStats.gameSessionId, input.gameSessionId),
        ),
      )

      if (!currentStats[0] || (currentStats[0].points || 0) < bidAmount) {
        throw new Error('Insufficient points for this bid')
      }

      // Check if someone already won this phase
      const existingWinner = await ctx.db.select()
        .from(playerActions)
        .where(
          and(
            eq(playerActions.gameSessionId, input.gameSessionId),
            eq(playerActions.target, 'round3_phase3'),
            eq(playerActions.result, 'success'),
          ),
        )

      if (existingWinner.length > 0) {
        return {
          success: false,
          points: 0,
          message: 'Phase 3 has already been completed by another player.',
        }
      }

      // The correct solution combines multiple elements:
      // ROT13 of "Gur svany frperg vf uvqqra va gur ynfg cynpr lbh jbhyq ybbx" = "The final secret is hidden in the last place you would look"
      // Binary "01000110 01101001 01110010 01100101 01100110 01101111 01111000" = "Firefox"
      // Morse "..-. .. -. .- .-.. / -.-. .. .--. .... . .-." = "FINAL CIPHER"
      const correctAnswer = 'THE FINAL SECRET IS HIDDEN IN THE LAST PLACE YOU WOULD LOOK FIREFOX FINAL CIPHER'
      const isCorrect = solution.toUpperCase() === correctAnswer

      const pointsEarned = isCorrect ? 200 : -bidAmount
      const totalPointsChange = isCorrect ? 200 : -bidAmount // If correct, get 200 points + bid back, if wrong lose bid

      // Record the attempt
      await ctx.db.insert(playerActions).values({
        userId: user[0].id,
        gameSessionId: input.gameSessionId,
        actionType: 'submitted_flag',
        result: isCorrect ? 'success' : 'failed',
        target: 'round3_phase3',
        pointsEarned: totalPointsChange,
        metadata: {
          gameType: 'phase3_gambit',
          submittedAnswer: solution,
          correctAnswer,
          bidAmount,
          phase: 3,
        },
      })

      // Update player stats
      await ctx.db
        .update(playerStats)
        .set({
          points: Math.max(0, (currentStats[0].points || 0) + totalPointsChange),
          round3Points: (currentStats[0].round3Points || 0) + pointsEarned,
        })
        .where(and(
          eq(playerStats.userId, user[0].id),
          eq(playerStats.gameSessionId, input.gameSessionId),
        ))

      return {
        success: isCorrect,
        points: pointsEarned,
        bidAmount,
        totalPointsChange,
        message: isCorrect
          ? `Incredible! You solved the Betrayal Cipher and won ${200} points! Your bid of ${bidAmount} points has been returned.`
          : `Incorrect solution. You lost your bid of ${bidAmount} points. The betrayal cipher remains unsolved.`,
      }
    }),

  // Wildcard Finale: The Ultimate Betrayal (300 points)
  round3FinalGambit: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      answer: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0]) {
        throw new Error('User not found')
      }

      // Check if someone already won the final gambit
      const existingWinner = await ctx.db.select()
        .from(playerActions)
        .where(
          and(
            eq(playerActions.gameSessionId, input.gameSessionId),
            eq(playerActions.target, 'round3_final_gambit'),
            eq(playerActions.result, 'success'),
          ),
        )

      if (existingWinner.length > 0) {
        return {
          success: false,
          points: 0,
          message: 'The Ultimate Betrayal has already been solved. There can be only one champion.',
        }
      }

      // Check if user already attempted
      const existingAttempt = await ctx.db.select()
        .from(playerActions)
        .where(
          and(
            eq(playerActions.userId, user[0].id),
            eq(playerActions.gameSessionId, input.gameSessionId),
            eq(playerActions.target, 'round3_final_gambit'),
          ),
        )

      if (existingAttempt.length > 0) {
        throw new Error('You have already attempted the Ultimate Betrayal')
      }

      // The ultimate solution combines all clues:
      // FOUNDATION_KEY: PHOENIX_FOUNDATION_2025_BETRAYAL_CIPHER (from hidden comment)
      // DIRECTOR_PATTERN: Based on Round 2 winner's selection pattern
      // COORDINATES: 3.7.120 (betrayals.alliances.sabotage_points)
      // PHOENIX_TIMESTAMP: Current date in YYYY-MM-DD format
      // Apply Vigenère cipher with key "BETRAYAL"

      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
      const _combinedMessage = `PHOENIX_FOUNDATION_2025_BETRAYAL_CIPHER_DIRECTOR_SELECTION_PATTERN_3.7.120_${today}`

      // For simplicity, the final answer is a known result of this process
      const correctAnswer = 'IN THE END THERE CAN BE ONLY ONE FIREFOX CIPHER CHAMPION'
      const isCorrect = input.answer.toUpperCase() === correctAnswer

      const points = isCorrect ? 300 : 0

      // Record the attempt
      await ctx.db.insert(playerActions).values({
        userId: user[0].id,
        gameSessionId: input.gameSessionId,
        actionType: 'submitted_flag',
        result: isCorrect ? 'success' : 'failed',
        target: 'round3_final_gambit',
        pointsEarned: points,
        metadata: {
          gameType: 'final_gambit',
          submittedAnswer: input.answer,
          correctAnswer,
          phase: 4,
          timestamp: today,
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

        if (currentStats[0]) {
          await ctx.db
            .update(playerStats)
            .set({
              points: (currentStats[0].points || 0) + points,
              round3Points: (currentStats[0].round3Points || 0) + points,
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
          ? '🏆 ULTIMATE VICTORY! You are the Firefox Cipher Champion! You have solved the Ultimate Betrayal and claimed the final 300 points!'
          : 'The Ultimate Betrayal cipher remains unsolved. Remember to combine all clues from the entire game.',
      }
    }),

  // Get Round 3 game progress
  getGameProgressRound3: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0]) {
        throw new Error('User not found')
      }

      // Get all Round 3 actions for the user
      const round3Actions = await ctx.db
        .select()
        .from(playerActions)
        .where(
          and(
            eq(playerActions.userId, user[0].id),
            eq(playerActions.gameSessionId, input.gameSessionId),
            eq(playerActions.actionType, 'submitted_flag'),
          ),
        )

      const round3Targets = [
        'round3_phase1',
        'round3_phase2',
        'round3_phase3',
        'round3_final_gambit',
      ]

      const round3GameActions = round3Actions.filter(action =>
        action.target && round3Targets.includes(action.target),
      )

      const completedPhases = round3GameActions
        .filter(action => action.result === 'success')
        .map((action) => {
          switch (action.target) {
            case 'round3_phase1': return 1
            case 'round3_phase2': return 2
            case 'round3_phase3': return 3
            case 'round3_final_gambit': return 4
            default: return 0
          }
        })
        .filter(phase => phase > 0)

      const totalPoints = round3GameActions
        .filter(action => action.result === 'success')
        .reduce((sum, action) => sum + (action.pointsEarned || 0), 0)

      return {
        completedPhases,
        totalPoints,
        phasesCompleted: completedPhases.length,
        totalPhases: 4,
      }
    }),

  // Get Round 3 hints (costs 15 points)
  getGameHintRound3: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
      phase: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0]) {
        throw new Error('User not found')
      }

      const currentStats = await ctx.db.select().from(playerStats).where(
        and(
          eq(playerStats.userId, user[0].id),
          eq(playerStats.gameSessionId, input.gameSessionId),
        ),
      )

      if (!currentStats[0] || (currentStats[0].points || 0) < 15) {
        throw new Error('Not enough points for hint (15 points required)')
      }

      const hints = {
        1: 'Start with hex decode: 4D6F7A696C6C61... → ASCII text. Then XOR with "MOZILLA", decode base64, and finally ROT13.',
        2: 'Layer 1: Decode the base64 token. Layer 2: Take every 3rd character, reverse, Caesar +7. Layer 3: Convert CSS unicode \\0056\\0041... to ASCII.',
        3: 'ROT13 the encrypted message first. Binary converts to "Firefox". Morse code gives "FINAL CIPHER". Combine all three parts.',
        4: 'Look for the hidden comment with FINAL_KEY. Find data-betrayal attributes. Use today\'s date (YYYY-MM-DD). Apply Vigenère with key "BETRAYAL".',
      }

      await ctx.db
        .update(playerStats)
        .set({
          points: (currentStats[0].points || 0) - 15,
        })
        .where(and(
          eq(playerStats.userId, user[0].id),
          eq(playerStats.gameSessionId, input.gameSessionId),
        ))

      await ctx.db.insert(playerActions).values({
        userId: user[0].id,
        gameSessionId: input.gameSessionId,
        actionType: 'used_hint',
        result: 'neutral',
        target: `round3_phase${input.phase}_hint`,
        pointsEarned: -15,
        metadata: {
          gameType: `round3_phase${input.phase}`,
          hintUsed: true,
          pointsCost: 15,
          round: 3,
          phase: input.phase,
        },
      })

      return {
        hint: hints[input.phase],
        phase: input.phase,
        pointsDeducted: 15,
      }
    }),

  // Get comprehensive action history for ActionHistory component
  getActionHistory: protectedProcedure
    .input(z.object({
      gameSessionId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId))
      if (!user[0]) {
        throw new Error('User not found')
      }

      // Get all actions for the user in this game session
      const allActions = await ctx.db
        .select()
        .from(playerActions)
        .where(
          and(
            eq(playerActions.userId, user[0].id),
            eq(playerActions.gameSessionId, input.gameSessionId),
          ),
        )
        .orderBy(playerActions.createdAt)

      // Transform actions into ActionHistory format
      const formattedActions = allActions.map((action, index) => {
        const metadata = action.metadata as any
        let actionDescription = ''
        let target = ''

        switch (action.target) {
          // Round 1 Games
          case 'inspect_element_game':
            actionDescription = 'INSPECT ELEMENT'
            target = action.result === 'success'
              ? `Found hidden message: ${metadata?.correctAnswer || 'FIREFOX_CIPHER_2025'}`
              : `Failed attempt: ${metadata?.submittedAnswer || 'incorrect answer'}`
            break

          case 'base64_decoder_game':
            actionDescription = 'BASE64 DECODER'
            target = action.result === 'success'
              ? `Decoded message: ${metadata?.correctAnswer || 'THE_TRUTH_IS_IN_THE_METADATA'}`
              : `Failed decode: ${metadata?.submittedAnswer || 'incorrect decode'}`
            break

          case 'network_analysis_game':
            actionDescription = 'NETWORK ANALYSIS'
            target = action.result === 'success'
              ? `Found endpoint: ${metadata?.correctAnswer || '/api/secret/cipher-key'}`
              : `Wrong endpoint: ${metadata?.submittedAnswer || 'incorrect endpoint'}`
            break

          case 'console_puzzle_game':
            actionDescription = 'CONSOLE PUZZLE'
            target = action.result === 'success'
              ? `Solved cipher: ${metadata?.correctAnswer || 'MOZILLA_FOUNDATION_1998'}`
              : `Failed solution: ${metadata?.submittedAnswer || 'incorrect solution'}`
            break

          case 'form_extraction_game':
            actionDescription = 'FORM EXTRACTION'
            target = action.result === 'success'
              ? `Extracted data: ${metadata?.correctAnswer || 'HIDDEN_FORM_VALUE_2025'}`
              : `Failed extraction: ${metadata?.submittedAnswer || 'incorrect data'}`
            break

          // Round 2 Games
          case 'director_game_selection':
            actionDescription = 'DIRECTOR SELECTION'
            target = `Selected games: ${(metadata?.selectedGames || []).join(', ').replace(/_/g, ' ').toUpperCase()}`
            break

          case 'curse_distribution_game':
          { actionDescription = 'CURSE BID'
            const targetPlayer = metadata?.targetPlayerId ? `Player ${metadata.targetPlayerId}` : 'Unknown Player'
            target = `Bid ${metadata?.bidAmount || 0} points to curse ${targetPlayer}`
            break }

          case 'pandoras_box_game':
          { actionDescription = 'PANDORA\'S BOX'
            const boxResult = (metadata?.pointsAwarded || 0) > 0 ? 'LUCKY' : 'UNLUCKY'
            target = `Box ${metadata?.selectedBox || 0}: ${metadata?.pointsAwarded || 0} points (${boxResult})`
            break }

          case 'equi_blessing_game':
            actionDescription = 'EQUI BLESSING'
            target = `Activated blessing: +10 points for all players`
            break

          case 'curse_executed':
            actionDescription = 'CURSED'
            target = `Received curse: -60 points from Player ${metadata?.cursedBy || 'Unknown'}`
            break

          // Round 3 Games
          case 'great_equalization':
            actionDescription = 'EQUALIZATION'
            target = `Points adjusted: ${metadata?.originalPoints || 0} → ${metadata?.adjustedPoints || 0}`
            break

          case 'round3_phase1':
            actionDescription = 'PHASE 1: TRIALS'
            target = action.result === 'success'
              ? 'Decoded Phoenix Codex: +150 points'
              : `Failed decode: ${metadata?.submittedAnswer || 'incorrect solution'}`
            break

          case 'round3_phase2':
            actionDescription = 'PHASE 2: HEIST'
            target = action.result === 'success'
              ? `Infiltrated vault: +150 points (${metadata?.completionOrder || 0}/3)`
              : `Failed infiltration: ${metadata?.submittedAnswer || 'incorrect combination'}`
            break

          case 'round3_phase3':
            actionDescription = 'PHASE 3: GAMBIT'
            target = action.result === 'success'
              ? `Won gambit: +200 points (bid: ${metadata?.bidAmount || 0})`
              : `Lost gambit: -${metadata?.bidAmount || 0} points`
            break

          case 'round3_final_gambit':
            actionDescription = 'ULTIMATE BETRAYAL'
            target = action.result === 'success'
              ? '🏆 CHAMPION: +300 points'
              : `Failed ultimate cipher: ${metadata?.submittedAnswer || 'incorrect solution'}`
            break

          // Hints and other actions
          default:
            if (action.target?.includes('_hint')) {
              actionDescription = 'HINT USED'
              const gameType = action.target.replace('_hint', '').replace('_round2', '').replace('_round3', '').replace(/_/g, ' ').toUpperCase()
              target = `${gameType}: -${metadata?.pointsCost || 5} points`
            }
            else if (action.actionType === 'used_hint') {
              actionDescription = 'HINT USED'
              target = `${(metadata?.gameType || 'unknown').replace(/_/g, ' ').toUpperCase()}: -${metadata?.pointsCost || 5} points`
            }
            else {
              actionDescription = action.actionType?.toUpperCase() || 'UNKNOWN ACTION'
              target = action.target || 'Unknown target'
            }
            break
        }

        return {
          id: index + 1,
          action: actionDescription,
          target,
          result: action.result as 'success' | 'failed' | 'neutral',
          time: new Date(action.createdAt).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        }
      })

      return formattedActions
    }),
})
