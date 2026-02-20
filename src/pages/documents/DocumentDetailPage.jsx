import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import documentService from '../../services/documentService'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import { ArrowLeft, ExternalLink, Brain, BookOpen, FileText, Download, Sparkles, ChevronUp } from 'lucide-react'
import Tabs from '../../components/common/Tabs'
import Button from '../../components/common/Button'
import Chatinterface from '../../components/chat/Chatinterface'
import AiAction from '../../components/Ai/AiAction'
import FlashcardManager from '../../components/flashcards/FlashcardManager'
import QuizManager from '../../components/quizzes/QuizManager'

const DocumentDetailPage = () => {
  const { id } = useParams()
  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Content')
  const [processingTime, setProcessingTime] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const chatContainerRef = useRef(null)

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true)
        const doc = await documentService.getDocumentById(id)
        setDocument(doc)
      } catch (error) {
        toast.error(error.message || 'Failed to fetch document details')
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchDocument()
  }, [id])

  // Polling for processing status
  useEffect(() => {
    let interval;
    if (document?.data?.status === 'processing') {
      interval = setInterval(async () => {
        try {
          const doc = await documentService.getDocumentById(id)
          setDocument(doc)
        } catch (error) {
          console.error('Polling error:', error)
        }
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [id, document?.data?.status])

  // Timer for processing
  useEffect(() => {
    let timer;
    if (document?.data?.status === 'processing') {
      timer = setInterval(() => {
        setProcessingTime(prev => prev + 1)
      }, 1000)
    } else {
      setProcessingTime(0)
    }
    return () => clearInterval(timer)
  }, [document?.data?.status])

  // Handle scroll for chat section
  useEffect(() => {
    const handleScroll = () => {
      if (activeTab === 'Chat' && chatContainerRef.current) {
        const container = chatContainerRef.current
        setShowScrollTop(container.scrollTop > 200)
      }
    }

    const container = chatContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [activeTab])

  const scrollToTop = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getpdfUrl = () => {
    // First try to use the fileUrl if it exists
    if (document?.data?.fileUrl) {
      // Replace localhost with the correct API URL if needed
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const finalUrl = document.data.fileUrl.replace('http://localhost:8000', baseUrl)
      console.log('PDF URL from fileUrl:', finalUrl)
      return finalUrl
    }
    
    if (!document?.data?.filePath) return null

    let filePath = document.data.filePath
    filePath = filePath.replace(/\\/g, '/')

    // If it's an absolute path containing '/uploads/', extract the relative portion
    if (filePath.includes('/uploads/')) {
      const parts = filePath.split('/uploads/')
      const relativePath = '/uploads/' + parts[parts.length - 1]
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const finalUrl = `${baseUrl}${relativePath}`
      console.log('PDF URL from filePath:', finalUrl)
      return finalUrl
    }

    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      console.log('PDF URL direct:', filePath)
      return filePath
    }

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    const sanitizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`
    const finalUrl = `${baseUrl}${sanitizedPath}`
    console.log('PDF URL fallback:', finalUrl)
    return finalUrl
  }

  const renderContent = () => {
    if (!document?.data?.filePath) {
      return <div className="text-center p-8 bg-white rounded-3xl border border-slate-200">Document data is incomplete or missing.</div>
    }

    const pdfUrl = getpdfUrl()

    if (document?.data?.status === 'processing') {
      return (
        <div className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-lg shadow-slate-100">
          <div className="relative w-32 h-32 mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx="64"
                cy="64"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * (Math.min(processingTime, 30) / 30))}
                className="text-primary transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl font-black text-slate-800 tracking-tighter">
                {formatTime(processingTime)}
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-3 italic">Analyzing PDF Content</h3>
          <p className="text-slate-500 max-w-sm mb-8 leading-relaxed italic">
            Please wait while our AI extracts text, generates chunks, and builds your learning context.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Processing...</span>
          </div>
        </div>
      )
    }

    return (
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 transition-all duration-500">
        <div className="flex items-center justify-between p-5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <FileText size={18} className="text-primary" />
            </div>
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Document Viewer</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:text-primary transition-colors bg-white border border-slate-200 rounded-xl shadow-sm"
            >
              <ExternalLink size={14} />
              Open Full Screen
            </a>
          </div>
        </div>
        <div className="bg-slate-200/30 p-4">
          <iframe
            src={pdfUrl}
            className="w-full h-[75vh] bg-white rounded-2xl shadow-inner border-none"
            title="Document Viewer"
          />
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-2">Secure PDF Viewer • KnoEra AI</p>
          <button
            onClick={() => window.open(pdfUrl, '_blank')}
            className="flex items-center gap-2 text-xs font-bold text-primary hover:underline"
          >
            <Download size={14} />
            Download for offline use
          </button>
        </div>
      </div>
    )
  }

  const renderChat = () => {
    if (document?.data?.status === 'processing') {
      return renderProcessingState()
    }
    return (
      <div className="relative">
        <div
          ref={chatContainerRef}
          className="max-h-[calc(100vh-20rem)] overflow-y-auto"
        >
          <Chatinterface />
        </div>

        {/* Scroll to top button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="Scroll to top"
          >
            <ChevronUp size={20} />
          </button>
        )}
      </div>
    )
  }

  const renderAIAction = () => {
    if (document?.data?.status === 'processing') {
      return renderProcessingState()
    }
    return (
      <AiAction />
    )
  }

  const renderProcessingState = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-lg shadow-slate-100">
        <div className="relative w-32 h-32 mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="60"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-100"
            />
            <circle
              cx="64"
              cy="64"
              r="60"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={377}
              strokeDashoffset={377 - (377 * (Math.min(processingTime, 30) / 30))}
              className="text-primary transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl font-black text-slate-800 tracking-tighter">
              {formatTime(processingTime)}
            </div>
          </div>
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-3 italic">Processing Document</h3>
        <p className="text-slate-500 max-w-sm mb-8 leading-relaxed italic">
          Please wait while our AI analyzes your document. This feature will be available once processing is complete.
        </p>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Processing...</span>
        </div>
      </div>
    )
  }

  const renderFlashcardsTab = () => {
    if (document?.data?.status === 'processing') {
      return renderProcessingState()
    }
    return (
      <FlashcardManager documentId={id} />
    )
  }

  const renderQuizzesTab = () => {
    if (document?.data?.status === 'processing') {
      return renderProcessingState()
    }
    return <QuizManager documentId={id} />
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Spinner size="lg" />
        <p className="mt-4 text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Initializing Analysis...</p>
      </div>
    )
  }

  if (!document || !document.data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FileText size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Document Not Found</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            We couldn't retrieve the details for this document. It might have been deleted or the link is invalid.
          </p>
          <Link to="/documents">
            <Button className="w-full">Return to Library</Button>
          </Link>
        </div>
      </div>
    )
  }

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'Content':
        return renderContent();
      case 'Chat':
        return renderChat();
      case 'AI Action':
        return renderAIAction();
      case 'Flashcards':
        return renderFlashcardsTab();
      case 'Quizzes':
        return renderQuizzesTab();
      default:
        return renderContent();
    }
  };

  const tabsConfig = [
    { name: 'Content', label: 'Content' },
    { name: 'Chat', label: 'Chat' },
    { name: 'AI Action', label: 'AI Action' },
    { name: 'Flashcards', label: 'Flashcards' },
    { name: 'Quizzes', label: 'Quizzes' }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            to="/documents"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:text-primary hover:border-primary/30 transition-all shadow-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Library
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider mb-3">
              <Sparkles className="w-3 h-3" />
              Smart Document Analysis
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight truncate" title={document.data.title}>
              {document.data.title}
            </h1>

            {/* Processing Timer Badge */}
            {document?.data?.status === 'processing' && (
              <div className="mt-4 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 shadow-lg shadow-amber-100/50">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-8 h-8 bg-amber-400 rounded-full animate-ping opacity-20" />
                  <div className="relative w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-amber-900 uppercase tracking-wider">Processing PDF</span>
                  <span className="text-lg font-black text-amber-700 tracking-tight tabular-nums">
                    {formatTime(processingTime)}
                  </span>
                </div>
                <div className="flex gap-1 ml-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm shrink-0 overflow-x-auto no-scrollbar">
            <div className="flex flex-col items-center px-4 min-w-fit">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Flashcards</span>
              <span className="text-xl font-black text-slate-900">{document.data.flashcardCount || 0}</span>
            </div>
            <div className="w-px h-8 bg-slate-100 flex-shrink-0" />
            <div className="flex flex-col items-center px-4 min-w-fit">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Quizzes</span>
              <span className="text-xl font-black text-slate-900">{document.data.quizCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <Tabs tabs={tabsConfig} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <div className="mt-6 sm:mt-8 transition-all duration-500 animate-fade-in-up">
          {renderActiveTabContent()}
        </div>
      </div>
    </div>
  )
}

export default DocumentDetailPage