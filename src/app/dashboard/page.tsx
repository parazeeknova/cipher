'use client'

import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { trpc } from '@/lib/trpc/client'

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  const healthCheck = trpc.health.useQuery()
  const dbHealth = trpc.dbHealth.useQuery()
  const privateMessage = trpc.getPrivateMessage.useQuery()
  const userProfile = trpc.getUserProfile.useQuery()
  const currentUser = trpc.getUser.useQuery()
  const allUsers = trpc.getAllUsers.useQuery()

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/')
    }
  }, [isLoaded, user, router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    }
    catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-gray-100">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Mozilla Cipher Dashboard
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              Back to Landing
            </button>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        <SignedOut>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
            <div className="text-center text-gray-300">
              Please sign in to access the dashboard.
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">Welcome Back!</h2>
            <div className="text-green-400 font-medium">
              Successfully authenticated as
              {' '}
              {user?.primaryEmailAddress?.emailAddress}
            </div>
            <div className="text-sm text-gray-400 mt-2">
              You have access to all protected features.
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">System Status</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-300">tRPC:</span>
                {healthCheck.isLoading && <span className="text-yellow-400">Loading...</span>}
                {healthCheck.error && (
                  <span className="text-red-400">
                    Error:
                    {' '}
                    {healthCheck.error.message}
                  </span>
                )}
                {healthCheck.data && (
                  <span className="text-green-400">
                    {healthCheck.data.status}
                    {' '}
                    -
                    {healthCheck.data.message}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-300">Database:</span>
                {dbHealth.isLoading && <span className="text-yellow-400">Loading...</span>}
                {dbHealth.error && (
                  <span className="text-red-400">
                    Error:
                    {' '}
                    {dbHealth.error.message}
                  </span>
                )}
                {dbHealth.data && (
                  <span className={dbHealth.data.status === 'ok' ? 'text-green-400' : 'text-red-400'}>
                    {dbHealth.data.status}
                    {' '}
                    -
                    {' '}
                    {dbHealth.data.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">Protected Data</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-300">Private Message:</span>
                  {privateMessage.isLoading && <span className="text-yellow-400">Loading...</span>}
                  {privateMessage.error && (
                    <span className="text-red-400">
                      Error:
                      {' '}
                      {privateMessage.error.message}
                    </span>
                  )}
                  {privateMessage.data && (
                    <span className="text-green-400">
                      {privateMessage.data.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-300">User Profile:</span>
                  {userProfile.isLoading && <span className="text-yellow-400">Loading...</span>}
                  {userProfile.error && (
                    <span className="text-red-400">
                      Error:
                      {' '}
                      {userProfile.error.message}
                    </span>
                  )}
                  {userProfile.data && (
                    <div className="text-purple-400">
                      <div>{userProfile.data.message}</div>
                      <div className="text-sm text-gray-400 mt-1">
                        User ID:
                        {' '}
                        {userProfile.data.userId}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        Fetched at:
                        {' '}
                        {userProfile.data.timestamp}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">Database Integration</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-300">Your Account:</span>
                  {currentUser.isLoading && <span className="text-yellow-400">Loading...</span>}
                  {currentUser.error && (
                    <span className="text-red-400">
                      Error:
                      {' '}
                      {currentUser.error.message}
                    </span>
                  )}
                  {currentUser.data && (
                    <span className="text-green-400">
                      {currentUser.data.email}
                      {' '}
                      (ID:
                      {currentUser.data.id}
                      )
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-300">Total Users:</span>
                  {allUsers.isLoading && <span className="text-yellow-400">Loading...</span>}
                  {allUsers.error && (
                    <span className="text-red-400">
                      Error:
                      {' '}
                      {allUsers.error.message}
                    </span>
                  )}
                  {allUsers.data && (
                    <span className="text-blue-400">
                      {allUsers.data.length}
                      {' '}
                      user(s)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SignedIn>
      </div>
    </div>
  )
}
