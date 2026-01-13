import { io } from 'socket.io-client'

export const socket = io('http://localhost:5000', {
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

