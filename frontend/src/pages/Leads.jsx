import { useState, useEffect, useCallback } from 'react'
import api from '../lib/axios'
import LeadDetail from './LeadDetail'

const statusConfig = {
  new: { label: 'New', color: 'text-info', bg: 'bg-info/10', border: 'border-info/25' },
  contacted: { label: 'Contacted', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/25' },
  qualified: { label: 'Qualified', color: 'text-success', bg: 'bg-success/10', border: 'border-success/25' },
  closed: { label: 'Closed', color: 'text-soft', bg: 'bg-muted/10', border: 'border-muted/25' },
}

export default function Leads({ setPage: setOuterPage }) {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      const res = await api.get('/leads', { params })
      setLeads(res.data.leads)
    } catch {
      setError('Failed to load leads')
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => {
    const t = setTimeout(fetchLeads, 300)
    return () => clearTimeout(t)
  }, [fetchLeads])

  if (selectedId) {
    return <LeadDetail leadId={selectedId} onBack={() => { setSelectedId(null); fetchLeads() }}/>
  }

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-bright mb-1">Leads</h1>
          <p className="text-dim text-sm">Manage and track your sales pipeline</p>
        </div>
        <button
          onClick={() => setOuterPage('add')}
          className="flex items-center gap-2 bg-accent hover:bg-accent-dim text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add Lead
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-panel border border-border text-bright rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-muted"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-panel border border-border text-soft rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/60 transition-all cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="closed">Closed</option>
        </select>
        {(search || statusFilter) && (
          <button
            onClick={() => { setSearch(''); setStatusFilter('') }}
            className="text-dim hover:text-bright text-sm flex items-center gap-1 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Clear
          </button>
        )}
      </div>

      {loading && (
        <div className="bg-panel border border-border rounded-2xl overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b border-border/60 last:border-0 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-surface flex-shrink-0"/>
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 bg-surface rounded w-32"/>
                <div className="h-3 bg-surface rounded w-48"/>
              </div>
              <div className="h-6 w-20 bg-surface rounded-full"/>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-16">
          <p className="text-danger text-sm">{error}</p>
          <button onClick={fetchLeads} className="text-accent text-sm mt-2 hover:underline">Retry</button>
        </div>
      )}

      {!loading && !error && leads.length === 0 && (
        <div className="text-center py-20">
          <div className="w-14 h-14 rounded-2xl bg-panel border border-border flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="7" r="4" stroke="#3F3F46" strokeWidth="1.5"/>
              <path d="M3 19c0-4.418 3.582-7 8-7s8 2.582 8 7" stroke="#3F3F46" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-soft text-sm font-medium mb-1">
            {search || statusFilter ? 'No leads match your filters' : 'No leads yet'}
          </p>
          <p className="text-dim text-xs mb-4">
            {search || statusFilter ? 'Try adjusting your search or filters' : 'Add your first lead to get started'}
          </p>
          {!search && !statusFilter && (
            <button onClick={() => setOuterPage('add')} className="bg-accent hover:bg-accent-dim text-white rounded-xl px-5 py-2 text-sm font-semibold transition-all">
              Add First Lead
            </button>
          )}
        </div>
      )}

      {!loading && !error && leads.length > 0 && (
        <div className="bg-panel border border-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wider p-4 pl-5">Name</th>
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wider p-4">Email</th>
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wider p-4">Company</th>
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wider p-4">Status</th>
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wider p-4">Created</th>
                <th className="p-4"/>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => {
                const cfg = statusConfig[lead.status]
                return (
                  <tr
                    key={lead._id}
                    onClick={() => setSelectedId(lead._id)}
                    className="border-b border-border/60 last:border-0 hover:bg-surface/60 cursor-pointer transition-colors group"
                  >
                    <td className="p-4 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-accent text-xs font-semibold">{lead.name[0]?.toUpperCase()}</span>
                        </div>
                        <span className="text-bright text-sm font-medium">{lead.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-dim text-sm">{lead.email}</td>
                    <td className="p-4 text-dim text-sm">{lead.company || <span className="text-muted">—</span>}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="p-4 text-dim text-sm font-mono">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 pr-5">
                      <svg className="text-muted group-hover:text-soft transition-colors ml-auto" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-border text-xs text-muted font-mono">
            {leads.length} lead{leads.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  )
}
