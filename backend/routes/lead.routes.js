const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.middleware')
const { createLead, getAllLeads, getLeadById, updateLead, deleteLead, addNote, deleteNote } = require('../controllers/lead.controller')

router.use(auth)
router.post('/', createLead)
router.get('/', getAllLeads)
router.get('/:id', getLeadById)
router.patch('/:id', updateLead)
router.delete('/:id', deleteLead)
router.post('/:id/notes', addNote)
router.delete('/:id/notes/:noteId', deleteNote)

module.exports = router
