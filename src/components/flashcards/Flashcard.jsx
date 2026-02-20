import React, { useState } from "react"
import { Star, RotateCw } from "lucide-react"

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      data-flashcard
      className="w-full min-h-[420px] flex items-center justify-center perspective-[1200px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full max-w-3xl h-[420px]
        transition-transform duration-700 ease-[cubic-bezier(.4,.2,.2,1)]
        [transform-style:preserve-3d]
        ${isFlipped ? "rotate-y-180 scale-[1.02]" : ""}`}
      >
        {/* ================= FRONT ================= */}
        <div
          className="absolute inset-0 rounded-3xl bg-white border border-slate-200
          shadow-xl shadow-slate-200/60 p-10 sm:p-14
          flex flex-col items-center justify-center text-center
          [backface-visibility:hidden]"
        >
          {/* Glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-100/40 rounded-full blur-3xl" />

          <span className="relative z-10 mb-6 px-5 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black tracking-wider">
            QUESTION
          </span>

          <h3 className="relative z-10 text-2xl sm:text-3xl font-black text-slate-800 leading-snug max-w-2xl">
            {flashcard.question}
          </h3>

          {/* Footer */}
          <div className="absolute bottom-6 inset-x-8 flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <RotateCw size={14} />
              Tap to reveal
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleStar()
              }}
              className="p-2 hover:text-amber-400 hover:scale-110 transition"
            >
              <Star
                size={24}
                fill={flashcard.isStarred ? "currentColor" : "none"}
                className={flashcard.isStarred ? "text-amber-400" : ""}
              />
            </button>
          </div>
        </div>

        {/* ================= BACK ================= */}
        <div
          className="absolute inset-0 rounded-3xl
          bg-gradient-to-br from-slate-800 to-slate-950
          shadow-2xl shadow-black/40 p-10 sm:p-14
          flex flex-col items-center justify-center text-center text-white
          rotate-y-180
          [backface-visibility:hidden]"
        >
          {/* Accent bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />

          <span className="mb-6 px-5 py-1.5 rounded-full bg-white/10 text-emerald-300 text-xs font-black tracking-wider backdrop-blur">
            ANSWER
          </span>

          <p className="text-lg sm:text-2xl font-medium leading-relaxed max-w-2xl text-slate-100">
            {flashcard.answer}
          </p>

          {/* Footer */}
          <div className="absolute bottom-6 inset-x-8 flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <RotateCw size={14} />
              Tap to flip back
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleStar()
              }}
              className="p-2 hover:text-amber-400 hover:scale-110 transition"
            >
              <Star
                size={24}
                fill={flashcard.isStarred ? "currentColor" : "none"}
                className={flashcard.isStarred ? "text-amber-400" : ""}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Flashcard
