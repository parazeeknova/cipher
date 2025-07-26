'use client'

import { MessageSquare } from 'lucide-react'

interface Notification {
  id: number
  type: 'info' | 'warning' | 'success'
  message: string
  time: string
}

interface NotificationBarProps {
  notifications: Notification[]
}

export function NotificationBar({ notifications }: NotificationBarProps) {
  return (
    <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl p-4 shadow-2xl">
      <div className="flex items-center gap-3 mb-3">
        <MessageSquare className="w-5 h-5 text-white animate-pulse" />
        <h3 className="text-white font-mono text-sm font-semibold">GAMEMASTER CONTROL</h3>
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      </div>
      <div className="space-y-2 max-h-20 overflow-y-auto">
        {notifications.map(notif => (
          <div key={notif.id} className="flex items-start gap-2 text-xs">
            <div
              className={`w-1 h-1 rounded-full mt-2 animate-pulse ${
                notif.type === 'info'
                  ? 'bg-white'
                  : notif.type === 'warning'
                    ? 'bg-red-400'
                    : 'bg-white'
              }`}
            />
            <div className="flex-1">
              <p className="text-gray-300 font-mono">{notif.message}</p>
              <p className="text-gray-500 text-xs">{notif.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
