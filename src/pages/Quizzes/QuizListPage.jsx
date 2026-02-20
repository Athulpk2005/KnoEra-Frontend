import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, Search, Terminal, Filter, ArrowRight, BookOpen, Clock, Trophy, Sparkles } from 'lucide-react'
import quizService from '../../services/quizService'
import Spinner from '../../components/common/Spinner'
import QuizCard from '../../components/quizzes/QuizCard'
import Button from '../../components/common/Button'
import toast from 'react-hot-toast'

const QuizListPage = () => {
    const [quizzes, setQuizzes] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filter, setFilter] = useState('all') // all, completed, pending
        const navigate = useNavigate()

    useEffect(() => {
        const fetchAllQuizzes = async () => {
            try {
                const response = await quizService.getAllQuizzes()
                setQuizzes(response.data || [])
            } catch (error) {
                toast.error('Failed to load your assessments')
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchAllQuizzes()
    }, [])

    const handleDeleteQuiz = async (quizId) => {
        try {
            await quizService.deleteQuiz(quizId)
            setQuizzes(quizzes.filter(q => (q._id || q.id) !== quizId))
            toast.success('Assessment removed')
        } catch (error) {
            toast.error('Failed to delete assessment')
        }
    }

    const filteredQuizzes = quizzes.filter(q => {
        const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase())
        if (filter === 'completed') return matchesSearch && (q.score !== undefined || q.completedAt)
        if (filter === 'pending') return matchesSearch && !(q.score !== undefined || q.completedAt)
        return matchesSearch
    })

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Spinner size="lg" />
            <p className="mt-6 text-slate-400 font-black uppercase tracking-widest text-[10px] animate-pulse">
                Retrieving Assessments...
            </p>
        </div>
    )

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10 sm:mb-12">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        <Trophy size={12} />
                        My Progress
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                        Assessments <span className="text-slate-300">&</span> History
                    </h1>
                    <p className="text-slate-500 font-medium text-lg max-w-xl">
                        Track your performance across all generated quizzes. Review your answers and challenge yourself to improve.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm shrink-0">
                    <div className="flex flex-col items-center px-6 py-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</span>
                        <span className="text-2xl font-black text-slate-900">{quizzes.length}</span>
                    </div>
                    <div className="w-px h-10 bg-slate-100" />
                    <div className="flex flex-col items-center px-6 py-2">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Passed</span>
                        <span className="text-2xl font-black text-emerald-600">
                            {quizzes.filter(q => q.score >= 70).length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="flex flex-col lg:flex-row gap-4 mb-10">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-emerald-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by quiz title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold placeholder:text-slate-300"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200">
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'completed', label: 'Completed' },
                        { id: 'pending', label: 'Pending' }
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === f.id
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Section */}
            {filteredQuizzes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredQuizzes.map((quiz) => (
                        <div key={quiz._id || quiz.id} className="relative group/card">
                            <QuizCard
                                quiz={quiz}
                                onDelete={handleDeleteQuiz}
                                onStartQuiz={(id) => navigate(`/quizzes/${id}`)}
                                onViewResults={(id) => navigate(`/quizzes/${id}/results`)}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <Search size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">No Assessments Found</h3>
                    <p className="text-slate-500 max-w-xs mx-auto font-medium">
                        Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchTerm('')
                            setFilter('all')
                        }}
                        className="mt-8 border-2 rounded-2xl px-8 font-black"
                    >
                        Clear Filters
                    </Button>
                </div>
            )}
        </div>
    )
}

export default QuizListPage
