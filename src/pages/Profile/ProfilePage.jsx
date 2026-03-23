import React, { useState } from 'react'
import { User, Mail, Calendar, Shield, Lock, Save, Eye, EyeOff, Key } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const { user, updateUser } = useAuth()

  const [username, setUsername] = useState(user?.username || user?.name || '')
  const [email] = useState(user?.email || '')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem('gemini_api_key') || '')
  const [savingApiKey, setSavingApiKey] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const result = await authService.updateProfile({ username })
      // keep local auth state in sync with backend response
      const updated = result?.data || {}
      updateUser({
        username: updated.username ?? username,
        email: updated.email ?? email,
        profileImage: updated.profileImage
      })
      toast.success(result?.message || 'Profile updated successfully')
    } catch (error) {
      toast.error(error?.message || 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match')
      return
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }

    setChangingPassword(true)
    try {
      const result = await authService.changePassword({ currentPassword, newPassword })
      toast.success(result?.message || 'Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      toast.error(error?.message || 'Failed to change password')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleSaveApiKey = async (e) => {
    e.preventDefault()
    setSavingApiKey(true)
    try {
      if (geminiApiKey.trim()) {
        localStorage.setItem('gemini_api_key', geminiApiKey.trim())
        toast.success('API Key saved successfully to your browser')
      } else {
        localStorage.removeItem('gemini_api_key')
        toast.success('API Key removed. System default will be used.')
      }
    } catch (error) {
      toast.error('Failed to save API key')
    } finally {
      setSavingApiKey(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-emerald-50/60 p-6 lg:p-10">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Profile
              </h1>
              <p className="text-slate-500 text-sm md:text-base font-medium">
                Manage your personal information and account security.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: User info card */}
          <div className="lg:col-span-1">
            <div className="relative bg-white rounded-3xl border border-emerald-200/80 shadow-sm p-6 space-y-5">

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-slate-900/10">

                  {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    {user?.name || 'User'}
                  </h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {user?.role || 'Learner'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail size={16} className="text-slate-400" />
                  <span className="font-medium break-all">{email || 'No email available'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar size={16} className="text-slate-400" />
                  <span className="font-medium">
                    Member since{' '}
                    <span className="font-bold">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                    </span>
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-[11px] font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-2">
                <Shield size={14} className="text-emerald-500" />

                Account protected with password
              </div>
            </div>
          </div>

          {/* Right: forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile info form */}
            <form
              onSubmit={handleSaveProfile}
              className="bg-white rounded-3xl border border-emerald-200/80 shadow-sm p-6 space-y-5"
            >

              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">

                  <User size={18} />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    Personal Information
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Update your display details.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your username"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-500 font-medium"

                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-500 font-medium cursor-not-allowed"

                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"

                >
                  {savingProfile ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Change password form */}
            <form
              onSubmit={handleChangePassword}
              className="bg-white rounded-3xl border border-emerald-200/80 shadow-sm p-6 space-y-5"
            >

              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">

                  <Lock size={18} />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    Change Password
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Keep your account secure with a strong password.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 font-medium"

                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-600"

                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 font-medium"

                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-600"

                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full px-3 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 font-medium"

                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-600"

                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
                <p>
                  Use at least 6 characters, including a mix of letters, numbers and symbols.
                </p>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"

                >
                  {changingPassword ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* AI Settings / API Key */}
            <form
              onSubmit={handleSaveApiKey}
              className="bg-white rounded-3xl border border-emerald-200/80 shadow-sm p-6 space-y-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Key size={18} />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    AI Settings (Gemini API Key)
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Use your own Gemini API key for all AI features.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Gemini API Key
                  </label>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-2 uppercase tracking-wider"
                  >
                    Get Key from Google AI Studio
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key (AIza...)"
                    className="w-full px-3 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey((prev) => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                
                {/* Instructions Box */}
                <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px]">?</span>
                    How to get your API Key:
                  </p>
                  <ol className="text-[11px] text-slate-600 font-medium space-y-1 ml-4 list-decimal">
                    <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold hover:underline">Google AI Studio</a>.</li>
                    <li>Sign in with your Google Account.</li>
                    <li>Click the <strong>"Create API key"</strong> button.</li>
                    <li>Copy the key and paste it in the field above.</li>
                  </ol>
                  <p className="text-[10px] text-slate-400 font-bold italic mt-2">
                    Note: Your API key is stored only in your browser's local storage for security.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
                <p>
                  Leave empty to use the system's default API key (if available).
                </p>
                <button
                  type="submit"
                  disabled={savingApiKey}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {savingApiKey ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Save API Key
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage