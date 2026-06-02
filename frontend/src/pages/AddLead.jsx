import { useState } from 'react'
import api from '../lib/axios'

export default function AddLead({ setPage }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', status: 'new' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/leads', form)
      setSuccess(true)
      setForm({ name: '', email: '', company: '', status: 'new' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create lead')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="p-8 flex items-start justify-center min-h-[60vh] animate-fade-in">
        <div className="bg-panel border border-border rounded-2xl p-10 max-w-sm w-full text-center mt-16">
          <div className="w-14 h-14 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 12l5 5 11-11" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="font-display text-xl text-bright mb-2">Lead Created!</h2>
          <p className="text-dim text-sm mb-7">The lead has been added to your pipeline.</p>
          <div className="flex gap-3">
            <button onClick={() => setSuccess(false)} className="flex-1 bg-surface border border-border hover:border-muted text-soft rounded-xl py-2.5 text-sm font-medium transition-all">
              Add Another
            </button>
            <button onClick={() => setPage('leads')} className="flex-1 bg-accent hover:bg-accent-dim text-white rounded-xl py-2.5 text-sm font-semibold transition-all">
              View Leads
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-bright mb-1">Add Lead</h1>
        <p className="text-dim text-sm">Create a new lead in your pipeline</p>
      </div>

      <div className="bg-panel border border-border rounded-2xl p-8 max-w-lg">
        {error && (
          <div className="mb-5 px-4 py-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-soft text-xs font-medium mb-1.5 uppercase tracking-wider">Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Smith"
              required
              className="w-full bg-surface border border-border text-bright rounded-xl px-4 py-3 text-sm outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-muted"
            />
          </div>

          <div>
            <label className="block text-soft text-xs font-medium mb-1.5 uppercase tracking-wider">Email *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@acmecorp.com"
              required
              className="w-full bg-surface border border-border text-bright rounded-xl px-4 py-3 text-sm outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-muted"
            />
          </div>

          <div>
            <label className="block text-soft text-xs font-medium mb-1.5 uppercase tracking-wider">Company <span className="text-muted normal-case">(optional)</span></label>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Acme Corporation"
              className="w-full bg-surface border border-border text-bright rounded-xl px-4 py-3 text-sm outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-muted"
            />
          </div>

          <div>
            <label className="block text-soft text-xs font-medium mb-1.5 uppercase tracking-wider">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full bg-surface border border-border text-bright rounded-xl px-4 py-3 text-sm outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all cursor-pointer"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-accent hover:bg-accent-dim disabled:opacity-50 text-white rounded-xl py-3 text-sm font-semibold transition-all"
          >
            {loading ? 'Creating lead...' : 'Create Lead'}
          </button>
        </form>
      </div>
    </div>
  )
}
