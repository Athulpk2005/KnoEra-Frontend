import React, { useState, useEffect } from 'react'
import { Plus, Trash2, HelpCircle, Brain, Sparkles, LayoutGrid, Search, X, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import quizService from '../../services/quizService'
import aiService from '../../services/aiService'
import Spinner from '../common/Spinner'
import Button from '../common/Button'
import Modal from '../common/Modal'
import QuizCard from './QuizCard'
import EmptyState from '../common/EmptyState'

const QuizManager = ({ documentId }) => {

    const [quizzes, setQuizzes] = useState([])
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
    const [numQuestions, setNumQuestions] = useState(5)
    const [previewQuiz, setPreviewQuiz] = useState(null)

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [selectedQuizId, setSelectedQuizId] = useState(null)
    const navigate = useNavigate()

    const fetchQuizzes = async () => {
        setLoading(true)
        try {
            const data = await quizService.getQuizzesForDocument(documentId)
            setQuizzes(data.data)
        } catch (error) {
            toast.error('Failed to fetch quizzes')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (documentId) {
            fetchQuizzes()
        }
    }, [documentId])

    const handleGenerate = async (e) => {
        e.preventDefault()
        setGenerating(true)
        try {
            const response = await aiService.generateQuiz(documentId, { numQuestions })
            toast.success('Quiz generated successfully')
            setIsGenerateModalOpen(false)
            if (response.data) {
                navigate(`/quizzes/${response.data._id || response.data.id}`)
            } else {
                fetchQuizzes()
            }
        } catch (error) {
            toast.error(error.message || 'Failed to generate quizzes')
            console.log(error)
        } finally {
            setGenerating(false)
        }
    }

    const handleDeleteRequest = (id) => {
        setSelectedQuizId(id)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!selectedQuizId) return
        setDeleting(true)
        try {
            await quizService.deleteQuiz(selectedQuizId)
            toast.success('Quiz deleted successfully')
            fetchQuizzes()
            setIsDeleteModalOpen(false)
            setSelectedQuizId(null)
        } catch (error) {
            toast.error('Failed to delete quiz')
            console.log(error)
        } finally {
            setDeleting(false)
        }
    }

    const handleStartQuiz = (id) => {
        navigate(`/quizzes/${id}`)
    }

    const handleViewResults = (id) => {
        navigate(`/quizzes/${id}/results`)
    }

    const renderQuizzContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-20">
                    <Spinner />
                </div>
            )
        }

        if (quizzes.length === 0) {
            return (
                <EmptyState
                    icon={Brain}
                    title="No Quizzes Found"
                    description="Challenge yourself! Generate AI-powered quizzes to test your understanding of this document."
                    buttonText="Generate First Quiz"
                    onActionClick={() => setIsGenerateModalOpen(true)}
                />
            )
        }

        return (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {quizzes.map((quiz) => (
                    <div key={quiz._id || quiz.id} className="relative group/card">
                        <QuizCard
                            quiz={quiz}
                            onDelete={handleDeleteRequest}
                            onStartQuiz={handleStartQuiz}
                            onViewResults={handleViewResults}
                        />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className='bg-slate-50/30 rounded-3xl border border-slate-100 p-8'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10'>
                <div>
                    <h3 className='text-3xl font-black text-slate-900 tracking-tight'>
                        Knowledge Checks
                    </h3>
                    <p className='text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest'>
                        {quizzes.length} {quizzes.length === 1 ? 'Quiz' : 'Quizzes'} Available
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {quizzes.length > 0 && (
                        <Button
                            variant="outline"
                            onClick={() => handleStartQuiz(quizzes[0]._id || quizzes[0].id)}
                            className="bg-white hover:bg-slate-50 border-2 font-black px-8 h-12 rounded-2xl hidden md:flex"
                        >
                            <Brain size={18} className="mr-2 text-emerald-500" />
                            Start Latest Quiz
                        </Button>
                    )}
                    <Button
                        onClick={() => setIsGenerateModalOpen(true)}
                        className="shadow-emerald-500/20 px-8 h-12 rounded-2xl"
                    >
                        <Sparkles size={18} className="mr-2" />
                        Generate New Quiz
                    </Button>
                </div>
            </div>

            {renderQuizzContent()}

            {/* Generate Quiz Modal */}
            <Modal
                isOpen={isGenerateModalOpen}
                onClose={() => setIsGenerateModalOpen(false)}
                title="Generate AI Quiz"
            >
                <form onSubmit={handleGenerate} className="space-y-6">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-emerald-900">AI Quiz Generation</p>
                            <p className="text-xs text-emerald-700/80 font-medium">We'll analyze your document to create context-aware questions.</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-black text-slate-700 uppercase tracking-wider">
                            Number of Questions
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                            {[5, 10, 15, 20].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setNumQuestions(num)}
                                    className={`py-3 rounded-xl font-bold transition-all ${numQuestions === num
                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-500 ring-offset-2"
                                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button variant="secondary" onClick={() => setIsGenerateModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={generating} className="px-8">
                            {generating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                "Generate Quiz"
                            )}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete AI Quiz"
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                            <Trash2 className="w-6 h-6 text-rose-500" />
                        </div>
                        <div>
                            <h4 className="font-bold">Irreversible Action</h4>
                            <p className="text-sm opacity-90">Are you sure you want to delete this quiz?</p>
                        </div>
                    </div>

                    <p className="text-slate-600 leading-relaxed font-medium">
                        Deleting this quiz will remove all associated results and progress tracking permanently.
                    </p>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button
                            variant="secondary"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={deleting}
                        >
                            Keep Quiz
                        </Button>
                        <Button
                            className="bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25 border-none px-8"
                            onClick={handleConfirmDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Removing...' : 'Delete Permanently'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Preview Modal */}
            <Modal
                isOpen={!!previewQuiz}
                onClose={() => setPreviewQuiz(null)}
                title="Assessment Content Preview"
            >
                {previewQuiz && (
                    <div className="space-y-6 max-h-[70vh] overflow-y-auto p-4">
                        <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 mb-8">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                <Brain className="text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">{previewQuiz.title}</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{previewQuiz.totalQuestions} Questions • {previewQuiz.difficulty || 'Normal'}</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {previewQuiz.questions?.map((q, idx) => (
                                <div key={idx} className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0">{idx + 1}</span>
                                        <p className="text-lg font-bold text-slate-800 leading-tight pt-1">{q.question || q.text}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                                        {q.options?.map((opt, optIdx) => (
                                            <div key={optIdx} className="p-3 bg-white border border-slate-100 rounded-xl text-sm font-medium text-slate-500 flex items-center gap-2">
                                                <span className="w-5 h-5 rounded bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-300">{String.fromCharCode(65 + optIdx)}</span>
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default QuizManager