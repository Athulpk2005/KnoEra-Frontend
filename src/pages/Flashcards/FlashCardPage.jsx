import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowLeft, Brain, Star, Clock, Trophy, RefreshCcw } from 'lucide-react'
import flashcardService from '../../services/flashcardService'
import Flashcard from '../../components/flashcards/Flashcard'
import Spinner from '../../components/common/Spinner'
import Button from '../../components/common/Button'
import toast from 'react-hot-toast'

const FlashCardPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [flashcardSet, setFlashcardSet] = useState(null)
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFinished, setIsFinished] = useState(false)

    useEffect(() => {
        const fetchSet = async () => {
            try {
                const response = await flashcardService.getFlashcardSetById(id)
                setFlashcardSet(response.data)
            } catch (error) {
                toast.error('Failed to load flashcard set')
                console.error(error)
                navigate('/flashcards')
            } finally {
                setLoading(false)
            }
        }
        fetchSet()
    }, [id, navigate])

    const handleNext = () => {
        if (!flashcardSet) return
        if (currentIndex < flashcardSet.cards.length - 1) {
            // Record review before moving
            handleReview(currentIndex)
            setCurrentIndex(prev => prev + 1)
        } else {
            handleReview(currentIndex)
            setIsFinished(true)
        }
    }

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1)
        }
    }

    const handleReview = async (index) => {
        const currentCard = flashcardSet?.cards[index]
        if (!currentCard) return
        try {
            await flashcardService.reviewFlashcards(currentCard._id || currentCard.id, index)
        } catch (error) {
            console.error('Failed to sync review', error)
        }
    }

    const handleToggleStar = async (cardId) => {
        try {
            await flashcardService.toggleStar(cardId)
            // Update local state
            setFlashcardSet(prev => ({
                ...prev,
                cards: prev.cards.map(card =>
                    (card._id === cardId || card.id === cardId)
                        ? { ...card, isStarred: !card.isStarred }
                        : card
                )
            }))
        } catch (error) {
            toast.error('Failed to update favorite status')
        }
    }

    const resetDeck = () => {
        setCurrentIndex(0)
        setIsFinished(false)
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <Spinner size="lg" />
            <p className="mt-6 text-slate-400 font-black uppercase tracking-widest text-[10px] animate-pulse">
                Loading Study Deck...
            </p>
        </div>
    )

    if (!flashcardSet || !flashcardSet.cards?.length) return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 text-slate-300">
                <Brain size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No cards found in this set</h3>
            <p className="text-slate-500 mb-8 font-medium">This flashcard set seems to be empty. Try generating it again.</p>
            <Button onClick={() => navigate('/flashcards')} className="rounded-2xl px-8 font-black">Back to Library</Button>
        </div>
    )

    if (isFinished) {
        return (
            <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse" />
                    <div className="relative w-32 h-32 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                        <Trophy size={64} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-5xl font-black text-slate-900 tracking-tight">Deck Mastery Complete!</h2>
                    <p className="text-slate-500 text-xl font-medium max-w-md mx-auto">
                        Excellent work! You've reviewed all {flashcardSet.cards.length} cards in this session.
                    </p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/flashcards')}
                        className="px-8 py-4 border-2 rounded-2xl font-black"
                    >
                        Return to Library
                    </Button>
                    <Button
                        onClick={resetDeck}
                        className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center gap-2"
                    >
                        <RefreshCcw size={20} />
                        Study Again
                    </Button>
                </div>
            </div>
        )
    }

    const currentCard = flashcardSet.cards[currentIndex]
    const progress = ((currentIndex + 1) / flashcardSet.cards.length) * 100

    return (
        <div className="max-w-5xl mx-auto space-y-8 py-6 px-4 sm:px-0">

            {/* Nav Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <button
                    onClick={() => navigate('/flashcards')}
                    className="group flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-all font-bold"
                >
                    <div className="p-3 bg-white border border-slate-200 rounded-2xl group-hover:border-slate-400 group-hover:bg-slate-50 transition-all shadow-sm">
                        <ArrowLeft size={20} />
                    </div>
                    <span>Back to Library</span>
                </button>

                <div className="flex items-center gap-4 sm:gap-6">

                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Studying</span>
                        <h1 className="text-lg font-black text-slate-900 max-w-[200px] truncate">{flashcardSet.documentId?.title || 'Flashcard Set'}</h1>
                    </div>
                    <div className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-sm font-black shadow-lg shadow-slate-900/10 transition-transform scale-100 hover:scale-105">
                        {currentIndex + 1} / {flashcardSet.cards.length}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                <div
                    className="h-full bg-linear-to-r from-emerald-400 to-teal-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Flashcard Viewer */}
            <div className="relative min-h-[360px] sm:min-h-[450px]">

                <Flashcard
                    flashcard={currentCard}
                    onToggleStar={() => handleToggleStar(currentCard._id || currentCard.id)}
                />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 pt-4">

                <button
                    disabled={currentIndex === 0}
                    onClick={handlePrevious}
                    className={`p-4 sm:p-5 rounded-[2rem] border-2 transition-all flex items-center justify-center shadow-lg active:scale-95 ${currentIndex === 0
                        ? 'border-slate-100 text-slate-300 bg-white cursor-not-allowed'
                        : 'border-slate-200 text-slate-700 bg-white hover:border-slate-400 hover:bg-slate-50'
                        }`}
                >
                    <ChevronLeft size={28} className="sm:hidden" strokeWidth={2.5} />
                    <ChevronLeft size={32} className="hidden sm:block" strokeWidth={2.5} />
                </button>

                <button
                    onClick={handleNext}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-[3rem] bg-slate-900 text-white flex items-center justify-center shadow-2xl shadow-slate-900/30 hover:scale-110 active:scale-90 transition-all group"
                >
                    <ChevronRight size={40} className="sm:hidden group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                    <ChevronRight size={48} className="hidden sm:block group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                </button>

            </div>

            {/* Keyboard shortcuts hints */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 pt-6">

                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg shadow-sm font-bold">Space</span>
                    <span>Flip card</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg shadow-sm font-bold">← / →</span>
                    <span>Navigate</span>
                </div>
            </div>
        </div>
    )
}

export default FlashCardPage