import type { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { initTRPC, TRPCError } from '@trpc/server'

export async function createContext(req: NextRequest) {
  const { userId } = await auth()

  return {
    req,
    userId,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure
export const middleware = t.middleware

// Create a protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts

  if (!ctx.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    })
  }

  return opts.next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  })
})
