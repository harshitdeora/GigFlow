import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { submitBid } from '../store/slices/bidSlice'

const BidForm = ({ onSubmit, onCancel }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.bids)
  const [formData, setFormData] = useState({
    message: '',
    price: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit(formData)
    setFormData({ message: '', price: '' })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-dark-text mb-2">Your Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-dark-text placeholder-dark-text-muted focus:outline-none focus:border-glow-primary focus:shadow-glow-sm transition-all resize-none"
          placeholder="Tell the client why you're the right fit..."
        />
      </div>

      <div>
        <label className="block text-dark-text mb-2">Your Price ($)</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-dark-text placeholder-dark-text-muted focus:outline-none focus:border-glow-primary focus:shadow-glow-sm transition-all"
          placeholder="Enter your bid amount"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-3 bg-glow-primary hover:bg-glow-secondary text-white rounded-lg transition-all shadow-glow-sm hover:shadow-glow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Bid'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-3 bg-dark-surface hover:bg-dark-border border border-dark-border text-dark-text rounded-lg transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default BidForm


