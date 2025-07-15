'use client'

import { trpc } from '@/lib/trpc/client'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'

export default function Home() {
  const { user } = useUser()

  // tRPC calls
  const healthCheck = trpc.health.useQuery()
  const privateMessage = trpc.getPrivateMessage.useQuery(undefined, {
    enabled: !!user,
  })
  const userProfile = trpc.getUserProfile.useQuery(undefined, {
    enabled: !!user,
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <SignedOut>
            <div className="text-orange-600 font-medium">
              You are not signed in. Sign in to access protected features!
            </div>
          </SignedOut>
          <SignedIn>
            <div className="text-green-600 font-medium">
              Welcome back, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!
            </div>
          </SignedIn>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">tRPC:</span>
              {healthCheck.isLoading && <span className="text-yellow-600">Loading...</span>}
              {healthCheck.isError && (
                <span className="text-red-600">
                  Error: {healthCheck.error.message}
                </span>
              )}
              {healthCheck.isSuccess && (
                <span className="text-green-600">
                  {healthCheck.data.status} - {healthCheck.data.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Protected Data</h2>
          <SignedOut>
            <div className="text-gray-500 italic">
              🔒 Sign in to view protected content
            </div>
          </SignedOut>
          <SignedIn>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Private Message:</span>
                  {privateMessage.isLoading && <span className="text-yellow-600">Loading...</span>}
                  {privateMessage.isError && (
                    <span className="text-red-600">
                      Error: {privateMessage.error.message}
                    </span>
                  )}
                  {privateMessage.isSuccess && (
                    <span className="text-green-600">
                      {privateMessage.data.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">User Profile:</span>
                  {userProfile.isLoading && <span className="text-yellow-600">Loading...</span>}
                  {userProfile.isError && (
                    <span className="text-red-600">
                      Error: {userProfile.error.message}
                    </span>
                  )}
                  {userProfile.isSuccess && (
                    <div className="text-purple-600">
                      <div>{userProfile.data.message}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        User ID: {userProfile.data.userId}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SignedIn>
        </div>
      </div>
    </div>
  )
}
