import { useState, useEffect } from 'react'
import api from '../lib/axios'

const statusConfig = {
  new: { label: 'New', color: 'text-info', bg: 'bg-info/10', border: 'border-info/20' },
  contacted: { label: 'Contacted', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
  qualified: { label: 'Qualified', color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
  closed: { label: 'Closed', color: 'text-soft', bg: 'bg-muted/10', border: 'border-muted/20' },
}

function StatCard({ label, value, icon, color, loading }) {
  return (
    <div className="bg-panel border border-border rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-dim text-sm font-medium">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color.replace('text-', 'bg-').replace('info', 'info/10').replace('warning', 'warning/10').replace('success', 'success/10').replace('accent', 'accent/10').replace('soft', 'muted/10')}`}>
          <span className={color}>{icon}</span>
        </div>
      </div>
      <div className={`font-display text-4xl ${color}`}>
        {loading ? <span className="text-muted animate-pulse">—</span> : value}
      </div>
    </div>
  )
}

export default function Dashboard({ setPage }) {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/leads').then(res => setLeads(res.data.leads)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    closed: leads.filter(l => l.status === 'closed').length,
  }

  const recentLeads = [...leads].slice(0, 5)

  return (
    <div className="p-8 max-w-6xl animate-fade-in">
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-bright mb-1">Dashboard</h1>
          <p className="text-dim text-sm">Your sales pipeline at a glance</p>
        </div>
        <button
          onClick={() => setPage('add')}
          className="flex items-center gap-2 bg-accent hover:bg-accent-dim text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add Lead
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Leads" value={stats.total} color="text-accent" loading={loading} icon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M2 13c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        }/>
        <StatCard label="Contacted" value={stats.contacted} color="text-warning" loading={loading} icon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 3h10a1 1 0 011 1v7a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5"/><path d="M2 4l6 5 6-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        }/>
        <StatCard label="Qualified" value={stats.qualified} color="text-success" loading={loading} icon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        }/>
        <StatCard label="Closed" value={stats.closed} color="text-soft" loading={loading} icon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        }/>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-panel border border-border rounded-2xl p-6">
          <h2 className="text-bright font-semibold text-sm mb-5">Pipeline Breakdown</h2>
          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-surface rounded-lg animate-pulse"/>)}</div>
          ) : stats.total === 0 ? (
            <div className="text-center py-8 text-dim text-sm">No leads yet</div>
          ) : (
            <div className="space-y-3">
              {Object.entries(statusConfig).map(([key, cfg]) => {
                const count = stats[key] || 0
                const pct = stats.total ? Math.round((count / stats.total) * 100) : 0
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-soft">{cfg.label}</span>
                      <span className="text-dim font-mono">{count} · {pct}%</span>
                    </div>
                    <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          key === 'new' ? 'bg-info' : key === 'contacted' ? 'bg-warning' : key === 'qualified' ? 'bg-success' : 'bg-muted'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-panel border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-bright font-semibold text-sm">Recent Leads</h2>
            <button onClick={() => setPage('leads')} className="text-accent text-xs hover:underline">View all</button>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-surface rounded-lg animate-pulse"/>)}</div>
          ) : recentLeads.length === 0 ? (
            <div className="text-center py-8 text-dim text-sm">No leads yet</div>
          ) : (
            <div className="space-y-2">
              {recentLeads.map(lead => {
                const cfg = statusConfig[lead.status]
                return (
                  <div key={lead._id} className="flex items-center justify-between py-2 border-b border-border/60 last:border-0">
                    <div className="min-w-0">
                      <div className="text-bright text-sm font-medium truncate">{lead.name}</div>
                      <div className="text-dim text-xs truncate">{lead.company || lead.email}</div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ml-3 flex-shrink-0 ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                      {cfg.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
