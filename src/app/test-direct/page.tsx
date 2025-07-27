/* eslint-disable no-console */
'use client'

import { useEffect, useState } from 'react'
import { useDirectUser } from '@/contexts/DirectUserContext'

export default function TestDirectPage() {
  const { directUser, isDirectUser } = useDirectUser()
  const [localStorageData, setLocalStorageData] = useState<string | null>(null)

  useEffect(() => {
    // Check localStorage on client side
    setLocalStorageData(localStorage.getItem('directUser'))
    console.log('Test page: localStorage data:', localStorage.getItem('directUser'))
    console.log('Test page: directUser from context:', directUser)
    console.log('Test page: isDirectUser from context:', isDirectUser)
  }, [directUser, isDirectUser])

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl mb-4">Direct User Test Page</h1>
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-bold mb-2">Context Data:</h2>
          <p>
            Is Direct User:
            <span className="text-green-400">{isDirectUser ? 'Yes' : 'No'}</span>
          </p>
          <p>Direct User Data:</p>
          <pre className="text-sm bg-gray-900 p-2 rounded mt-2">
            {directUser ? JSON.stringify(directUser, null, 2) : 'None'}
          </pre>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-bold mb-2">LocalStorage Data:</h2>
          <pre className="text-sm bg-gray-900 p-2 rounded">
            {localStorageData || 'None'}
          </pre>
        </div>

        <button
          onClick={() => window.location.href = '/game'}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Go to Game
        </button>
      </div>
    </div>
  )
}
