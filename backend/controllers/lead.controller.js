const Lead = require('../models/lead.model')
const Note = require('../models/note.model')

async function createLead(req, res) {
  try {
    const { name, email, company, status } = req.body
    if (!name || !email) return res.status(400).json({ message: 'Name and email are required' })

    const lead = await Lead.create({ name, email, company: company || '', status: status || 'new', userId: req.userId })
    res.status(201).json({ message: 'Lead created', lead })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

async function getAllLeads(req, res) {
  try {
    const { search, status } = req.query
    const query = { userId: req.userId }

    if (status && status !== 'all') query.status = status
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 })
    res.status(200).json({ leads })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

async function getLeadById(req, res) {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, userId: req.userId })
    if (!lead) return res.status(404).json({ message: 'Lead not found' })
    const notes = await Note.find({ leadId: req.params.id }).sort({ createdAt: 1 })
    res.status(200).json({ lead, notes })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

async function updateLead(req, res) {
  try {
    const allowed = ['name', 'email', 'company', 'status']
    const updates = {}
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f] })

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: updates },
      { new: true }
    )
    if (!lead) return res.status(404).json({ message: 'Lead not found' })
    res.status(200).json({ message: 'Lead updated', lead })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

async function deleteLead(req, res) {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    if (!lead) return res.status(404).json({ message: 'Lead not found' })
    await Note.deleteMany({ leadId: req.params.id })
    res.status(200).json({ message: 'Lead deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

async function addNote(req, res) {
  try {
    const { content } = req.body
    if (!content || !content.trim()) return res.status(400).json({ message: 'Note content is required' })

    const lead = await Lead.findOne({ _id: req.params.id, userId: req.userId })
    if (!lead) return res.status(404).json({ message: 'Lead not found' })

    const note = await Note.create({ leadId: req.params.id, content: content.trim() })
    res.status(201).json({ message: 'Note added', note })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

async function deleteNote(req, res) {
  try {
    const note = await Note.findById(req.params.noteId)
    if (!note) return res.status(404).json({ message: 'Note not found' })
    const lead = await Lead.findOne({ _id: note.leadId, userId: req.userId })
    if (!lead) return res.status(403).json({ message: 'Forbidden' })
    await Note.findByIdAndDelete(req.params.noteId)
    res.status(200).json({ message: 'Note deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

module.exports = { createLead, getAllLeads, getLeadById, updateLead, deleteLead, addNote, deleteNote }
