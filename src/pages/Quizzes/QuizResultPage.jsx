import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Trophy,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  RotateCcw,
  ChevronRight,
  Award,
  Clock,
  Target,
  BarChart3,
  AlertCircle,
  Hash,
  Download,
  Share2,
  Calendar
} from 'lucide-react'
import quizService from '../../services/quizService'
import Spinner from '../../components/common/Spinner'
import Button from '../../components/common/Button'
import toast from 'react-hot-toast'

function QuizResultPage() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await quizService.getQuizResults(quizId)
        // The service returns the JSON body: { success: true, data: { quiz, results } }
        setResults(response.data || response)
      } catch (error) {
        console.error('Error fetching results:', error)
        toast.error('Failed to load results')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [quizId])

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
        <Spinner size="lg" className="relative z-10" />
      </div>
      <p className="mt-8 text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">
        Calculating Score
      </p>
    </div>
  )

  if (!results) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-6">
        <AlertCircle size={40} className="text-rose-500" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-2">Results Not Found</h2>
      <p className="text-slate-500 mb-8 max-w-md">We couldn't retrieve your score for this assessment. It might not be completed yet.</p>
      <Button onClick={() => navigate('/dashboard')} variant="outline" className="rounded-2xl border-2 font-black">
        Back to Dashboard
      </Button>
    </div>
  )

  const quizInfo = results.quiz || {}
  const detailedResults = results.results || []

  const percentage = quizInfo.score || 0
  const totalQuestions = quizInfo.totalQuestions || 0
  const correctCount = detailedResults.filter(r => r.isCorrect).length
  const isPassed = percentage >= 70

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDownload = () => {
    toast.success('Preparing your report...')
    // Implementation for PDF export would go here
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  return (
    <div className="max-w-6xl mx-auto py-10 sm:py-12 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
        <div className="flex-1">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-4 font-black uppercase tracking-widest text-[10px] group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Return to Materials
          </button>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
              {quizInfo.document?.title || 'Assessment'}
            </span>
            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${isPassed ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
              {isPassed ? 'Passed' : 'Needs Review'}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {quizInfo.title}
          </h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={handleDownload}
            className="h-12 w-12 p-0 rounded-2xl border-2"
            title="Download Report"
          >
            <Download size={20} />
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="h-12 w-12 p-0 rounded-2xl border-2"
            title="Share Results"
          >
            <Share2 size={20} />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/quizzes/${quizId}`)}
            className="h-12 px-6 rounded-2xl font-black border-2"
          >
            <RotateCcw size={18} className="mr-2" />
            Retake
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            className="h-12 px-8 rounded-2xl font-black shadow-lg shadow-emerald-500/20"
          >
            Continue Learning
            <ChevronRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>

      {/* Hero Score Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-12 sm:mb-16">
        {/* Main Score Display */}
        <div className="lg:col-span-8 relative group">
          <div className={`absolute inset-0 bg-linear-to-br transition-all duration-700 blur-3xl opacity-10 group-hover:opacity-20 -z-10 ${isPassed ? 'from-emerald-500 to-teal-500' : 'from-rose-500 to-orange-500'
            }`} />

          <div className="bg-white rounded-[3rem] border border-slate-200 p-6 sm:p-8 md:p-14 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] h-full flex flex-col md:flex-row items-center gap-8 md:gap-10 overflow-hidden relative">
            <div className="relative shrink-0">
              <div className={`w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-[2.5rem] sm:rounded-[3rem] flex flex-col items-center justify-center shadow-2xl relative overflow-hidden transform group-hover:scale-105 transition-transform duration-500 ${isPassed
                ? 'bg-linear-to-br from-emerald-500 to-teal-500 shadow-emerald-500/30'
                : 'bg-linear-to-br from-rose-500 to-orange-500 shadow-rose-500/30'
                }`}>
                <span className="text-xs font-black text-white/70 uppercase tracking-widest mb-1">SCORE</span>
                <span className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-none">{percentage}%</span>
                <div className="absolute bottom-0 inset-x-0 h-2 bg-black/10">
                  <div
                    className="h-full bg-white/40 transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              {isPassed && (
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-amber-400 rounded-2xl shadow-xl flex items-center justify-center text-white rotate-12 animate-bounce">
                  <Trophy size={24} />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 mb-6 font-black text-[10px] uppercase tracking-widest text-slate-500">
                <Calendar size={14} className="text-slate-400" />
                Completed on {formatDate(quizInfo.completedAt)}
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                {isPassed ? 'Outstanding Achievement!' : 'Solid Effort! Keep Improving'}
              </h2>
              <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
                {isPassed
                  ? `Incredible performance! You've successfully answered ${correctCount} out of ${totalQuestions} questions correctly, demonstrating a mastery of the core concepts.`
                  : "You're making progress. Review the detailed analysis below to identify areas where your understanding can be further strengthened."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-slate-900/20 relative overflow-hidden group flex-1 flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Target size={64} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-2">Accuracy Rate</p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl sm:text-5xl font-black">{correctCount}</span>
              <span className="text-xl sm:text-2xl font-bold opacity-40">/ {totalQuestions}</span>
            </div>
            <p className="text-slate-400 text-xs font-bold">Total Correct Responses</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 sm:p-8 shadow-sm flex items-center gap-6 group hover:border-blue-200 transition-colors">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <BarChart3 size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Performance</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900">
                {percentage >= 90 ? 'Mastery' : percentage >= 70 ? 'Proficient' : 'Developing'}
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 sm:p-8 shadow-sm flex items-center gap-6 group hover:border-amber-200 transition-colors">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Clock size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pace</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900">Moderate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Review Section */}
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-100 pb-6 sm:pb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-400 shadow-lg shadow-slate-900/10">
              <Hash size={24} />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">In-depth Review</h3>
              <p className="text-slate-500 text-sm font-bold">Comprehensive breakdown of your responses</p>
            </div>
          </div>
          <div className="hidden md:flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Correct: {correctCount}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-100">
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
              Incorrect: {totalQuestions - correctCount}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {(detailedResults || []).map((q, idx) => {
            const isCorrect = q.isCorrect;
            return (
              <div key={idx} className={`bg-white rounded-[3rem] border-2 transition-all duration-500 overflow-hidden group/item ${isCorrect
                ? 'border-emerald-100 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/5'
                : 'border-rose-100 hover:border-rose-200 hover:shadow-2xl hover:shadow-rose-500/5'
                }`}>
                <div className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-10">
                    <div className="flex items-start gap-6">
                      <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm ${isCorrect
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-rose-50 text-rose-600'
                        }`}>
                        {idx + 1}
                      </div>
                      <h4 className="text-xl md:text-2xl font-black text-slate-900 leading-tight pt-2">
                        {q.question}
                      </h4>
                    </div>
                    <div className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border ${isCorrect
                      ? 'bg-emerald-50/50 text-emerald-600 border-emerald-100'
                      : 'bg-rose-50/50 text-rose-600 border-rose-100'
                      }`}>
                      {isCorrect ? (
                        <><CheckCircle2 size={16} /> CORRECT RESPONSE</>
                      ) : (
                        <><XCircle size={16} /> REVIEW REQUIRED</>
                      )}
                    </div>
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    {(q.options || []).map((option, optIdx) => {
                      const isSelected = q.selectedAnswer === option;
                      const isCorrectOpt = q.correctAnswer === option;

                      let variantClasses = "bg-white border-slate-100 text-slate-500";
                      if (isSelected && isCorrectOpt) variantClasses = "bg-emerald-50 border-emerald-200 text-emerald-700 ring-2 ring-emerald-500/10";
                      else if (isSelected && !isCorrectOpt) variantClasses = "bg-rose-50 border-rose-200 text-rose-700 ring-2 ring-rose-500/10";
                      else if (!isSelected && isCorrectOpt) variantClasses = "bg-emerald-50/30 border-emerald-100 text-emerald-600/70 border-dashed";

                      return (
                        <div
                          key={optIdx}
                          className={`p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${variantClasses}`}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-black opacity-40">{String.fromCharCode(65 + optIdx)}</span>
                            <span className="font-bold">{option}</span>
                          </div>
                          {isSelected && (
                            isCorrectOpt ? <CheckCircle2 size={18} className="text-emerald-500" /> : <XCircle size={18} className="text-rose-500" />
                          )}
                          {!isSelected && isCorrectOpt && <CheckCircle2 size={18} className="text-emerald-300" />}
                        </div>
                      )
                    })}
                  </div>

                  {q.explanation && (
                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 relative overflow-hidden transition-all duration-500 group-hover/item:bg-white group-hover/item:border-slate-200">
                      <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none group-hover/item:scale-110 transition-transform duration-500">
                        <Award size={80} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <AlertCircle size={14} className="text-slate-400" />
                        Expert Explanation
                      </p>
                      <p className="text-slate-600 font-bold text-lg leading-relaxed relative z-10">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default QuizResultPage
