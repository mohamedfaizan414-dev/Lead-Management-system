const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function register(req, res) {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ message: 'Email already registered' })

    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ username, email, password: hash })
    
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    
  
    res.status(201).json({ 
      message: 'Registration successful', 
      token, 
      user: { id: user._id, username: user.username, email: user.email } 
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'All fields are required' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid email or password' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ message: 'Invalid email or password' })

   
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    
    
    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: { id: user._id, username: user.username, email: user.email } 
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}


function logout(req, res) {
  res.status(200).json({ message: 'Logged out successfully. Please remove the token from your client storage.' })
}

async function me(req, res) {
  try {
    const user = await User.findById(req.userId).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.status(200).json({ user })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { register, login, logout, me }