import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Spinner from '../../components/common/Spinner'
import progressService from '../../services/progressService'
import toast from 'react-hot-toast'
import { FileText, BookOpen, BrainCircuit, TrendingUp, Clock, Trash2 } from 'lucide-react'

const DashboardPage = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData();
        console.log("Dashboard Data", data);
        setDashboardData(data.data);
      } catch (error) {
        toast.error('Failed to fetch dashboard data');
        console.log("Dashboard Data Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();

    // Check for new user prompt
    const isNewUser = localStorage.getItem('is_new_user');
    const existingApiKey = localStorage.getItem('gemini_api_key');

    if (isNewUser === 'true' && !existingApiKey) {
      toast('Welcome! Start by adding your Gemini API key in Profile settings to unlock AI features.', {
        icon: '🚀',
        duration: 6000,
        position: 'top-center',
      });
      localStorage.removeItem('is_new_user');
    }
  }, []);

  const handleClearActivity = async () => {
    try {
      await progressService.clearActivity();
      toast.success('Activity cleared');
      // Refresh dashboard data
      const data = await progressService.getDashboardData();
      setDashboardData(data.data);
    } catch (error) {
      toast.error('Failed to clear activity');
    }
  }

  if (loading) {
    return <Spinner />
  }

  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-slate-200 to-slate-100 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex flex-col items-center bg-white border border-slate-200 px-8 py-10 rounded-2xl shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
              <TrendingUp className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-slate-900 font-medium mb-1">No Activity Yet</h3>
            <p className="text-slate-500 text-sm text-center max-w-[200px]">Your learning dashboard will appear here once you start studying.</p>
          </div>
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: 'Total Courses',
      value: dashboardData.overview.totalDocuments,
      icon: FileText,
      gradient: 'from-blue-400 to-cyan-500',
      shadowColor: 'shadow-blue-500/25'
    },
    {
      label: 'Flashcard Sets',
      value: dashboardData.overview.totalFlashcardSets,
      icon: BookOpen,
      gradient: 'from-purple-400 to-pink-500',
      shadowColor: 'shadow-purple-500/25'
    },
    {
      label: 'Total Quizzes',
      value: dashboardData.overview.totalQuizzes,
      icon: BrainCircuit,
      gradient: 'from-emerald-400 to-teal-500',
      shadowColor: 'shadow-emerald-500/25'
    },
  ]
  return (
    <div className="relative px-4 sm:px-0">

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 -z-10" />

      <div className="relative max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">Dashboard</h1>

            <p className="text-slate-500 mt-1">Track your learning progress and recent activity</p>
          </div>

        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="group relative bg-white border border-slate-200/60 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg ${stat.shadowColor} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} strokeWidth={2} />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                <span className="text-slate-400 text-sm font-medium">total</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Recent Activity</h3>
            </div>
            {(dashboardData.recentActivity?.documents?.length > 0 || dashboardData.recentActivity?.quizzes?.length > 0 || dashboardData.recentActivity?.flashcardSets?.length > 0) && (
              <button
                onClick={handleClearActivity}
                className="flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors text-xs font-bold uppercase tracking-wider"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {dashboardData.recentActivity && (dashboardData.recentActivity.documents.length > 0 || dashboardData.recentActivity.quizzes.length > 0 || dashboardData.recentActivity.flashcardSets?.length > 0) ? (
            <div className="space-y-4">
              {[
                ...(dashboardData.recentActivity.documents || []).map(doc => ({
                  id: doc._id,
                  description: doc.title,
                  timestamp: doc.createdAt,
                  link: `/documents/${doc._id}`,
                  type: 'document'
                })),
                ...(dashboardData.recentActivity.quizzes || []).map(quiz => ({
                  id: quiz._id,
                  description: quiz.title,
                  timestamp: quiz.completedAt,
                  link: `/quizzes/${quiz._id}`,
                  type: 'quiz'
                })),
                ...(dashboardData.recentActivity.flashcardSets || []).map(flashcardSet => ({
                  id: flashcardSet._id,
                  description: `${flashcardSet.cards?.length || 0} cards - ${flashcardSet.documentId?.title || 'Untitled'}`,
                  timestamp: flashcardSet.createdAt,
                  link: `/flashcards/${flashcardSet._id}`,
                  type: 'flashcard'
                }))
              ]
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((activity, index) => (
                  <div key={activity.id || index} className="group flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all duration-200">
                    <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${activity.type === 'document' ? 'bg-blue-50 text-blue-600' :
                        activity.type === 'quiz' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-purple-50 text-purple-600'
                      }`}>
                      {activity.type === 'document' ? <FileText size={18} /> :
                        activity.type === 'quiz' ? <BrainCircuit size={18} /> :
                          <BookOpen size={18} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${activity.type === 'document' ? 'bg-blue-100 text-blue-700' :
                            activity.type === 'quiz' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-purple-100 text-purple-700'
                          }`}>
                          {activity.type === 'document' ? 'Doc' :
                            activity.type === 'quiz' ? 'Quiz' :
                              'Cards'}
                        </span>
                        <p className="text-sm text-slate-900 font-semibold truncate">
                          {activity.description}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {new Date(activity.timestamp).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(activity.link)}
                      className="opacity-0 group-hover:opacity-100 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No activity to show yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default DashboardPage