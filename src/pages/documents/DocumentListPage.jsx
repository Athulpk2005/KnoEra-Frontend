import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Upload,
  FileText,
  Trash2,
  X,
  Search,
  LayoutGrid,
  List,
  MoreVertical,
  Download,
  Eye,
  Clock,
  Filter,
  ArrowUpDown,
  File,
  Loader2,
  Brain,
  HelpCircle,
  Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'
import documentService from '../../services/documentService'
import Spinner from '../../components/common/Spinner'
import Button from '../../components/common/Button'

const DocumentListPage = () => {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  // State for Upload Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadTitle, setUploadTitle] = useState("")

  // State for Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState(null)

  // State for Quick View Modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewingDoc, setViewingDoc] = useState(null)

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const data = await documentService.getDocuments()
      setDocuments(data || [])
    } catch (error) {
      toast.error('Failed to fetch documents')
      console.log(error)
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadFile(file)
      // Set default title to filename without extension
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""))
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!uploadFile || !uploadTitle) {
      toast.error('Please select a file and provide a title')
      return;
    }
    setUploading(true)
    const formData = new FormData()
    formData.append('file', uploadFile)
    formData.append('title', uploadTitle)
    try {
      await documentService.uploadDocument(formData)
      toast.success('Document uploaded successfully')
      setIsUploadModalOpen(false)
      setUploadFile(null)
      setUploadTitle("")
      fetchDocuments()
    } catch (error) {
      toast.error(error.error || error.message || 'Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc)
    setIsDeleteModalOpen(true)
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;
    setDeleting(true)
    try {
      await documentService.deleteDocument(selectedDoc._id)
      toast.success('Document deleted successfully')
      setIsDeleteModalOpen(false)
      setSelectedDoc(null)
      setDocuments(documents.filter((d) => d._id !== selectedDoc._id))
    } catch (error) {
      toast.error(error.message || 'Failed to delete document')
    } finally {
      setDeleting(false)
    }
  }

  const filteredDocuments = useMemo(() => {
    let filtered = documents.filter(doc =>
      doc.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    }

    return filtered
  }, [documents, searchQuery, sortBy])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (filename) => {
    const ext = filename?.split('.').pop().toLowerCase()
    if (['pdf'].includes(ext)) return <FileText className="text-red-500" />
    if (['doc', 'docx'].includes(ext)) return <FileText className="text-blue-500" />
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return <FileText className="text-emerald-500" />
    if (['ppt', 'pptx'].includes(ext)) return <FileText className="text-orange-500" />
    if (['xls', 'xlsx'].includes(ext)) return <FileText className="text-green-600" />
    return <FileText className="text-slate-400" />
  }

  const handleDownload = (doc) => {
    if (!doc.fileUrl) {
      toast.error('File URL not found')
      return
    }
    window.open(doc.fileUrl, '_blank')
  }

  const handleView = (doc) => {
    navigate(`/documents/${doc._id}`)
  }

  const handleQuickView = (doc) => {
    setViewingDoc(doc)
    setIsViewModalOpen(true)
  }

  const getpdfUrl = (doc) => {
    if (!doc) return null
    if (doc.fileUrl) return doc.fileUrl

    let filePath = doc.filePath || ''
    filePath = filePath.replace(/\\/g, '/')

    // If it's an absolute path containing '/uploads/', extract the relative portion
    if (filePath.includes('/uploads/')) {
      const parts = filePath.split('/uploads/')
      const relativePath = '/uploads/' + parts[parts.length - 1]
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      return `${baseUrl}${relativePath}`
    }

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    const sanitizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`
    return `${baseUrl}${sanitizedPath}`
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Spinner size="lg" />
          <p className="mt-4 text-slate-500 animate-pulse">Loading your documents...</p>
        </div>
      )
    }

    if (documents.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12">
          <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
            <Upload className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No documents yet</h3>
          <p className="text-slate-500 text-center max-w-sm mb-8">
            Upload your first document to start organizing your study materials and generating flashcards.
          </p>
          <Button onClick={() => setIsUploadModalOpen(true)} className="px-8">
            <Plus className="w-5 h-5" />
            Upload Document
          </Button>
        </div>
      )
    }

    if (filteredDocuments.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Search className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500">No documents match your search.</p>
        </div>
      )
    }

    return (
      <div className={viewMode === 'grid'
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        : "flex flex-col gap-3"
      }>
        {filteredDocuments.map((doc) => (
          <div
            key={doc._id}
            onClick={() => handleView(doc)}
            className={`group relative bg-white border border-slate-200 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 cursor-pointer ${viewMode === 'grid'
              ? "rounded-2xl p-5 flex flex-col"
              : "rounded-xl p-4 flex items-center"
              }`}
          >
            {/* File Icon */}
            <div className={`flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-white transition-colors ${viewMode === 'grid' ? "w-12 h-12 mb-4" : "w-10 h-10 mr-4 shrink-0"
              }`}>
              {getFileIcon(doc.fileUrl || doc.title)}
            </div>

            <div className={viewMode === 'list' ? "flex-1 min-w-0 mr-4" : ""}>
              <h4 className="font-bold text-slate-900 truncate group-hover:text-primary transition-colors" title={doc.title}>
                {doc.title}
              </h4>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(doc.createdAt)}
                </span>
                {doc.fileSize && (
                  <>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span>{formatFileSize(doc.fileSize)}</span>
                  </>
                )}
              </div>

              {/* Study Aids Badges */}
              <div className="flex items-center gap-2 mt-3">
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-300 border ${doc.flashcardCount > 0
                  ? "bg-orange-50 text-orange-600 border-orange-100 shadow-sm shadow-orange-100"
                  : "bg-slate-50 text-slate-400 border-slate-100"}`}
                >
                  <Brain className={`w-3 h-3 ${doc.flashcardCount > 0 ? "animate-pulse" : ""}`} />
                  <span>{doc.flashcardCount || 0} Flashcards</span>
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-300 border ${doc.quizCount > 0
                  ? "bg-blue-50 text-blue-600 border-blue-100 shadow-sm shadow-blue-100"
                  : "bg-slate-50 text-slate-400 border-slate-100"}`}
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>{doc.quizCount || 0} Quizzes</span>
                </div>
              </div>
            </div>

            <div
              className={`flex items-center gap-2 ${viewMode === 'grid' ? "mt-6 pt-4 border-t border-slate-50" : "ml-auto"
                }`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleView(doc);
                }}
                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                title="Analyze with AI"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickView(doc);
                }}
                className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(doc);
                }}
                className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRequest(doc);
                }}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3 uppercase tracking-wider">
              <File className="w-3 h-3" />
              Personal Library
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
              My Documents
            </h1>
            <p className="text-slate-500 max-w-md">
              Your central hub for all learning materials. Upload PDFs, notes, and handouts to generate smart study aids.
            </p>
          </div>
          <Button onClick={() => setIsUploadModalOpen(true)} className="shadow-orange-200 w-full sm:w-auto">
            <Plus className="w-5 h-5" strokeWidth={3} />
            <span>Upload New Document</span>
          </Button>
        </div>

        {/* Stats Bar (Optional but looks premium) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {[
            { label: 'Total Documents', value: documents.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Recently Added', value: documents.filter(d => new Date(d.createdAt) > new Date(Date.now() - 86400000 * 7)).length, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'Available Storage', value: '2.4 GB', icon: LayoutGrid, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Actions Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            <div className="flex bg-white border border-slate-200 p-1 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? "bg-slate-100 text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? "bg-slate-100 text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-11 w-full sm:w-auto pl-4 pr-10 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/10 appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Content Area */}
        {renderContent()}

        {/* --- MODALS --- */}

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !uploading && setIsUploadModalOpen(false)} />
            <div className="relative bg-white w-full max-w-lg rounded-4xl shadow-2xl overflow-hidden animate-fade-in-down">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-900">Upload Document</h2>
                  <button
                    onClick={() => setIsUploadModalOpen(false)}
                    disabled={uploading}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
                  >
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                  {/* File Drop Zone */}
                  {!uploadFile ? (
                    <div className="relative group">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        accept=".pdf"
                      />
                      <div className="h-48 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-slate-900">Click or drag to upload</p>
                          <p className="text-xs text-slate-400 mt-1">PDF files up to 10MB</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">{uploadFile.name}</p>
                        <p className="text-xs text-slate-400">{formatFileSize(uploadFile.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadFile(null)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Title Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Document Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Physics Chapter 4, Biology Notes..."
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={uploading || !uploadFile || !uploadTitle}
                      className="w-full h-14 text-lg"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <span>Start Upload</span>
                      )}
                    </Button>
                    <button
                      type="button"
                      onClick={() => setIsUploadModalOpen(false)}
                      disabled={uploading}
                      className="h-10 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Maybe Later
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !deleting && setIsDeleteModalOpen(false)} />
            <div className="relative bg-white w-full max-w-sm rounded-4xl shadow-2xl overflow-hidden p-8 animate-fade-in-down">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-slate-900 text-center mb-2">Delete Document?</h2>
              <p className="text-slate-500 text-center text-sm mb-8">
                Are you sure you want to delete <span className="font-bold text-slate-700">"{selectedDoc?.title}"</span>? This action cannot be undone and all associated flashcards will be lost.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-red-200"
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Yes, Delete Document'
                  )}
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={deleting}
                  className="w-full h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Quick View Modal */}
        {isViewModalOpen && viewingDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setIsViewModalOpen(false)}
            />
            <div className="relative bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale-up">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                    {getFileIcon(viewingDoc.fileUrl || viewingDoc.title)}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 truncate max-w-md">
                      {viewingDoc.title}
                    </h2>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      {formatFileSize(viewingDoc.fileSize)} • Added {formatDate(viewingDoc.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(viewingDoc)}
                    className="hidden sm:flex"
                  >
                    Open Details
                  </Button>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Viewer Area */}
              <div className="flex-1 bg-slate-100 p-4">
                <iframe
                  src={getpdfUrl(viewingDoc)}
                  className="w-full h-full bg-white rounded-2xl shadow-inner border-none"
                  title="PDF Preview"
                />
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-400 font-medium">
                  Use the browser controls within the viewer to zoom or print.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(viewingDoc)}
                    className="px-4 py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentListPage
