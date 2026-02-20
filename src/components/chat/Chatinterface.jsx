import React, { useState, useEffect, useRef } from 'react'
import { Send, MessageSquare, Sparkles, Bot, User, Trash2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import aiservice from '../../services/aiService'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const Chatinterface = ({ documentId: propDocumentId }) => {
  const { id: routeDocumentId } = useParams()
  const documentId = propDocumentId || routeDocumentId
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [initialLoading, setInitialLoading] = useState(true)
  const messageEndRef = useRef(null)

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setInitialLoading(true)
        const response = await aiservice.getChatHistory(documentId)
        setHistory(Array.isArray(response) ? response : (response.data || []))
      } catch (error) {
        console.error("Failed to fetch chat history", error)
      } finally {
        setInitialLoading(false)
      }
    }
    if (documentId) {
      fetchChatHistory()
    }
  }, [documentId, propDocumentId])

  useEffect(() => {
    scrollToBottom()
  }, [history])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || loading) return
    if (!documentId) return

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setHistory(prev => [...prev, userMessage])
    const currentMessage = inputMessage
    setInputMessage('')
    setLoading(true)

    try {
      const response = await aiservice.chat(documentId, currentMessage)
      const assistantMessage = {
        role: 'assistant',
        content: response.data.answer,
        timestamp: new Date(),
        relevantChunks: response.data.relevantChunks
      }
      setHistory(prev => [...prev, assistantMessage])
    } catch (error) {
      let errorText = 'Something went wrong, please try again'
      if (error.error) {
        errorText = error.error
      } else if (error.message) {
        errorText = error.message
      }

      toast.error(errorText)

      const errorMessage = {
        role: 'assistant',
        content: `❌ Error: ${errorText}`,
        timestamp: new Date(),
        isError: true
      }
      setHistory(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleClearChat = async () => {
    // Optional: Add logic to clear history on backend if needed
    setHistory([])
  }

  if (initialLoading) {
    return (
      <div className="flex min-h-[360px] md:h-[calc(100vh-12rem)] items-center justify-center bg-white rounded-3xl border border-slate-200">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[420px] md:h-[calc(100vh-12rem)] bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden relative">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-white/80 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Bot size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-slate-900 leading-tight">AI Assistant</h3>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                Beta
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Ask questions about this document</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearChat}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear Chat"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-6">
            <div className="w-24 h-24 rounded-3xl bg-white shadow-lg shadow-slate-100 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Sparkles size={48} className="text-primary/40 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="text-center max-w-xs space-y-2">
              <h4 className="font-bold text-slate-700">No messages yet</h4>
              <p className="text-sm">Start a conversation to get instant answers from your document!</p>
            </div>
          </div>
        ) : (
          history.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-down`}
            >
              <div
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-sm border ${msg.role === 'user'
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-primary'
                  }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Bubble */}
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`rounded-2xl p-4 shadow-sm ${msg.role === 'user'
                      ? 'bg-primary text-white rounded-tr-sm'
                      : msg.isError
                        ? 'bg-red-50 text-red-900 border border-red-100 rounded-tl-sm'
                        : 'bg-white text-slate-700 border border-slate-200 rounded-tl-sm'
                      }`}
                  >
                    <div className={`text-sm leading-relaxed max-w-none ${msg.role === 'user' ? 'text-white' : 'text-slate-700'
                      }`}>
                      {msg.role === 'user' ? (
                        msg.content
                      ) : (
                        <div className="markdown-content">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 font-medium px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-start animate-fade-in-down">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-primary flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={14} />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                <div className="flex gap-1.5 items-center h-5">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 sm:p-5 bg-white border-t border-slate-100 z-10">
        <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask a question..."
            className="w-full h-12 bg-slate-50 text-slate-900 rounded-xl pl-4 sm:pl-5 pr-12 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 font-medium"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="absolute right-2 top-2 h-8 w-8 flex items-center justify-center rounded-lg bg-white text-primary hover:bg-primary hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-primary transition-all duration-200 shadow-sm border border-slate-100"
          >
            <Send size={16} className={inputMessage.trim() && !loading ? "ml-0.5" : ""} />
          </button>
        </form>
        <div className="text-center mt-2">
          <p className="text-[10px] text-slate-400 font-medium">AI can make mistakes. Please verify important information.</p>
        </div>
      </div>
    </div>
  )
}

export default Chatinterface