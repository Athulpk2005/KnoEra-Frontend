import React, { useState, useEffect } from 'react'
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    Trash2,
    ArrowLeft,
    Sparkles,
    Brain
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import moment from 'moment'
import flashcardService from '../../services/flashcardService'
import aiService from '../../services/aiService'
import Spinner from '../common/Spinner'
import Modal from '../common/Modal'
import Flashcard from './Flashcard'
import Button from '../common/Button'

const FlashcardManager = ({ documentId }) => {

    const [flashcardSets, setFlashcardSets] = useState([])
    const [selectedSet, setSelectedSet] = useState(null)
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [SetToDeleting, setSetToDeleting] = useState(null)


    const fetchFlashcardSets = async () => {
        setLoading(true)
        try {
            const response = await flashcardService.getFlashcardsForDocument(documentId)
            setFlashcardSets(response.data)
        } catch (error) {
            toast.error('Failed to fetch flashcard sets')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (documentId) {
            fetchFlashcardSets()
        }
    }, [documentId])

    const handleGenerateFlashcards = async () => {
        setGenerating(true)
        try {
            await aiService.generateFlashcards(documentId)
            toast.success('Flashcards generated successfully')
            fetchFlashcardSets()
        } catch (error) {
            toast.error(error.message || 'Failed to generate flashcards')
            console.log(error)
        } finally {
            setGenerating(false)
        }
    }

    const handleNextCard = () => {
        if (selectedSet) {
            handleReview(currentCardIndex)
            setCurrentCardIndex(
                (prevIndex) => (prevIndex + 1) % selectedSet.cards.length
            )
        }
    }

    const handlePreviousCard = () => {
        if (selectedSet) {
            handleReview(currentCardIndex)
            setCurrentCardIndex(
                (prevIndex) => (prevIndex - 1 + selectedSet.cards.length) % selectedSet.cards.length
            )
        }
    }

    const handleReview = async (index) => {
        const currentCard = selectedSet?.cards[currentCardIndex]
        if (!currentCard) return

        try {
            await flashcardService.reviewFlashcards(currentCard._id, index)
            toast.success('Flashcard reviewed successfully')

        } catch (error) {
            toast.error(error.message || 'Failed to review flashcard')
            console.log(error)
        }
    }

    const handleToggleStar = async (cardId) => {
        try {
            await flashcardService.toggleStar(cardId)
            fetchFlashcardSets()
        } catch (error) {
            toast.error(error.message || 'Failed to toggle star')
            console.log(error)
        }
    }


    const handleDeleteRequest = (e, set) => {
        e.stopPropagation()
        setSetToDeleting(set)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!SetToDeleting) return
        setDeleting(true)
        try {
            await flashcardService.deleteFlashcard(SetToDeleting._id || SetToDeleting.id)
            toast.success('Flashcard set deleted successfully')
            fetchFlashcardSets()
            setIsDeleteModalOpen(false)
            setSetToDeleting(null)
        } catch (error) {
            toast.error(error.message || 'Failed to delete flashcard set')
            console.log(error)
        } finally {
            setDeleting(false)
        }
    }

    const handleSelectSet = (set) => {
        setSelectedSet(set)
        setCurrentCardIndex(0)
    }

    const renderFlashcardViewer = () => {
        if (!selectedSet || !selectedSet.cards) return null
        const currentCard = selectedSet.cards[currentCardIndex]

        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => setSelectedSet(null)}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors group"
                    >
                        <div className="p-2 bg-white border border-slate-200 rounded-xl group-hover:border-slate-300 transition-colors">
                            <ChevronLeft size={20} />
                        </div>
                        <span>Back to Sets</span>
                    </button>

                    <div className="px-4 py-2 bg-slate-100 rounded-xl text-sm font-bold text-slate-600 tabular-nums">
                        {currentCardIndex + 1} / {selectedSet.cards.length}
                    </div>
                </div>

                <div className="relative min-h-[400px] flex flex-col">
                    <Flashcard
                        flashcard={currentCard}
                        onToggleStar={() => handleToggleStar(currentCard._id || currentCard.id)}
                    />
                </div>

                <div className="flex items-center justify-between mt-8 gap-4">
                    <Button
                        variant="outline"
                        onClick={handlePreviousCard}
                        className="w-32"
                    >
                        <ChevronLeft size={18} />
                        Previous
                    </Button>

                    <Button
                        onClick={handleNextCard}
                        className="w-32 shadow-emerald-500/20"
                    >
                        Next
                        <ChevronRight size={18} />
                    </Button>
                </div>
            </div>
        )
    }

    const renderSetList = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-20">
                    <Spinner />
                </div>
            )
        }

        if (flashcardSets.length === 0) {
            return (
                <div className='flex flex-col items-center justify-center py-16 px-6'>
                    <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 mb-6'>
                        <Brain className='w-8 h-8 text-emerald-600' strokeWidth={2} />
                    </div>
                    <h3 className='text-xl font-black text-slate-900 mb-2'>No Flashcard Sets Found</h3>
                    <p className='text-slate-500 max-w-sm text-center mb-8'>Generate flashcards from your document to start learning and reinforce your knowledge.</p>
                    <Button
                        onClick={handleGenerateFlashcards}
                        disabled={generating}
                        className="px-8 shadow-emerald-500/20"
                    >
                        {generating ? (
                            <>
                                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                                Generating...</>
                        ) : (
                            <>
                                <Sparkles className='w-4 h-4' strokeWidth={2} />
                                Generate Flashcards</>
                        )}
                    </Button>
                </div>
            )
        }
        return (
            <div className=''>
                {/* Header with Generate Flashcards button*/}
                <div className='space-y-8'>
                    {/* Header with Generate Flashcards button*/}
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                        <div>
                            <h3 className='text-2xl font-black text-slate-900'>
                                Your Flashcard Sets
                            </h3>
                            <p className='text-slate-500 font-medium mt-1'>
                                {flashcardSets.length}{" "}
                                {flashcardSets.length === 1 ? "Set" : "Sets"} available
                            </p>
                        </div>
                        <Button
                            onClick={handleGenerateFlashcards}
                            disabled={generating}
                            className="w-full sm:w-auto shadow-emerald-500/20"
                        >
                            {generating ? (
                                <>
                                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                                    Generating...</>
                            ) : (
                                <>
                                    <Plus className='w-5 h-5' strokeWidth={2.5} />
                                    Generate New Set</>
                            )}
                        </Button>
                    </div>

                    {/*Flashcard Sets Grid*/}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {flashcardSets.map((set) => (
                            <div
                                key={set._id || set.id}
                                onClick={() => handleSelectSet(set)}
                                className='group relative bg-white border-2 border-slate-100 rounded-2xl p-6 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer overflow-hidden'
                            >
                                {/*Delete Button*/}
                                <button
                                    onClick={(e) => handleDeleteRequest(e, set)}
                                    className="absolute top-4 right-4 p-2 bg-red-500 text-white hover:bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-md hover:shadow-lg z-10"
                                >
                                    <Trash2 className='w-4 h-4' strokeWidth={2.5} />
                                </button>

                                {/*Set content*/}
                                <div className='flex flex-col h-full'>
                                    <div className='w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300'>
                                        <Brain className='w-6 h-6' strokeWidth={2.5} />
                                    </div>
                                    <div className="mb-4">
                                        <h4 className='font-bold text-slate-900 mb-1 line-clamp-1'>
                                            Flashcard Set
                                        </h4>
                                        <p className='text-xs font-bold text-slate-400 uppercase tracking-wider'>
                                            Created {moment(set.createdAt).format("DD MMM YYYY")}
                                        </p>
                                    </div>

                                    <div className='mt-auto pt-4 border-t border-slate-100 flex items-center justify-between'>
                                        <div className='flex items-center gap-2'>
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className='text-sm font-bold text-slate-600'>
                                                {set.cards?.length || 0}{" "}
                                                {set.cards?.length === 1 ? "Card" : "Cards"}
                                            </span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>
        )
    }



    return (
        <div>
            {selectedSet ? renderFlashcardViewer() : renderSetList()}

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Flashcard Set"
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-rose-50 text-rose-700 rounded-xl">
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                            <Trash2 className="w-6 h-6 text-rose-500" />
                        </div>
                        <div>
                            <h4 className="font-bold">Are you sure?</h4>
                            <p className="text-sm opacity-90">This action cannot be undone.</p>
                        </div>
                    </div>

                    <p className="text-slate-600 leading-relaxed">
                        You are about to delete this flashcard set containing <span className="font-bold text-slate-900">{SetToDeleting?.cards?.length || 0} cards</span>.
                        They will be permanently removed from your collection.
                    </p>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="secondary"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="!bg-none bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 border-none"
                            onClick={handleConfirmDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Delete Set'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>

    )
}

export default FlashcardManager