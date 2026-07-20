import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { aiAPI } from '../services/api'
import { PageHeader, Button, EmptyState, Skeleton } from '../components/ui'
import { Bot, Send, Plus, MessageSquare, User } from 'lucide-react'

function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-primary-600' : 'bg-dark-700'}`}>
        {isUser ? <User size={16} /> : <Bot size={16} className="text-primary-400" />}
      </div>
      <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${isUser ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-100'}`}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </motion.div>
  )
}

export default function AICoach() {
  const [activeConversation, setActiveConversation] = useState(null)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const { data: conversations, isLoading: loadingConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => aiAPI.getConversations().then((r) => r.data.conversations),
  })

  const createMutation = useMutation({
    mutationFn: () => aiAPI.createConversation({ title: 'New Chat' }).then((r) => r.data.conversation),
    onSuccess: (conv) => {
      setActiveConversation(conv)
    },
  })

  const sendMutation = useMutation({
    mutationFn: (data) => aiAPI.sendMessage(data).then((r) => r.data.message),
    onSuccess: (msg) => {
      if (activeConversation) {
        setActiveConversation((prev) => ({
          ...prev,
          messages: [...prev.messages, msg],
        }))
      }
    },
  })

  const handleSend = () => {
    if (!input.trim() || !activeConversation) return
    const userMsg = { role: 'user', content: input }
    setActiveConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, userMsg],
    }))
    sendMutation.mutate({ conversationId: activeConversation.id, content: input })
    setInput('')
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConversation?.messages])

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 card p-4">
        <Button onClick={() => createMutation.mutate()} className="w-full mb-4" disabled={createMutation.isPending}>
          <Plus size={16} className="mr-2" /> New Chat
        </Button>
        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2">
          {loadingConversations ? (
            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-12" />)
          ) : (
            (conversations || []).map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConversation(conv)}
                className={`w-full text-left p-3 rounded-xl text-sm transition-colors flex items-center gap-2 ${activeConversation?.id === conv.id ? 'bg-primary-600/10 text-primary-400 border border-primary-600/20' : 'hover:bg-dark-800 text-dark-300'}`}
              >
                <MessageSquare size={14} />
                <span className="truncate">{conv.title}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col card">
        {!activeConversation ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-primary-600/10 flex items-center justify-center mb-4">
              <Bot size={32} className="text-primary-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">LeetCoach AI</h3>
            <p className="text-dark-400 max-w-md mb-6">
              Ask me anything about algorithms, data structures, or get help understanding your solutions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
              {['Explain this solution', 'Why did I get TLE?', 'Compare approaches', 'Give me a hint'].map((q) => (
                <button key={q} onClick={() => {
                  createMutation.mutate(undefined, {
                    onSuccess: (conv) => {
                      setInput(q)
                    },
                  })
                }} className="p-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-left text-sm text-dark-300 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-4">
              {(activeConversation.messages || []).length === 0 && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center">
                    <Bot size={16} className="text-primary-400" />
                  </div>
                  <div className="bg-dark-800 rounded-2xl px-4 py-3">
                    <p className="text-sm">Hi! I'm LeetCoach AI. How can I help you today?</p>
                  </div>
                </div>
              )}
              {(activeConversation.messages || []).map((msg, i) => (
                <ChatMessage key={i} message={msg} />
              ))}
              {sendMutation.isPending && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center">
                    <Bot size={16} className="text-primary-400" />
                  </div>
                  <div className="bg-dark-800 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-dark-500 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-dark-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-2 h-2 bg-dark-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-dark-800">
              <div className="flex gap-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="input flex-1"
                  disabled={sendMutation.isPending}
                />
                <Button onClick={handleSend} disabled={!input.trim() || sendMutation.isPending}>
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
