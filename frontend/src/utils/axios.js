import axios from 'axios'

// Use environment variable for API URL, fallback to relative path (same domain)
const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

export default api

