import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import authService from "../../services/authService"
import { BrainCircuit, Mail, Lock, ArrowRight, User, Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"

function RegisterPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [focusField, setFocusField] = useState(null)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }
    setError('')
    setLoading(true)
    try {
      await authService.register(username, email, password)
      localStorage.setItem('is_new_user', 'true')
      toast.success('Registered in successfully! Please Login')
      navigate('/login')
    } catch (error) {
      setError(error.message || 'Failed to Register. Please Try Again')
      toast.error(error.message || 'Failed to Register.')
    } finally {
      setLoading(false)
    }
  }

  return <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-slate-50 font-display">
    {/* Background Decor */}
    <div className="absolute inset-0 bg-linear-to-br from-emerald-50/60 via-white to-teal-50/60" />
    <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[100px] animate-pulse" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-teal-400/10 rounded-full blur-[100px] animate-pulse delay-700" />

    {/* Grid Pattern Overlay */}
    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[20px_20px] opacity-50" />

    <div className="relative w-full max-w-[420px] px-4 transition-all duration-300 ease-out transform">
      <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 relative overflow-hidden group">

        {/* Top Decorative Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-emerald-400 via-teal-500 to-emerald-400 opacity-60" />

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-green-50 to-emerald-100 shadow-inner border border-emerald-100 mb-6 group-hover:scale-105 transition-transform duration-300">
            <BrainCircuit className="w-8 h-8 text-emerald-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">Create an account</h1>
          <p className="text-slate-500 font-medium text-sm">Start Your AI-powered Learning experience</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Username Field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Username</label>
            <div className="relative group/input">
              <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focusField === 'username' ? 'text-emerald-600' : 'text-slate-400 group-hover/input:text-slate-500'}`}>
                <User className="w-5 h-5" strokeWidth={2} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocusField('username')}
                onBlur={() => setFocusField(null)}
                className={`w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border ${focusField === 'username' ? 'border-emerald-500 bg-white ring-4 ring-emerald-500/10' : 'border-slate-200 group-hover/input:border-slate-300'} rounded-xl text-slate-600 placeholder:text-slate-400 focus:outline-none transition-all duration-300 font-medium`}
                placeholder="Choose a username"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Email</label>
            <div className="relative group/input">
              <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focusField === 'email' ? 'text-emerald-600' : 'text-slate-400 group-hover/input:text-slate-500'}`}>
                <Mail className="w-5 h-5" strokeWidth={2} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusField('email')}
                onBlur={() => setFocusField(null)}
                className={`w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border ${focusField === 'email' ? 'border-emerald-500 bg-white ring-4 ring-emerald-500/10' : 'border-slate-200 group-hover/input:border-slate-300'} rounded-xl text-slate-600 placeholder:text-slate-400 focus:outline-none transition-all duration-300 font-medium`}
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Password</label>
            <div className="relative group/input">
              <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focusField === 'password' ? 'text-emerald-600' : 'text-slate-400 group-hover/input:text-slate-500'}`}>
                <Lock className="w-5 h-5" strokeWidth={2} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusField('password')}
                onBlur={() => setFocusField(null)}
                className={`w-full pl-12 pr-12 py-3.5 bg-slate-50/50 border ${focusField === 'password' ? 'border-emerald-500 bg-white ring-4 ring-emerald-500/10' : 'border-slate-200 group-hover/input:border-slate-300'} rounded-xl text-slate-600 placeholder:text-slate-400 focus:outline-none transition-all duration-300 font-medium`}
                placeholder="At least 6 characters"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors duration-300"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" strokeWidth={2} />
                ) : (
                  <Eye className="w-5 h-5" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-3 animate-fade-in-down">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <p className="text-sm font-medium text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full relative overflow-hidden bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group/btn"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" strokeWidth={2.5} />
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-200%] group-hover/btn:animate-shimmer" />
          </button>
        </form>
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Already have an account?{' '}
            <Link to='/login' className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline decoration-2 underline-offset-4 transition-all">
              Login
            </Link>
          </p>
        </div>
        {/* Subtle footer text */}
        <p className="text-center text-slate-400 text-xs mt-8">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  </div>

}

export default RegisterPage