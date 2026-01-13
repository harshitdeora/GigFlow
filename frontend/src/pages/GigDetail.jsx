import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGig, clearCurrentGig } from '../store/slices/gigSlice'
import { submitBid, fetchBids, hireFreelancer, rejectBid, clearError } from '../store/slices/bidSlice'
import BidForm from '../components/BidForm'
import BidList from '../components/BidList'

const GigDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentGig, loading: gigLoading } = useSelector((state) => state.gigs)
  const { bids, loading: bidsLoading, error } = useSelector((state) => state.bids)
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [showBidForm, setShowBidForm] = useState(false)

  useEffect(() => {
    dispatch(fetchGig(id))
    return () => {
      dispatch(clearCurrentGig())
      dispatch(clearError())
    }
  }, [dispatch, id])

  useEffect(() => {
    // Fetch bids if user is the owner
    const ownerId = currentGig?.ownerId?._id?.toString() || currentGig?.ownerId?.id?.toString()
    const userId = user?.id?.toString() || user?._id?.toString()
    if (currentGig && isAuthenticated && ownerId === userId) {
      dispatch(fetchBids(id))
    }
  }, [dispatch, id, currentGig, isAuthenticated, user])

  const ownerId = currentGig?.ownerId?._id?.toString() || currentGig?.ownerId?.id?.toString()
  const userId = user?.id?.toString() || user?._id?.toString()
  const isOwner = currentGig && isAuthenticated && ownerId === userId
  const canBid = isAuthenticated && !isOwner && currentGig?.status === 'open'

  const handleBidSubmit = async (bidData) => {
    const result = await dispatch(submitBid({ gigId: id, ...bidData }))
    if (submitBid.fulfilled.match(result)) {
      setShowBidForm(false)
      if (isOwner) {
        dispatch(fetchBids(id))
      }
    }
  }

  const handleHire = async (bidId) => {
    const result = await dispatch(hireFreelancer(bidId))
    if (hireFreelancer.fulfilled.match(result)) {
      dispatch(fetchGig(id))
      dispatch(fetchBids(id))
    }
  }

  const handleReject = async (bidId) => {
    const result = await dispatch(rejectBid(bidId))
    if (rejectBid.fulfilled.match(result)) {
      dispatch(fetchBids(id))
    }
  }

  if (gigLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-glow-primary"></div>
        </div>
      </div>
    )
  }

  if (!currentGig) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-dark-text-muted text-xl">Gig not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-glow-primary hover:bg-glow-secondary text-white rounded-lg transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-dark-card border border-dark-border rounded-lg p-8 shadow-glow-md mb-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-bold text-dark-text">{currentGig.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm ${
            currentGig.status === 'open'
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
          }`}>
            {currentGig.status}
          </span>
        </div>

        <p className="text-dark-text-muted mb-6 whitespace-pre-wrap">{currentGig.description}</p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-glow-primary font-bold text-2xl">
              ${currentGig.budget.toLocaleString()}
            </span>
          </div>
          <div className="text-dark-text-muted">
            Posted by <span className="text-glow-primary">{currentGig.ownerId?.name}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {isOwner && (
        <div className="bg-dark-card border border-dark-border rounded-lg p-8 shadow-glow-md mb-6">
          <h2 className="text-2xl font-bold mb-4 text-dark-text">Bids for this Gig</h2>
          {bidsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-glow-primary"></div>
            </div>
          ) : bids.length === 0 ? (
            <p className="text-dark-text-muted">No bids yet. Check back later!</p>
          ) : (
            <BidList bids={bids} onHire={handleHire} onReject={handleReject} />
          )}
        </div>
      )}

      {canBid && (
        <div className="bg-dark-card border border-dark-border rounded-lg p-8 shadow-glow-md">
          {!showBidForm ? (
            <button
              onClick={() => setShowBidForm(true)}
              className="w-full px-4 py-3 bg-glow-primary hover:bg-glow-secondary text-white rounded-lg transition-all shadow-glow-sm hover:shadow-glow-md"
            >
              Submit a Bid
            </button>
          ) : (
            <BidForm
              onSubmit={handleBidSubmit}
              onCancel={() => setShowBidForm(false)}
            />
          )}
        </div>
      )}

      {!isAuthenticated && currentGig.status === 'open' && (
        <div className="bg-dark-card border border-dark-border rounded-lg p-8 shadow-glow-md text-center">
          <p className="text-dark-text-muted mb-4">Want to bid on this gig?</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-glow-primary hover:bg-glow-secondary text-white rounded-lg transition-all"
          >
            Login to Bid
          </button>
        </div>
      )}
    </div>
  )
}

export default GigDetail

