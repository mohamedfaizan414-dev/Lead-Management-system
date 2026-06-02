import { useState, useEffect, useRef } from 'react'
import api from '../lib/axios'

const statusConfig = {
  new: { label: 'New', color: 'text-info', bg: 'bg-info/10', border: 'border-info/25' },
  contacted: { label: 'Contacted', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/25' },
  qualified: { label: 'Qualified', color: 'text-success', bg: 'bg-success/10', border: 'border-success/25' },
  closed: { label: 'Closed', color: 'text-soft', bg: 'bg-muted/10', border: 'border-muted/25' },
}

export default function LeadDetail({ leadId, onBack }) {
  const [lead, setLead] = useState(null)
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [noteInput, setNoteInput] = useState('')
  const [noteLoading, setNoteLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [editLoading, setEditLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiDraft, setAiDraft] = useState('')
  const [savedSummary, setSavedSummary] = useState('')
  const [aiError, setAiError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const notesEndRef = useRef(null)

  async function fetchLead() {
    try {
      const res = await api.get(`/leads/${leadId}`)
      setLead(res.data.lead)
      setNotes(res.data.notes)
      setEditForm({
        name: res.data.lead.name,
        email: res.data.lead.email,
        company: res.data.lead.company,
        status: res.data.lead.status,
      })
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLead() }, [leadId])

  async function handleAddNote(e) {
    e.preventDefault()
    if (!noteInput.trim()) return
    setNoteLoading(true)
    try {
      await api.post(`/leads/${leadId}/notes`, { content: noteInput.trim() })
      setNoteInput('')
      fetchLead()
      setTimeout(() => notesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch {
    } finally {
      setNoteLoading(false)
    }
  }

  async function handleDeleteNote(noteId) {
    try {
      await api.delete(`/leads/${leadId}/notes/${noteId}`)
      fetchLead()
    } catch {}
  }

  async function handleUpdateLead(e) {
    e.preventDefault()
    setEditLoading(true)
    try {
      await api.patch(`/leads/${leadId}`, editForm)
      setEditMode(false)
      fetchLead()
    } catch {
    } finally {
      setEditLoading(false)
    }
  }

  async function handleStatusChange(e) {
    const status = e.target.value
    await api.patch(`/leads/${leadId}`, { status })
    fetchLead()
  }

  async function handleAiSummarize() {
    if (notes.length === 0) return
    setAiLoading(true)
    setAiError('')
    setAiDraft('')
    try {
      const res = await api.post('/ai/summarize', { notes, leadName: lead?.name })
      setAiDraft(res.data.summary)
    } catch (err) {
      setAiError(err.response?.data?.message || 'AI service unavailable. Check your API key.')
    } finally {
      setAiLoading(false)
    }
  }

  async function handleDeleteLead() {
    try {
      await api.delete(`/leads/${leadId}`)
      onBack()
    } catch {}
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-dim text-sm animate-pulse">Loading lead...</div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="p-8">
        <div className="text-danger text-sm">Lead not found.</div>
      </div>
    )
  }

  const cfg = statusConfig[lead.status]

  return (
    <div className="p-8 animate-fade-in max-w-4xl">
      <button onClick={onBack} className="flex items-center gap-1.5 text-dim hover:text-bright text-sm mb-6 transition-colors">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Leads
      </button>

      <div className="bg-panel border border-border rounded-2xl p-6 mb-5">
        {!editMode ? (
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-display text-2xl text-bright">{lead.name}</h1>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                  {cfg.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-dim">
                <span>{lead.email}</span>
                {lead.company && <span>· {lead.company}</span>}
                <span>· Added {new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <select
                value={lead.status}
                onChange={handleStatusChange}
                className={`text-xs px-3 py-1.5 rounded-xl border outline-none cursor-pointer bg-transparent transition-all ${cfg.color} ${cfg.bg} ${cfg.border}`}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="closed">Closed</option>
              </select>
              <button
                onClick={() => setEditMode(true)}
                className="text-dim hover:text-bright p-2 rounded-xl hover:bg-surface transition-all"
                title="Edit lead"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9.5 2L12 4.5l-7 7H2.5V9l7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {deleteConfirm ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-danger">Sure?</span>
                  <button onClick={handleDeleteLead} className="text-xs bg-danger/15 border border-danger/30 text-danger px-2 py-1 rounded-lg hover:bg-danger/25 transition-all">Delete</button>
                  <button onClick={() => setDeleteConfirm(false)} className="text-xs text-dim hover:text-bright">Cancel</button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="text-dim hover:text-danger p-2 rounded-xl hover:bg-danger/10 transition-all"
                  title="Delete lead"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 4h10M5 4V2.5h4V4M5.5 6.5v4M8.5 6.5v4M3 4l.5 8h7L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateLead} className="space-y-4">
            <h3 className="text-bright font-semibold text-sm mb-4">Edit Lead</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-dim text-xs mb-1 uppercase tracking-wider">Name</label>
                <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full bg-surface border border-border text-bright rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent/60 transition-all" required/>
              </div>
              <div>
                <label className="block text-dim text-xs mb-1 uppercase tracking-wider">Email</label>
                <input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full bg-surface border border-border text-bright rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent/60 transition-all" type="email" required/>
              </div>
              <div>
                <label className="block text-dim text-xs mb-1 uppercase tracking-wider">Company</label>
                <input value={editForm.company} onChange={e => setEditForm({ ...editForm, company: e.target.value })} className="w-full bg-surface border border-border text-bright rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent/60 transition-all"/>
              </div>
              <div>
                <label className="block text-dim text-xs mb-1 uppercase tracking-wider">Status</label>
                <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="w-full bg-surface border border-border text-bright rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent/60 transition-all cursor-pointer">
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={editLoading} className="bg-accent hover:bg-accent-dim disabled:opacity-50 text-white rounded-xl px-5 py-2 text-sm font-semibold transition-all">
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setEditMode(false)} className="text-dim hover:text-bright border border-border hover:border-muted rounded-xl px-5 py-2 text-sm transition-all">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-panel border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-bright font-semibold">Activity & Notes</h2>
          <button
            onClick={handleAiSummarize}
            disabled={aiLoading || notes.length === 0}
            className="flex items-center gap-2 bg-surface border border-border hover:border-accent/40 disabled:opacity-40 text-soft hover:text-accent rounded-xl px-4 py-2 text-xs font-medium transition-all"
            title={notes.length === 0 ? 'Add notes first to generate summary' : 'Generate AI summary'}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1l1.5 3.5L12 6l-3.5 1.5L7 11l-1.5-3.5L2 6l3.5-1.5L7 1z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {aiLoading ? 'Generating...' : 'AI Summary'}
          </button>
        </div>

        {aiError && (
          <div className="mb-4 px-4 py-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-xs animate-fade-in">
            {aiError}
          </div>
        )}

        {aiDraft && (
          <div className="mb-5 bg-accent/5 border border-accent/20 rounded-xl p-5 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rounded flex items-center justify-center bg-accent/20">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1l1 2.5L8.5 5 6 6l-1 2.5L4 6 1.5 5 4 4 5 1z" stroke="#6366F1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-accent text-xs font-semibold uppercase tracking-wider">AI Draft — Edit before saving</span>
            </div>
            <textarea
              value={aiDraft}
              onChange={e => setAiDraft(e.target.value)}
              className="w-full bg-transparent text-soft text-sm outline-none resize-none min-h-[80px] leading-relaxed"
              rows={4}
            />
            <div className="flex gap-2 mt-3 pt-3 border-t border-accent/10">
              <button
                onClick={() => { setSavedSummary(aiDraft); setAiDraft('') }}
                className="bg-accent hover:bg-accent-dim text-white rounded-lg px-4 py-1.5 text-xs font-semibold transition-all"
              >
                Save Summary
              </button>
              <button
                onClick={() => setAiDraft('')}
                className="text-dim hover:text-soft text-xs px-3 py-1.5 transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {savedSummary && !aiDraft && (
          <div className="mb-5 bg-surface border border-border rounded-xl p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-dim text-xs font-mono uppercase tracking-wider">Saved AI Summary</span>
              <button onClick={() => setSavedSummary('')} className="text-muted hover:text-dim text-xs transition-colors">Clear</button>
            </div>
            <p className="text-soft text-sm leading-relaxed">{savedSummary}</p>
          </div>
        )}

        {notes.length === 0 ? (
          <div className="py-8 text-center">
            <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center mx-auto mb-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="2" width="10" height="12" rx="2" stroke="#3F3F46" strokeWidth="1.5"/>
                <path d="M6 6h4M6 9h3" stroke="#3F3F46" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-dim text-sm">No notes yet. Add your first note below.</p>
          </div>
        ) : (
          <div className="space-y-3 mb-5 max-h-96 overflow-y-auto">
            {notes.map(note => (
              <div key={note._id} className="group flex gap-3 animate-slide-in">
                <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent/60"/>
                </div>
                <div className="flex-1 bg-surface border border-border rounded-xl p-4">
                  <p className="text-soft text-sm leading-relaxed">{note.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-muted text-xs font-mono">{new Date(note.createdAt).toLocaleString()}</span>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="opacity-0 group-hover:opacity-100 text-muted hover:text-danger text-xs transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div ref={notesEndRef}/>
          </div>
        )}

        <form onSubmit={handleAddNote} className="flex gap-2 mt-4">
          <input
            value={noteInput}
            onChange={e => setNoteInput(e.target.value)}
            placeholder="Write a note..."
            className="flex-1 bg-surface border border-border text-bright rounded-xl px-4 py-3 text-sm outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-muted"
          />
          <button
            type="submit"
            disabled={noteLoading || !noteInput.trim()}
            className="bg-accent hover:bg-accent-dim disabled:opacity-40 text-white rounded-xl px-5 py-3 text-sm font-semibold transition-all flex-shrink-0"
          >
            {noteLoading ? '...' : 'Add'}
          </button>
        </form>
      </div>
    </div>
  )
}
