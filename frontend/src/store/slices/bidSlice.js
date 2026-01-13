import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Submit bid
export const submitBid = createAsyncThunk(
  'bids/submitBid',
  async ({ gigId, message, price }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        '/api/bids',
        { gigId, message, price },
        { withCredentials: true }
      )
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit bid')
    }
  }
)

// Fetch bids for a gig
export const fetchBids = createAsyncThunk(
  'bids/fetchBids',
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/bids/${gigId}`, {
        withCredentials: true
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bids')
    }
  }
)

// Hire freelancer
export const hireFreelancer = createAsyncThunk(
  'bids/hireFreelancer',
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/api/bids/${bidId}/hire`,
        {},
        { withCredentials: true }
      )
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to hire freelancer')
    }
  }
)

// Reject bid
export const rejectBid = createAsyncThunk(
  'bids/rejectBid',
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/api/bids/${bidId}/reject`,
        {},
        { withCredentials: true }
      )
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject bid')
    }
  }
)

const bidSlice = createSlice({
  name: 'bids',
  initialState: {
    bids: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearBids: (state) => {
      state.bids = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit bid
      .addCase(submitBid.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(submitBid.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(submitBid.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch bids
      .addCase(fetchBids.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBids.fulfilled, (state, action) => {
        state.loading = false
        state.bids = action.payload
      })
      .addCase(fetchBids.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Hire freelancer
      .addCase(hireFreelancer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(hireFreelancer.fulfilled, (state, action) => {
        state.loading = false
        // Update bid status in the list
        const bidIndex = state.bids.findIndex(bid => bid._id === action.payload.bid._id)
        if (bidIndex !== -1) {
          state.bids[bidIndex] = action.payload.bid
        }
      })
      .addCase(hireFreelancer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Reject bid
      .addCase(rejectBid.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(rejectBid.fulfilled, (state, action) => {
        state.loading = false
        // Update bid status in the list
        const bidIndex = state.bids.findIndex(bid => bid._id === action.payload.bid._id)
        if (bidIndex !== -1) {
          state.bids[bidIndex] = action.payload.bid
        }
      })
      .addCase(rejectBid.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearBids } = bidSlice.actions
export default bidSlice.reducer

