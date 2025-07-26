import { boolean, integer, jsonb, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

// Enums
export const challengeTypeEnum = pgEnum('challenge_type', ['technical', 'firefox_specific', 'logic_riddle', 'competitive', 'chaos', 'collaborative'])
export const actionTypeEnum = pgEnum('action_type', ['started_challenge', 'completed_challenge', 'used_hint', 'submitted_flag', 'used_lifeline', 'formed_alliance', 'betrayed_alliance'])
export const actionResultEnum = pgEnum('action_result', ['success', 'failed', 'neutral'])
export const notificationTypeEnum = pgEnum('notification_type', ['info', 'warning', 'success', 'error'])
export const playerStatusEnum = pgEnum('player_status', ['online', 'away', 'offline'])
export const roundEnum = pgEnum('round', ['round_1', 'round_2', 'round_3'])
export const lifelineTypeEnum = pgEnum('lifeline_type', ['snitch', 'sabotage', 'boost', 'intel'])

// Users table (extended)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).unique().notNull(),
  playerId: varchar('player_id', { length: 50 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  username: varchar('username', { length: 50 }).unique(),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Game sessions table
export const gameSessions = pgTable('game_sessions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  currentRound: roundEnum('current_round').default('round_1'),
  currentPhase: varchar('current_phase', { length: 100 }),
  isActive: boolean('is_active').default(true),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  endedAt: timestamp('ended_at'),
  settings: jsonb('settings'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Player stats table
export const playerStats = pgTable('player_stats', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  gameSessionId: integer('game_session_id').references(() => gameSessions.id).notNull(),
  points: integer('points').default(0).notNull(),
  rank: integer('rank'),
  lifelines: jsonb('lifelines'),
  currentStreak: integer('current_streak').default(0),
  level: integer('level').default(1),
  status: playerStatusEnum('status').default('online'),
  lastActiveAt: timestamp('last_active_at').defaultNow(),
  round1Points: integer('round_1_points').default(0),
  round2Points: integer('round_2_points').default(0),
  round3Points: integer('round_3_points').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Challenges table
export const challenges = pgTable('challenges', {
  id: serial('id').primaryKey(),
  gameSessionId: integer('game_session_id').references(() => gameSessions.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  type: challengeTypeEnum('type').notNull(),
  round: roundEnum('round').notNull(),
  points: integer('points').notNull(),
  difficulty: varchar('difficulty', { length: 50 }),
  flag: varchar('flag', { length: 255 }),
  hints: jsonb('hints'),
  requirements: jsonb('requirements'),
  isActive: boolean('is_active').default(true),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Player actions table
export const playerActions = pgTable('player_actions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  gameSessionId: integer('game_session_id').references(() => gameSessions.id).notNull(),
  challengeId: integer('challenge_id').references(() => challenges.id),
  actionType: actionTypeEnum('action_type').notNull(),
  result: actionResultEnum('result').notNull(),
  target: text('target'),
  pointsEarned: integer('points_earned').default(0),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Alliances table
export const alliances = pgTable('alliances', {
  id: serial('id').primaryKey(),
  gameSessionId: integer('game_session_id').references(() => gameSessions.id).notNull(),
  name: varchar('name', { length: 255 }),
  leaderId: integer('leader_id').references(() => users.id).notNull(),
  members: jsonb('members'),
  isActive: boolean('is_active').default(true),
  formedAt: timestamp('formed_at').defaultNow().notNull(),
  dissolvedAt: timestamp('dissolved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Chat messages table
export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  gameSessionId: integer('game_session_id').references(() => gameSessions.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Notifications table
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  gameSessionId: integer('game_session_id').references(() => gameSessions.id).notNull(),
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }),
  message: text('message').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Challenge submissions table
export const challengeSubmissions = pgTable('challenge_submissions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  challengeId: integer('challenge_id').references(() => challenges.id).notNull(),
  gameSessionId: integer('game_session_id').references(() => gameSessions.id).notNull(),
  submittedFlag: varchar('submitted_flag', { length: 255 }).notNull(),
  isCorrect: boolean('is_correct').notNull(),
  pointsAwarded: integer('points_awarded').default(0),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
})

// Lifeline usage table
export const lifelineUsage = pgTable('lifeline_usage', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  gameSessionId: integer('game_session_id').references(() => gameSessions.id).notNull(),
  lifelineType: lifelineTypeEnum('lifeline_type').notNull(),
  targetUserId: integer('target_user_id').references(() => users.id),
  metadata: jsonb('metadata'),
  usedAt: timestamp('used_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type GameSession = typeof gameSessions.$inferSelect
export type NewGameSession = typeof gameSessions.$inferInsert
export type PlayerStats = typeof playerStats.$inferSelect
export type NewPlayerStats = typeof playerStats.$inferInsert
export type Challenge = typeof challenges.$inferSelect
export type NewChallenge = typeof challenges.$inferInsert
export type PlayerAction = typeof playerActions.$inferSelect
export type NewPlayerAction = typeof playerActions.$inferInsert
export type Alliance = typeof alliances.$inferSelect
export type NewAlliance = typeof alliances.$inferInsert
export type ChatMessage = typeof chatMessages.$inferSelect
export type NewChatMessage = typeof chatMessages.$inferInsert
export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert
export type ChallengeSubmission = typeof challengeSubmissions.$inferSelect
export type NewChallengeSubmission = typeof challengeSubmissions.$inferInsert
export type LifelineUsage = typeof lifelineUsage.$inferSelect
export type NewLifelineUsage = typeof lifelineUsage.$inferInsert
