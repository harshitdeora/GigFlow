import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createGig, clearError } from '../store/slices/gigSlice'

const PostGig = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.gigs)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
  })

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
    const result = await dispatch(
      createGig({
        ...formData,
        budget: parseFloat(formData.budget),
      })
    )
    if (createGig.fulfilled.match(result)) {
      navigate(`/gig/${result.payload._id}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-glow-primary to-glow-accent bg-clip-text text-transparent">
        Post a New Gig
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border rounded-lg p-8 shadow-glow-md">
        <div className="space-y-4">
          <div>
            <label className="block text-dark-text mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-dark-text placeholder-dark-text-muted focus:outline-none focus:border-glow-primary focus:shadow-glow-sm transition-all"
              placeholder="Enter gig title"
            />
          </div>

          <div>
            <label className="block text-dark-text mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-dark-text placeholder-dark-text-muted focus:outline-none focus:border-glow-primary focus:shadow-glow-sm transition-all resize-none"
              placeholder="Describe your project in detail..."
            />
          </div>

          <div>
            <label className="block text-dark-text mb-2">Budget ($)</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-dark-text placeholder-dark-text-muted focus:outline-none focus:border-glow-primary focus:shadow-glow-sm transition-all"
              placeholder="Enter budget amount"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-glow-primary hover:bg-glow-secondary text-white rounded-lg transition-all shadow-glow-sm hover:shadow-glow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : 'Post Gig'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PostGig


