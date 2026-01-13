import { useSelector } from 'react-redux'

const BidList = ({ bids, onHire, onReject }) => {
  const { loading } = useSelector((state) => state.bids)

  const getStatusColor = (status) => {
    switch (status) {
      case 'hired':
        return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/50'
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
    }
  }

  return (
    <div className="space-y-4">
      {bids.map((bid) => (
        <div
          key={bid._id}
          className="bg-dark-surface border border-dark-border rounded-lg p-6 hover:border-glow-primary transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-dark-text">
                {bid.freelancerId?.name || 'Unknown'}
              </h3>
              <p className="text-dark-text-muted text-sm">{bid.freelancerId?.email}</p>
            </div>
            <div className="text-right">
              <span className="text-glow-primary font-bold text-xl">
                ${bid.price.toLocaleString()}
              </span>
              <span className={`block mt-2 px-3 py-1 rounded-full text-sm border ${getStatusColor(bid.status)}`}>
                {bid.status}
              </span>
            </div>
          </div>

          <p className="text-dark-text-muted mb-4 whitespace-pre-wrap">{bid.message}</p>

          {bid.status === 'pending' && (
            <div className="flex gap-3">
              <button
                onClick={() => onHire(bid._id)}
                disabled={loading}
                className="px-4 py-2 bg-glow-primary hover:bg-glow-secondary text-white rounded-lg transition-all shadow-glow-sm hover:shadow-glow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Hiring...' : 'Hire This Freelancer'}
              </button>
              <button
                onClick={() => onReject(bid._id)}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/50"
              >
                {loading ? 'Rejecting...' : 'Reject Bid'}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default BidList

