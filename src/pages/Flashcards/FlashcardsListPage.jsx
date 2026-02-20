import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, ArrowRight, Trash2, Plus, Sparkles, BookOpen, Search } from 'lucide-react'
import flashcardService from '../../services/flashcardService'
import Spinner from '../../components/common/Spinner'
import Button from '../../components/common/Button'
import toast from 'react-hot-toast'
import moment from 'moment'

const FlashcardsListPage = () => {
  const [flashcardSets, setFlashcardSets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await flashcardService.getFlashcards()
        setFlashcardSets(response.data || [])
      } catch (error) {
        toast.error('Failed to load flashcards')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchSets()
  }, [])

  const handleDeleteSet = async (e, setId) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this flashcard set?')) return
    try {
      await flashcardService.deleteFlashcard(setId)
      setFlashcardSets(flashcardSets.filter(s => (s._id || s.id) !== setId))
      toast.success('Flashcard set deleted')
    } catch (error) {
      toast.error('Failed to delete set')
    }
  }

  const filteredSets = flashcardSets.filter(set =>
    (set.documentId?.title || 'Flashcard Set').toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
      <p className="mt-6 text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">
        Preparing your study decks...
      </p>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-6 px-4 sm:px-0">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100">
            <BookOpen size={12} />
            Study Library
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            My <span className="text-slate-300">Flashcard</span> Decks
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-xl">
            Master your subjects with AI-generated flashcards. Efficient spaced repetition starts here.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm shrink-0">

          <div className="flex flex-col items-center px-6 py-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Decks</span>
            <span className="text-2xl font-black text-slate-900">{flashcardSets.length}</span>
          </div>
          <div className="w-px h-10 bg-slate-100" />
          <div className="flex flex-col items-center px-6 py-2">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Total Cards</span>
            <span className="text-2xl font-black text-amber-600">
              {flashcardSets.reduce((acc, set) => acc + (set.cards?.length || 0), 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col lg:flex-row gap-4">

        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-amber-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search your decks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 transition-all font-bold placeholder:text-slate-300"
          />
        </div>

        <Button
          variant="primary"
          onClick={() => navigate('/documents')}
          className="h-[56px] sm:h-[60px] px-8 bg-slate-900 hover:bg-black text-white rounded-2xl flex items-center gap-2 shadow-xl shadow-slate-900/10 w-full sm:w-auto"
        >
          <Plus size={20} />
          New Deck
        </Button>
      </div>

      {/* Grid Section */}
      {filteredSets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

          {filteredSets.map((set) => (
            <div
              key={set._id || set.id}
              onClick={() => navigate(`/flashcards/${set._id || set.id}`)}
              className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Decorative background circle */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50" />

              <div className="relative flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200/50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <Brain size={28} strokeWidth={2.5} />
                  </div>
                  <button
                    onClick={(e) => handleDeleteSet(e, set._id || set.id)}
                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="space-y-2 mb-8 uppercase">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-black tracking-tighter shadow-sm border border-slate-200">
                      {set.documentId?.title || 'General'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                    {set.documentId?.title ? `${set.documentId.title} Deck` : 'Untitled Deck'}
                  </h3>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cards</span>
                      <span className="text-lg font-black text-slate-900">{set.cards?.length || 0}</span>
                    </div>
                    <div className="w-px h-8 bg-slate-100" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Created</span>
                      <span className="text-sm font-bold text-slate-600 lowercase">{moment(set.createdAt).format('MMM D')}</span>
                    </div>
                  </div>

                  <div className="w-10 h-10 bg-slate-50 group-hover:bg-amber-500 group-hover:text-white rounded-full flex items-center justify-center transition-all duration-300">
                    <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 sm:py-24 bg-white rounded-[3rem] sm:rounded-[4rem] border-2 border-dashed border-slate-100 px-6">
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-slate-300">
            <Sparkles size={48} />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">No Decks Found</h3>

          <p className="text-slate-500 max-w-sm mx-auto font-medium text-lg leading-relaxed">
            Navigate to your documents to generate your first AI study deck.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/documents')}
            className="mt-8 sm:mt-10 px-10 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black shadow-2xl shadow-slate-900/20"
          >
            Go to Documents
          </Button>
        </div>
      )}
    </div>
  )
}

export default FlashcardsListPage