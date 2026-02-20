import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Home, Sparkles } from 'lucide-react'

function NotFoundPage() {
  return (
    <div className="relative">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 -z-10" />

      <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          <Sparkles size={14} />
          Looks like a detour
        </div>

        <div className="mt-10 flex flex-col items-center gap-6 rounded-3xl border border-slate-200/80 bg-white/90 p-10 shadow-xl shadow-slate-200/40 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/25">
              404
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-semibold text-slate-900">This page went missing</h1>
              <p className="mt-1 text-sm text-slate-500">But your learning journey doesn&apos;t have to.</p>
            </div>
          </div>

          <p className="max-w-xl text-base font-medium text-slate-500">
            The link might be outdated or the page has moved. Use the quick actions below to keep exploring KnoEra.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <Home size={18} />
              Back to Dashboard
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
              Go Home
            </Link>
          </div>
        </div>

        <div className="mt-8 w-full max-w-3xl rounded-3xl border border-slate-200/70 bg-white p-6 text-left shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Quick detours</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Explore Flashcards', href: '/flashcards' },
              { label: 'Jump to Quizzes', href: '/quizzes' },
              { label: 'Open Documents', href: '/documents' },
              { label: 'Ask the AI Tutor', href: '/ask' },
            ].map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="group flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-emerald-400/50 hover:bg-emerald-50"
              >
                {item.label}
                <span className="text-emerald-500 transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage