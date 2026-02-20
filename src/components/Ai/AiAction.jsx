import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Sparkles, BookOpen, Lightbulb, ArrowRight, Loader2 } from 'lucide-react'
import aiService from '../../services/aiService'
import toast from 'react-hot-toast'
import Modal from '../../components/common/Modal'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const AiAction = () => {

    const { id: documentId } = useParams();
    const [loadingAction, setLoadingAction] = useState(null);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [modelContent, setModelContent] = useState("");
    const [modelTitle, setModelTitle] = useState("");
    const [concept, setConcept] = useState("");

    const handleGenerateSummary = async () => {
        setLoadingAction("summary");
        try {
            const { summary } = await aiService.generateSummary(documentId);
            setModelTitle("Document Summary");
            setModelContent(summary);
            setIsModelOpen(true);
        } catch (error) {
            toast.error(error.message || 'Failed to generate summary');
        } finally {
            setLoadingAction(null);
        }
    }

    const handleExplainConcept = async (e) => {
        e.preventDefault();
        if (!concept.trim()) {
            toast.error("Please enter a concept");
            return;
        }
        setLoadingAction("explain");
        try {
            const { explanation } = await aiService.explainConcept(documentId, concept);
            setModelTitle(`Explanation: ${concept}`);
            setModelContent(explanation);
            setIsModelOpen(true);
            setConcept("");
        } catch (error) {
            toast.error(error.message || 'Failed to explain concept');
        } finally {
            setLoadingAction(null);
        }
    }

    return (
        <div className="relative min-h-[calc(100vh-80px)]">
            {/* Background decoration */}
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 -z-10" />

            <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                {/* Header */}
                <div className="text-center space-y-4 mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-xs font-semibold uppercase tracking-wider">
                        <Sparkles size={14} />
                        <span>AI Assistant</span>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                        Unlock Knowledge with AI
                    </h1>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        Instantly summarize your documents or get deep explanations for complex concepts.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Summary Card */}
                    <div className="group relative bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
                        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <BookOpen className="w-7 h-7 text-purple-600" />
                        </div>

                        <h2 className="text-xl font-bold text-slate-900 mb-3">Generate Summary</h2>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            Get a concise, comprehensive overview of your document's key points in seconds.
                        </p>

                        <button
                            onClick={handleGenerateSummary}
                            disabled={loadingAction === "summary"}
                            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 group-hover:shadow-lg shadow-emerald-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loadingAction === "summary" ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    <span>Summarize Document</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Explain Concept Card */}
                    <div className="group relative bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
                        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-400 via-teal-500 to-emerald-600 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Lightbulb className="w-7 h-7 text-emerald-600" />
                        </div>

                        <h2 className="text-xl font-bold text-slate-900 mb-3">Explain a Concept</h2>
                        <p className="text-slate-500 mb-6 leading-relaxed">
                            Confused about something? Ask AI to explain specific topics or terms from the document.
                        </p>

                        <form onSubmit={handleExplainConcept} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    value={concept}
                                    onChange={(e) => setConcept(e.target.value)}
                                    placeholder="e.g., 'What is machine learning?'"
                                    className="w-full px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loadingAction === "explain" || !concept.trim()}
                                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/25"
                            >
                                {loadingAction === "explain" ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Explaining...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Explain Concept</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModelOpen}
                onClose={() => setIsModelOpen(false)}
                title={modelTitle}
            >
                <div className="p-4 max-h-[70vh] overflow-y-auto max-w-none">
                    <div className="markdown-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {modelContent}
                        </ReactMarkdown>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default AiAction