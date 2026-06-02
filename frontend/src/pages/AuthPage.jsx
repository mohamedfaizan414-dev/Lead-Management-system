import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await register(form.username, form.email, form.password)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent opacity-[0.04] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-info opacity-[0.04] blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8L6 12L14 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display text-xl text-bright tracking-tight">LeadFlow</span>
          </div>
          <h1 className="font-display text-3xl text-bright mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-dim text-sm">
            {mode === 'login' ? 'Sign in to your sales CRM' : 'Start managing your leads today'}
          </p>
        </div>

        <div className="bg-panel border border-border rounded-2xl p-8">
          {error && (
            <div className="mb-5 px-4 py-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <div>
                <label className="block text-soft text-xs font-medium mb-1.5 uppercase tracking-wider">Username</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  required
                  className="w-full bg-surface border border-border text-bright rounded-xl px-4 py-3 text-sm outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-muted"
                />
              </div>
            )}
            <div>
              <label className="block text-soft text-xs font-medium mb-1.5 uppercase tracking-wider">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@company.com"
                required
                className="w-full bg-surface border border-border text-bright rounded-xl px-4 py-3 text-sm outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-muted"
              />
            </div>
            <div>
              <label className="block text-soft text-xs font-medium mb-1.5 uppercase tracking-wider">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-surface border border-border text-bright rounded-xl px-4 py-3 text-sm outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-muted"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-accent hover:bg-accent-dim disabled:opacity-50 text-white rounded-xl py-3 text-sm font-semibold transition-all duration-200 glow-accent"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-dim">
            {mode === 'login' ? (
              <>Don't have an account?{' '}
                <button onClick={() => { setMode('register'); setError('') }} className="text-accent hover:text-accent/80 font-medium transition-colors">
                  Sign up
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => { setMode('login'); setError('') }} className="text-accent hover:text-accent/80 font-medium transition-colors">
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
