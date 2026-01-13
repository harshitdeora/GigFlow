import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/')
  }

  return (
    <nav className="bg-dark-surface border-b border-dark-border shadow-glow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-glow-primary hover:text-glow-secondary transition-colors">
            <span className="drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">GigFlow</span>
          </Link>

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="text-dark-text hover:text-glow-primary transition-colors"
                >
                  Browse Gigs
                </Link>
                <Link
                  to="/post-gig"
                  className="text-dark-text hover:text-glow-primary transition-colors"
                >
                  Post a Gig
                </Link>
                <Link
                  to="/my-gigs"
                  className="text-dark-text hover:text-glow-primary transition-colors"
                >
                  My Gigs
                </Link>
                <Link
                  to="/dashboard"
                  className="text-dark-text hover:text-glow-primary transition-colors"
                >
                  Dashboard
                </Link>
                <span className="text-dark-text-muted">Welcome, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-glow-primary hover:bg-glow-secondary text-white rounded-lg transition-all shadow-glow-sm hover:shadow-glow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-dark-text hover:text-glow-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-glow-primary hover:bg-glow-secondary text-white rounded-lg transition-all shadow-glow-sm hover:shadow-glow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar


