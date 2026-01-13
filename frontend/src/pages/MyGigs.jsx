import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGigs } from '../store/slices/gigSlice'
import { getCurrentUser } from '../store/slices/authSlice'

const MyGigs = () => {
  const dispatch = useDispatch()
  const { gigs, loading } = useSelector((state) => state.gigs)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getCurrentUser())
    dispatch(fetchGigs())
  }, [dispatch])

  // Filter gigs owned by current user
  const myGigs = gigs.filter(gig => {
    const ownerId = gig.ownerId?._id?.toString() || gig.ownerId?.id?.toString()
    const userId = user?.id?.toString() || user?._id?.toString()
    return ownerId === userId
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-glow-primary to-glow-accent bg-clip-text text-transparent">
          My Gigs
        </h1>
        <Link
          to="/post-gig"
          className="px-4 py-2 bg-glow-primary hover:bg-glow-secondary text-white rounded-lg transition-all shadow-glow-sm hover:shadow-glow-md"
        >
          Post New Gig
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-glow-primary"></div>
        </div>
      ) : myGigs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-dark-text-muted text-xl mb-4">You haven't posted any gigs yet.</p>
          <Link
            to="/post-gig"
            className="px-4 py-2 bg-glow-primary hover:bg-glow-secondary text-white rounded-lg transition-all shadow-glow-sm hover:shadow-glow-md inline-block"
          >
            Post Your First Gig
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myGigs.map((gig) => (
            <Link
              key={gig._id}
              to={`/gig/${gig._id}`}
              className="block bg-dark-card border border-dark-border rounded-lg p-6 hover:border-glow-primary hover:shadow-glow-md transition-all group"
            >
              <h3 className="text-xl font-semibold mb-2 text-dark-text group-hover:text-glow-primary transition-colors">
                {gig.title}
              </h3>
              <p className="text-dark-text-muted mb-4 line-clamp-3">
                {gig.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-glow-primary font-bold text-lg">
                  ${gig.budget.toLocaleString()}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  gig.status === 'open'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                }`}>
                  {gig.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyGigs

