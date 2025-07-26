'use client'
import { MessageCircle, Send } from 'lucide-react'
import { Button } from '@/shadcn/ui/button'
import { Input } from '@/shadcn/ui/input'
import { ScrollArea } from '@/shadcn/ui/scroll-area'

interface ChatMessage {
  id: number
  user: string
  message: string
  time: string
}

interface GlobalChatProps {
  chatMessages: ChatMessage[]
  newMessage: string
  setNewMessage: (msg: string) => void
  sendMessage: () => void
}

export function GlobalChat({ chatMessages, newMessage, setNewMessage, sendMessage }: GlobalChatProps) {
  return (
    <div className="h-full backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      <div className="p-3 border-b border-gray-800/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-white animate-pulse" />
          <h3 className="text-white font-mono text-xs font-semibold">GLOBAL CHAT</h3>
          <div className="w-1 h-1 bg-white rounded-full animate-ping" />
        </div>
      </div>
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {chatMessages.map(msg => (
            <div key={msg.id} className="text-xs mb-2">
              <div className="flex items-start gap-1">
                <span className="text-white font-mono font-semibold text-xs">
                  {msg.user}
                  :
                </span>
                <span className="text-gray-300 font-mono text-xs flex-1">{msg.message}</span>
              </div>
              <span className="text-gray-500 font-mono text-xs ml-1">{msg.time}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-3 border-t border-gray-800/50 flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type message..."
            className="h-8 text-xs bg-white/5 border-white/20 text-white placeholder-gray-500 font-mono flex-1"
          />
          <Button
            onClick={sendMessage}
            size="sm"
            className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20 border-white/20 flex-shrink-0"
          >
            <Send className="w-3 h-3 text-white" />
          </Button>
        </div>
      </div>
    </div>
  )
}
