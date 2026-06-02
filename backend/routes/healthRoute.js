const express = require("express")
const route = express.Router()
const healthRoutes = require('../controllers/health.controllers')

route.get('/',healthRoutes)

module.exports = route