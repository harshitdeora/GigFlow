import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearError } from '../store/slices/authSlice'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(login(formData))
    if (login.fulfilled.match(result)) {
      navigate('/')
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-dark-card border border-dark-border rounded-lg p-8 shadow-glow-md">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-glow-primary to-glow-accent bg-clip-text text-transparent">
          Login
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-dark-text mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-dark-text placeholder-dark-text-muted focus:outline-none focus:border-glow-primary focus:shadow-glow-sm transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-dark-text mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-dark-text placeholder-dark-text-muted focus:outline-none focus:border-glow-primary focus:shadow-glow-sm transition-all"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-glow-primary hover:bg-glow-secondary text-white rounded-lg transition-all shadow-glow-sm hover:shadow-glow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-dark-text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="text-glow-primary hover:text-glow-secondary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login



