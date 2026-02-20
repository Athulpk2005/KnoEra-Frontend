import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Clock,
    Trophy,
    AlertCircle,
    ArrowLeft,
    Timer,
    Check,
    HelpCircle,
    Award,
    Hash,
    MoreHorizontal
} from 'lucide-react'
import quizService from '../../services/quizService'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import Button from '../../components/common/Button'

function QuizTakePage() {
    const { quizId } = useParams()
    const navigate = useNavigate()
    const [quiz, setQuiz] = useState(null)
    const [loading, setLoading] = useState(true)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState({})
    const [hasStarted, setHasStarted] = useState(false)
    const [timer, setTimer] = useState(0)
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await quizService.getQuizById(quizId)
                // The service returns response.data which contains the quiz object
                // If the backend returns data directly, adjust accordingly.
                // Based on quizService.js, it returns response.data
                const quizData = response.data || response;
                setQuiz(quizData)

                // Initialize timer if quiz has a time limit
                if (quizData.timeLimit) {
                    setTimer(quizData.timeLimit * 60)
                } else {
                    // Default to 15 minutes if no limit specified
                    setTimer(15 * 60)
                }
            } catch (error) {
                console.error('Error fetching quiz:', error)
                toast.error('Failed to load quiz')
            } finally {
                setLoading(false)
            }
        }

        fetchQuiz()
    }, [quizId])

    const submitQuiz = useCallback(async () => {
        if (isSubmitting) return
        setIsSubmitting(true)
        setIsTimerRunning(false)

        try {
            // Convert answers object to array in correct order
            const formattedAnswers = quiz.questions.map((_, index) => answers[index] || "")
            await quizService.submitQuiz(quizId, formattedAnswers)
            toast.success('Quiz submitted successfully!')
            navigate(`/quizzes/${quizId}/results`)
        } catch (error) {
            console.error('Error submitting quiz:', error)
            toast.error('Failed to submit quiz. Please try again.')
            setIsSubmitting(false)
            setIsTimerRunning(true) // Resume timer if it failed
        }
    }, [isSubmitting, quiz, answers, quizId, navigate])

    useEffect(() => {
        let interval
        if (isTimerRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000)
        } else if (timer === 0 && isTimerRunning) {
            submitQuiz()
        }
        return () => clearInterval(interval)
    }, [isTimerRunning, timer, submitQuiz])

    const handleAnswerChange = (answer) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion]: answer
        }))
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleStartQuiz = () => {
        setHasStarted(true)
        setIsTimerRunning(true)
    }

    const progress = quiz ? ((Object.keys(answers).length) / quiz.questions.length) * 100 : 0
    const currentProgress = quiz ? ((currentQuestion + 1) / quiz.questions.length) * 100 : 0

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
                <Spinner size="lg" className="relative z-10" />
            </div>
            <p className="mt-8 text-slate-500 font-semibold tracking-wide animate-pulse uppercase text-xs">
                Analyzing Quiz Content
            </p>
        </div>
    )

    if (!quiz) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-rose-100 shadow-xl shadow-rose-500/5">
                <AlertCircle size={48} className="text-rose-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3">Quiz Not Found</h2>
            <p className="text-slate-500 mb-10 max-w-md text-lg leading-relaxed">
                The evaluation you're looking for might have been expired, moved, or deleted.
            </p>
            <Button onClick={() => navigate(-1)} variant="outline" className="h-14 px-10 rounded-2xl">
                <ArrowLeft size={20} className="mr-2" />
                Go Back to Course
            </Button>
        </div>
    )

    // --- Start Screen ---
    if (!hasStarted) {
        return (
            <div className="max-w-4xl mx-auto py-10 sm:py-12 px-4 sm:px-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all mb-10 font-black uppercase tracking-[0.2em] text-xs group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Exit Evaluation
                </button>

                <div className="relative group">
                    {/* Decorative Elements */}
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-100/40 blur-3xl rounded-full -z-10 animate-blob" />
                    <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-teal-100/40 blur-3xl rounded-full -z-10 animate-blob animation-delay-2000" />

                    <div className="bg-white rounded-5xl border border-slate-200 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
                        <div className="p-10 md:p-16">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-10">
                                    <div className="absolute inset-0 bg-linear-to-br from-emerald-500 to-teal-500 blur-2xl opacity-20 scale-150 rotate-12" />
                                    <div className="relative w-24 h-24 bg-linear-to-br from-emerald-500 to-teal-500 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20 transform hover:rotate-3 transition-transform duration-500">
                                        <Trophy size={48} />
                                    </div>
                                </div>

                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
                                    {quiz.title}
                                </h1>
                                <p className="text-slate-500 text-xl mb-12 max-w-2xl leading-relaxed">
                                    Ready to demonstrate your mastery? This assessment features <b>{quiz.questions.length} questions</b> structured to evaluate your understanding of the material.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10 sm:mb-12">
                                    <div className="group bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 rounded-4xl p-8 border border-slate-100 flex flex-col items-center">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 border border-slate-100 text-emerald-500">
                                            <Timer size={24} />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Limit</p>
                                        <p className="text-2xl font-black text-slate-900">{quiz.timeLimit || 15} Mins</p>
                                    </div>

                                    <div className="group bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 rounded-4xl p-8 border border-slate-100 flex flex-col items-center">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 border border-slate-100 text-teal-500">
                                            <HelpCircle size={24} />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Items</p>
                                        <p className="text-2xl font-black text-slate-900">{quiz.questions.length} Qs</p>
                                    </div>

                                    <div className="group bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 rounded-4xl p-8 border border-slate-100 flex flex-col items-center">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 border border-slate-100 text-blue-500">
                                            <Award size={24} />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Difficulty</p>
                                        <p className="text-2xl font-black text-slate-900">{quiz.difficulty || 'Medium'}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-5 w-full justify-center">
                                    <Button
                                        onClick={handleStartQuiz}
                                        className="h-16 px-12 text-lg rounded-[1.25rem] shadow-2xl shadow-emerald-500/30 w-full sm:w-auto font-black"
                                    >
                                        Start Quiz
                                        <ChevronRight size={24} className="ml-2" />
                                    </Button>
                                </div>

                                <div className="mt-10 flex items-center gap-3 py-3 px-6 bg-amber-50 rounded-2xl text-amber-700 text-sm font-bold border border-amber-100/50">
                                    <AlertCircle size={18} className="text-amber-500" />
                                    <span>The countdown will begin as soon as you proceed.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const currentQ = quiz.questions[currentQuestion]
    const isLastQuestion = currentQuestion === quiz.questions.length - 1
    const isAnswered = answers[currentQuestion] !== undefined

    return (
        <div className="max-w-5xl mx-auto py-10 sm:py-12 px-4 sm:px-6 min-h-screen flex flex-col">
            {/* Nav & Info Overlay */}
            <div className="sticky top-4 sm:top-6 z-40 mb-8 sm:mb-10">
                <div className="bg-white/70 backdrop-blur-2xl border border-white/40 p-4 sm:p-5 md:p-7 rounded-4xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
                        <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex flex-col items-center justify-center text-white shadow-xl shadow-slate-900/20">
                            <span className="text-[10px] font-black opacity-50 uppercase tracking-widest text-emerald-400">ITEM</span>
                            <span className="text-2xl font-black tabular-nums">{currentQuestion + 1}</span>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.15em] line-clamp-1 mb-2">
                                {quiz.title}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                <div className="flex-1 w-full sm:w-48 h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                                    <div
                                        className="absolute inset-y-0 left-0 bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-700 ease-out rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                                        style={{ width: `${currentProgress}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                    Question {currentQuestion + 1} of {quiz.questions.length}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                        <div className="flex -space-x-1.5 overflow-hidden">
                            {/* Mini question map for quick navigation */}
                            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                                {quiz.questions.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentQuestion(idx)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentQuestion === idx ? 'w-8 bg-slate-900' :
                                            answers[idx] ? 'bg-emerald-500' : 'bg-slate-200 hover:bg-slate-300'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className={`flex items-center gap-3 px-5 py-3 sm:px-6 sm:py-4 rounded-3xl border-2 transition-all duration-500 ${timer < 60
                            ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-lg shadow-rose-200/50 scale-105 animate-pulse'
                            : 'bg-slate-50 border-slate-100 text-slate-900 shadow-sm'
                            }`}>
                            <Timer size={22} className={timer < 60 ? 'text-rose-500' : 'text-slate-400'} />
                            <span className="text-2xl font-black tabular-nums tracking-tight">
                                {formatTime(timer)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Question Content */}
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
                <div className="relative group/card">
                    {/* Floating accents */}
                    <div className="absolute -top-6 -left-6 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full" />
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-teal-500/10 blur-2xl rounded-full" />

                    <div className="bg-white rounded-[3rem] border border-slate-200 p-6 sm:p-8 md:p-14 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] relative overflow-hidden flex-1 min-h-[360px] sm:min-h-[500px] flex flex-col">
                        <div className="absolute top-0 right-0 p-10 sm:p-16 opacity-[0.03] pointer-events-none group-hover/card:scale-110 group-hover/card:rotate-6 transition-transform duration-700">
                            <Hash size={200} />
                        </div>

                        <div className="relative z-10 flex-1 flex flex-col">
                            <div className="mb-12">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        Multiple Choice
                                    </span>
                                    {isAnswered && (
                                        <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-2 animate-fade-in">
                                            <Check size={12} className="text-emerald-500" />
                                            Saved
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-[1.3] tracking-tight">
                                    {currentQ.question || currentQ.text}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4 flex-1 content-start">
                                {(currentQ.options || []).map((option, idx) => {
                                    const isSelected = answers[currentQuestion] === option;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswerChange(option)}
                                            className={`w-full group relative text-left p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[1.75rem] border-2 transition-all duration-300 flex items-center justify-between ${isSelected
                                                ? 'bg-emerald-50/50 border-emerald-500 shadow-[0_12px_24px_-8px_rgba(16,185,129,0.15)] ring-4 ring-emerald-500/5'
                                                : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/80'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4 sm:gap-6">
                                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-base sm:text-lg transition-all duration-300 ${isSelected
                                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 rotate-3'
                                                    : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'
                                                    }`}>
                                                    {String.fromCharCode(65 + idx)}
                                                </div>
                                                <span className={`font-bold text-base sm:text-lg md:text-xl transition-colors ${isSelected ? 'text-slate-900' : 'text-slate-600'
                                                    }`}>
                                                    {option}
                                                </span>
                                            </div>

                                            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${isSelected
                                                ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-lg shadow-emerald-500/20'
                                                : 'border-slate-100 bg-slate-50 opacity-0 group-hover:opacity-100 scale-90'
                                                }`}>
                                                {isSelected ? (
                                                    <CheckCircle2 size={24} className="text-white" />
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full bg-slate-200" />
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-12 flex items-center justify-between gap-6 pb-12">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestion === 0}
                        className="h-16 px-10 rounded-2xl group border-2 font-black bg-white!"
                    >
                        <ChevronLeft size={22} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Previous Question
                    </Button>

                    <div className="flex gap-5">
                        {!isLastQuestion ? (
                            <Button
                                onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                                disabled={!isAnswered}
                                className="h-16 px-12 rounded-2xl shadow-2xl shadow-emerald-500/20 group font-black"
                            >
                                Next Step
                                <ChevronRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setShowConfirmSubmit(true)}
                                className="h-16 px-12 rounded-2xl !bg-slate-900 !from-slate-900 !to-slate-900 shadow-2xl shadow-slate-900/40 text-white font-black hover:scale-[1.02] transition-transform"
                            >
                                Finalize & Submit
                                <Award size={22} className="ml-2 text-emerald-400" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmSubmit && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-6 sm:p-10">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowConfirmSubmit(false)} />

                    <div className="relative bg-white rounded-[3rem] shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-10 md:p-14 text-center">
                            <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-emerald-500">
                                <CheckCircle2 size={48} />
                            </div>

                            <h2 className="text-3xl font-black text-slate-900 mb-4">Complete Assessment?</h2>
                            <p className="text-slate-500 text-lg mb-10 leading-relaxed">
                                You've answered <b>{Object.keys(answers).length}</b> out of {quiz.questions.length} questions. Are you sure you're ready to submit your evaluation?
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowConfirmSubmit(false)}
                                    className="flex-1 h-16 rounded-[1.25rem] font-black border-2"
                                >
                                    Review Answers
                                </Button>
                                <Button
                                    onClick={submitQuiz}
                                    disabled={isSubmitting}
                                    className="flex-1 h-16 rounded-[1.25rem] font-black shadow-xl shadow-emerald-500/20"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Spinner size="sm" className="mr-2" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Yes, Finish Quiz"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default QuizTakePage

