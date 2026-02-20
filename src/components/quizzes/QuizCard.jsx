import React from 'react'
import { HelpCircle, Trash2, Calendar, ChevronRight, BarChart3, ListChecks, Brain, CheckCircle2 } from 'lucide-react'
import moment from 'moment'
import Button from '../common/Button'

const QuizCard = ({ quiz, onDelete, onViewResults, onStartQuiz }) => {
  const isCompleted = quiz.score !== undefined || quiz.completedAt;

  return (
    <div
      className="group relative bg-white border-2 border-slate-100 rounded-[2rem] p-8 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full"
    >
      {/* Dynamic Background Glow */}
      <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl transition-colors duration-500 ${isCompleted ? 'bg-emerald-100/40' : 'bg-amber-100/40'}`} />

      {/* Delete Action (Top Right) */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(quiz._id || quiz.id)
        }}
        className="absolute top-6 right-6 p-2.5 bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm z-20"
        title="Delete Quiz"
      >
        <Trash2 size={18} strokeWidth={2.5} />
      </button>

      {/* Card Header */}
      <div className="relative z-10 flex items-start justify-between mb-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${isCompleted ? 'bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-emerald-500/20' : 'bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/20'
          }`}>
          <HelpCircle size={28} strokeWidth={2.5} />
        </div>

        {isCompleted && (
          <div className="px-4 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
            Completed
          </div>
        )}
      </div>

      {/* Title & Date */}
      <div className="relative z-10 mb-8 flex-1">
        <h4 className="text-xl font-black text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors">
          {quiz.title || "Untitled AI Quiz"}
        </h4>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Calendar size={14} className="text-slate-300" />
          <span>{moment(quiz.createdAt).format("DD MMM YYYY")}</span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100/50">
          <div className="flex items-center gap-2 mb-1">
            <ListChecks size={14} className="text-slate-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Questions</span>
          </div>
          <span className="text-lg font-black text-slate-800">{quiz.totalQuestions || 0}</span>
        </div>

        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100/50">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={14} className="text-slate-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</span>
          </div>
          <span className={`text-lg font-black ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
            {isCompleted ? `${quiz.score}%` : '--'}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="relative z-10 mt-auto pt-6 border-t border-slate-100 flex gap-3">
        {isCompleted ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onViewResults(quiz._id || quiz.id);
            }}
            variant="outline"
            className="flex-1 rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest gap-2 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 group/btn border-2"
          >
            <CheckCircle2 size={16} className="text-emerald-500" />
            View Results
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onStartQuiz(quiz._id || quiz.id);
            }}
            className="flex-1 rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest gap-2 group/btn shadow-lg shadow-emerald-500/20"
          >
            <Brain size={16} className="text-white/80" />
            Start Quiz
            <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default QuizCard