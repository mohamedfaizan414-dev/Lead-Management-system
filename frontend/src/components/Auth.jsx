import React, { useState } from 'react'
import api from '../lib/axios'

function Auth({ onAuthSuccess }) {
    const [isLogin, setIsLogin] = useState(true)
    const [form, setForm] = useState({ username: '', email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError('')
        
        // This targets your backend routes: /auth/login or /auth/register
        const endpoint = isLogin ? '/auth/login' : '/auth/register'
        try {
            const res = await api.post(endpoint, form)
            // Send the authorized user context back up to App.jsx
            onAuthSuccess(res.data.isUserExists || res.data.user)
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-bg p-4'>
            <div className='bg-side border border-brdr rounded-2xl p-8 w-full max-w-md shadow-2xl'>
                <h2 className='text-white text-3xl font-bold mb-2 text-center'>
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className='text-gray-500 text-center mb-6 text-sm'>
                    {isLogin ? 'Log in to manage your sales pipeline' : 'Get started with LeadFlow CRM'}
                </p>

                {error && <div className='bg-red-900/30 border border-red-700 text-red-400 rounded-xl p-3 mb-4 text-sm text-center'>{error}</div>}

                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    {!isLogin && (
                        <div>
                            <label className='text-gray-400 text-xs mb-1 block'>Username *</label>
                            <input name='username' required value={form.username} onChange={handleChange} placeholder='username' className='w-full bg-bg border border-brdr text-white rounded-xl p-3 text-sm outline-none focus:border-gray-500' />
                        </div>
                    )}
                    <div>
                        <label className='text-gray-400 text-xs mb-1 block'>Email Address *</label>
                        <input type='email' name='email' required value={form.email} onChange={handleChange} placeholder='email@example.com' className='w-full bg-bg border border-brdr text-white rounded-xl p-3 text-sm outline-none focus:border-gray-500' />
                    </div>
                    <div>
                        <label className='text-gray-400 text-xs mb-1 block'>Password *</label>
                        <input type='password' name='password' required value={form.password} onChange={handleChange} placeholder='••••••••' className='w-full bg-bg border border-brdr text-white rounded-xl p-3 text-sm outline-none focus:border-gray-500' />
                    </div>

                    <button type='submit' disabled={loading} className='bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl p-3 font-semibold text-sm mt-2 transition-colors'>
                        {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div className='mt-6 text-center'>
                    <button type='button' onClick={() => { setIsLogin(!isLogin); setError('') }} className='text-blue-400 text-sm hover:underline bg-transparent border-none cursor-pointer'>
                        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Auth