import type { NextRequest } from 'next/server'
import { initTRPC } from '@trpc/server'

export function createContext(req: NextRequest) {
  return {
    req,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure
export const middleware = t.middleware
