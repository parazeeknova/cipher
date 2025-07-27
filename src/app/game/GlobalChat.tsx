'use client'
import { MessageCircle, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/shadcn/ui/button'
import { Input } from '@/shadcn/ui/input'
import { ScrollArea } from '@/shadcn/ui/scroll-area'

interface ChatMessage {
  id: number
  user: string
  message: string
  time: string
  isSystem?: boolean
}

interface PlayerAchievement {
  playerId: string
  playerName: string
  points: number
  achievement: string
}

interface GlobalChatProps {
  chatMessages: ChatMessage[]
  newMessage: string
  setNewMessage: (msg: string) => void
  sendMessage: () => void
  fetchMessages?: () => Promise<void>
  gameId?: string
  playerAchievements?: PlayerAchievement[]
  addSystemMessage?: (message: string) => void
}

export function GlobalChat({
  chatMessages,
  newMessage,
  setNewMessage,
  sendMessage,
  fetchMessages,
  gameId,
}: GlobalChatProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [lastMessageId, setLastMessageId] = useState<number>(0)
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  // Auto-scroll to bottom when new messages arrive (only if user isn't scrolling)
  useEffect(() => {
    if (chatMessages.length > 0 && !isUserScrolling) {
      const latestMessageId = Math.max(...chatMessages.map(msg => msg.id))
      if (latestMessageId > lastMessageId) {
        setLastMessageId(latestMessageId)
        scrollToBottom()
      }
    }
  }, [chatMessages, isUserScrolling, lastMessageId])

  // Semi-realtime message fetching with exponential backoff for API efficiency
  useEffect(() => {
    if (!fetchMessages || !gameId)
      return

    let intervalId: NodeJS.Timeout
    let fetchInterval = 5000 // Start with 5 seconds
    const maxInterval = 30000 // Max 30 seconds

    const fetchWithBackoff = async () => {
      try {
        const messageCountBefore = chatMessages.length
        await fetchMessages()

        // If no new messages, increase interval (exponential backoff)
        if (chatMessages.length === messageCountBefore) {
          fetchInterval = Math.min(fetchInterval * 1.5, maxInterval)
        }
        else {
          // Reset interval if new messages found
          fetchInterval = 5000
        }
      }
      catch (error) {
        console.error('Failed to fetch messages:', error)
        // Increase interval on error to reduce API calls
        fetchInterval = Math.min(fetchInterval * 2, maxInterval)
      }

      // Schedule next fetch
      intervalId = setTimeout(fetchWithBackoff, fetchInterval)
    }

    // Start fetching
    fetchWithBackoff()

    return () => {
      if (intervalId)
        clearTimeout(intervalId)
    }
  }, [fetchMessages, gameId, chatMessages.length])

  const handleScroll = () => {
    setIsUserScrolling(true)

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // Set user as not scrolling after 2 seconds of inactivity
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false)
    }, 2000)
  }

  const handleSendMessage = () => {
    sendMessage()
    // Auto-scroll to bottom after sending
    setTimeout(scrollToBottom, 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-full w-full backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      {/* Header - Fixed */}
      <div className="p-2 sm:p-3 border-b border-gray-800/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white animate-pulse" />
          <h3 className="text-white font-mono text-xs font-semibold">GLOBAL CHAT</h3>
          <div className="w-1 h-1 bg-white rounded-full animate-ping" />
        </div>
      </div>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 min-h-0 relative">
        <ScrollArea
          ref={scrollAreaRef}
          className="h-full"
          onScrollCapture={handleScroll}
        >
          <div className="p-2 sm:p-3 space-y-2 sm:space-y-3 pb-4">
            {chatMessages.length === 0
              ? (
                  <div className="text-center text-gray-500 font-mono text-xs py-8">
                    No messages yet. Start the conversation!
                  </div>
                )
              : (
                  chatMessages.map(msg => (
                    <div key={msg.id} className="text-xs">
                      <div className="flex items-start gap-1 flex-wrap sm:flex-nowrap">
                        <span className="text-white font-mono font-semibold text-xs whitespace-nowrap">
                          {msg.user}
                          :
                        </span>
                        <span className="text-gray-300 font-mono text-xs break-words flex-1 min-w-0">
                          {msg.message}
                        </span>
                      </div>
                      <span className="text-gray-500 font-mono text-xs ml-1 block sm:inline">
                        {msg.time}
                      </span>
                    </div>
                  ))
                )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area - Sticky */}
      <div className="p-2 sm:p-3 border-t border-gray-800/50 flex-shrink-0 bg-gray-900/60 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type message..."
            className="h-8 sm:h-9 text-xs bg-white/5 border-white/20 text-white placeholder-gray-500 font-mono flex-1 min-w-0"
            maxLength={500}
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            disabled={!newMessage.trim()}
            className="h-8 sm:h-9 w-8 sm:w-9 p-0 bg-white/10 hover:bg-white/20 border-white/20 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-3 h-3 text-white" />
          </Button>
        </div>
      </div>
    </div>
  )
}
