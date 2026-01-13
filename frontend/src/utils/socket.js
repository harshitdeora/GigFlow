import { io } from 'socket.io-client'

// Use environment variable for API URL, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const socket = io(API_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket', 'polling']
})

// Add connection event listeners for debugging
socket.on('connect', () => {
  console.log('✅ Socket.io connected:', socket.id)
})

socket.on('disconnect', (reason) => {
  console.log('❌ Socket.io disconnected:', reason)
})

socket.on('connect_error', (error) => {
  console.error('❌ Socket.io connection error:', error)
})

