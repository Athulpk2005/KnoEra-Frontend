import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/Auth/ResetPasswordPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { useAuth } from './context/AuthContext'

// Lazy loaded components
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage'))
const DocumentListPage = lazy(() => import('./pages/documents/DocumentListPage'))
const DocumentDetailPage = lazy(() => import('./pages/documents/DocumentDetailPage'))
const QuizTakePage = lazy(() => import('./pages/Quizzes/QuizTakePage'))
const FlashcardsListPage = lazy(() => import('./pages/Flashcards/FlashcardsListPage'))
const FlashCardPage = lazy(() => import('./pages/Flashcards/FlashCardPage'))
const QuizResultPage = lazy(() => import('./pages/Quizzes/QuizResultPage'))
const QuizListPage = lazy(() => import('./pages/Quizzes/QuizListPage'))
const AskPage = lazy(() => import('./pages/Ai/AskPage'))
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'))

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)
const App = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/documents" element={<DocumentListPage />} />
            <Route path="/documents/:id" element={<DocumentDetailPage />} />
            <Route path="/flashcards" element={<FlashcardsListPage />} />
            <Route path="/flashcards/:id" element={<FlashCardPage />} />
            <Route path="/quizzes" element={<QuizListPage />} />
            <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
            <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
            <Route path="/ask" element={<AskPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
export default App