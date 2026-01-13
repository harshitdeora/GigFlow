import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Fetch gigs
export const fetchGigs = createAsyncThunk(
  'gigs/fetchGigs',
  async (search = '', { rejectWithValue }) => {
    try {
      const url = search ? `/api/gigs?search=${encodeURIComponent(search)}` : '/api/gigs'
      const response = await axios.get(url)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gigs')
    }
  }
)

// Create gig
export const createGig = createAsyncThunk(
  'gigs/createGig',
  async ({ title, description, budget }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        '/api/gigs',
        { title, description, budget },
        { withCredentials: true }
      )
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create gig')
    }
  }
)

// Get single gig
export const fetchGig = createAsyncThunk(
  'gigs/fetchGig',
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/gigs/${gigId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gig')
    }
  }
)

const gigSlice = createSlice({
  name: 'gigs',
  initialState: {
    gigs: [],
    currentGig: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentGig: (state) => {
      state.currentGig = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch gigs
      .addCase(fetchGigs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGigs.fulfilled, (state, action) => {
        state.loading = false
        state.gigs = action.payload
      })
      .addCase(fetchGigs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create gig
      .addCase(createGig.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.loading = false
        state.gigs.unshift(action.payload)
      })
      .addCase(createGig.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch single gig
      .addCase(fetchGig.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGig.fulfilled, (state, action) => {
        state.loading = false
        state.currentGig = action.payload
      })
      .addCase(fetchGig.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentGig } = gigSlice.actions
export default gigSlice.reducer



