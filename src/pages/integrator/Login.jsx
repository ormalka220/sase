import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function IntegratorLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Mock login - in production, call actual API
      if (email && password) {
        await login({
          id: 'int-' + Date.now(),
          name: 'Sales Manager',
          email: email,
          role: 'INTEGRATOR',
          integrator: { name: 'Your Company Inc', id: 'integ-1' }
        })
        navigate('/integrator/dashboard')
      } else {
        throw new Error('Please fill in all fields')
      }
    } catch (err) {
      setError(err.message || 'Login failed')
      setShake(true)
      setTimeout(() => setShake(false), 600)
    } finally {
      setLoading(false)
    }
  }

  const appBackground = `
    radial-gradient(circle at 20% 50%, rgba(44,106,138,0.25) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(44,106,138,0.15) 0%, transparent 40%),
    linear-gradient(160deg, #07111E 0%, #0B1929 100%)
  `

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: appBackground }}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(44,106,138,0.2), rgba(44,106,138,0.05))',
              border: '1px solid rgba(44,106,138,0.3)'
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="w-8 h-8 text-cdata-400" />
          </motion.div>
          <h1 className="text-2xl font-black text-white mb-1">Integrator Portal</h1>
          <p className="text-sm text-slate-400">Sell and manage Perception Point</p>
        </div>

        {/* Login Card */}
        <motion.div
          className="glass rounded-2xl p-8 border border-white/10"
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-cdata-500/50 transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-cdata-500/50 transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">{error}</p>
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cdata-500 to-cdata-600 hover:from-cdata-400 hover:to-cdata-500 text-white font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-gradient-to-b from-navy-900 to-navy-800 text-slate-500">Demo Access</span>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs">
              <p className="text-blue-300 font-semibold mb-1">Demo Credentials:</p>
              <p className="text-blue-200/70">Email: demo@integrator.com</p>
              <p className="text-blue-200/70">Password: demo123</p>
            </div>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <a href="#" className="text-xs text-cdata-400 hover:text-cdata-300 transition-colors">
              Forgot your password?
            </a>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="mt-6 text-center text-xs text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          © 2024 CData. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  )
}
