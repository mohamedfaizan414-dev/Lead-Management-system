const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.middleware')
const { summarizeNotes } = require('../controllers/ai.controller')

router.use(auth)
router.post('/summarize', summarizeNotes)

module.exports = router
