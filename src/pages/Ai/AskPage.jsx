import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { MessageSquare, Bot, Sparkles, Send, FileText, ChevronDown, Search } from 'lucide-react'
import documentService from '../../services/documentService'
import Chatinterface from '../../components/chat/Chatinterface'
import Spinner from '../../components/common/Spinner'

const AskPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const docIdInUrl = searchParams.get('docId')

    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedDocId, setSelectedDocId] = useState(docIdInUrl || '')
    const [isDocSelectorOpen, setIsDocSelectorOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                setLoading(true)
                const data = await documentService.getDocuments()
                setDocuments(data || [])
            } catch (error) {
                console.error("Failed to fetch documents", error)
            } finally {
                setLoading(false)
            }
        }
        fetchDocs()
    }, [])

    const selectedDoc = documents.find(d => d._id === selectedDocId)

    const filteredDocs = documents.filter(d =>
        d.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSelectDoc = (id) => {
        setSelectedDocId(id)
        setSearchParams({ docId: id })
        setIsDocSelectorOpen(false)
    }

    if (loading && documents.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Spinner size="lg" />
                <p className="mt-4 text-slate-500 font-bold animate-pulse">Initializing AI Assistant...</p>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[calc(100vh-100px)] flex flex-col">
            {/* Header / Selector Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6 sm:mb-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                            <Bot size={24} />
                        </div>
                        Answer the User
                    </h1>
                    <p className="text-slate-500 font-medium">Get instant answers and insights from your documents</p>
                </div>

                {/* Document Selector */}
                <div className="relative">
                    <button
                        onClick={() => setIsDocSelectorOpen(!isDocSelectorOpen)}
                        className="flex items-center gap-3 px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl hover:border-emerald-500/30 transition-all shadow-sm group w-full md:w-64"
                    >
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                            <FileText size={18} />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Target Document</p>
                            <p className="text-sm font-bold text-slate-700 truncate">
                                {selectedDoc ? selectedDoc.title : 'Select a document'}
                            </p>
                        </div>
                        <ChevronDown size={18} className={`text-slate-400 transition-transform ${isDocSelectorOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDocSelectorOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsDocSelectorOpen(false)} />
                            <div className="absolute top-full mt-2 right-0 w-80 bg-white border border-slate-100 rounded-3xl shadow-2xl z-50 overflow-hidden animate-fade-in-down">
                                <div className="p-4 border-b border-slate-50">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search your library..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                                        />
                                    </div>
                                </div>
                                <div className="max-h-64 overflow-y-auto p-2">
                                    {filteredDocs.length > 0 ? (
                                        filteredDocs.map((doc) => (
                                            <button
                                                key={doc._id}
                                                onClick={() => handleSelectDoc(doc._id)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${selectedDocId === doc._id
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'hover:bg-slate-50 text-slate-600'
                                                    }`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedDocId === doc._id ? 'bg-white text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                                                    <FileText size={16} />
                                                </div>
                                                <span className="text-sm font-bold truncate">{doc.title}</span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center">
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No matching docs</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 min-h-0">
                {selectedDocId ? (
                    <div className="h-full animate-fade-in-down" key={selectedDocId}>
                        <Chatinterface documentId={selectedDocId} />
                    </div>
                ) : (
                    <div className="h-full bg-white border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center group">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 text-slate-200 group-hover:bg-emerald-50 group-hover:text-emerald-200 transition-colors duration-500">
                            <MessageSquare size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Ready to Start Answering?</h3>
                        <p className="text-slate-500 max-w-sm font-medium leading-relaxed">
                            Pick a document from your library above to contextually chat with our AI regarding its contents.
                        </p>

                        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                            <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 text-left">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-500 shadow-sm mb-3">
                                    <Sparkles size={16} />
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 mb-1">Contextual Insights</h4>
                                <p className="text-[11px] text-slate-500 font-medium">AI answers directly from your study materials.</p>
                            </div>
                            <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 text-left">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-500 shadow-sm mb-3">
                                    <FileText size={16} />
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 mb-1">Key References</h4>
                                <p className="text-[11px] text-slate-500 font-medium">Find specific information within your PDFs instantly.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AskPage
