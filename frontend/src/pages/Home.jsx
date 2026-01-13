import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGigs } from '../store/slices/gigSlice'

const Home = () => {
  const dispatch = useDispatch()
  const { gigs, loading } = useSelector((state) => state.gigs)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    dispatch(fetchGigs(searchQuery))
  }, [dispatch, searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(fetchGigs(searchQuery))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-glow-primary to-glow-accent bg-clip-text text-transparent">
          Find Your Next Gig
        </h1>
        <p className="text-dark-text-muted text-lg">
          Connect with clients and freelancers in the marketplace
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for gigs..."
            className="flex-1 px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-dark-text placeholder-dark-text-muted focus:outline-none focus:border-glow-primary focus:shadow-glow-sm transition-all"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-glow-primary hover:bg-glow-secondary text-white rounded-lg transition-all shadow-glow-sm hover:shadow-glow-md"
          >
            Search
          </button>
        </form>
      </div>

      {/* Gigs Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-glow-primary"></div>
        </div>
      ) : gigs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-dark-text-muted text-xl">No gigs found. Be the first to post one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
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
                <span className="px-3 py-1 bg-glow-primary/20 text-glow-primary rounded-full text-sm">
                  {gig.status}
                </span>
              </div>
              <div className="mt-4 text-sm text-dark-text-muted">
                Posted by {gig.ownerId?.name || 'Unknown'}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home



