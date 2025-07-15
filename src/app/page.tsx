'use client'

import { trpc } from '@/lib/trpc/client'

export default function Home() {
  // Add tRPC health check
  const healthCheck = trpc.health.useQuery()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Mozilla Chipher
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">tRPC:</span>
              {healthCheck.isLoading && <span className="text-yellow-600">Loading...</span>}
              {healthCheck.isError && (
                <span className="text-red-600">
                  Error:
                  {' '}
                  {healthCheck.error.message}
                </span>
              )}
              {healthCheck.isSuccess && (
                <span className="text-green-600">
                  {healthCheck.data.status}
                  {' '}
                  -
                  {healthCheck.data.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
          <p className="text-gray-600">
            Your Next.js app with tRPC is ready to go.
            Start building your API routes and components.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">tRPC Setup</h2>
          <ul className="space-y-2 text-gray-600">
            <li>
              • Add your tRPC routers in
              {' '}
              <code className="bg-gray-100 px-2 py-1 rounded">src/lib/trpc/routers/</code>
            </li>
            <li>
              • Import them in
              {' '}
              <code className="bg-gray-100 px-2 py-1 rounded">src/lib/trpc/root.ts</code>
            </li>
            <li>
              • Use them in your components with
              {' '}
              <code className="bg-gray-100 px-2 py-1 rounded">trpc.yourRouter.yourProcedure.useQuery()</code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
