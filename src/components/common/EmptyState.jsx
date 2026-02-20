import React from 'react'
import { FileText, Plus } from 'lucide-react'
import Button from './Button'

const EmptyState = ({
    icon: Icon = FileText,
    title,
    description,
    onActionClick,
    buttonText,
    className = ""
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in duration-500 ${className}`}>
            {/* Icon Container with Glow */}
            <div className="relative mb-10 group">
                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 group-hover:scale-175 transition-all duration-700" />
                <div className="relative flex items-center justify-center w-24 h-24 rounded-4xl bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-2xl shadow-emerald-500/30 ring-8 ring-white/50">
                    <Icon size={44} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-500" />
                </div>
            </div>

            {/* Content */}
            <div className="max-w-md mx-auto space-y-4">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    {title}
                </h3>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Action Button */}
            {buttonText && onActionClick && (
                <div className="mt-12">
                    <Button
                        onClick={onActionClick}
                        className="group px-8 py-7 rounded-2xl shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
                        <span className="text-lg font-bold tracking-tight">{buttonText}</span>
                    </Button>
                </div>
            )}
        </div>
    )
}

export default EmptyState