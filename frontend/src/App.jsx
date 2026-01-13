import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUser } from './store/slices/authSlice'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import GigDetail from './pages/GigDetail'
import PostGig from './pages/PostGig'
import MyGigs from './pages/MyGigs'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Notification from './components/Notification'
import { socket } from './utils/socket'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  useEffect(() => {
    // Get current user on app load
    dispatch(getCurrentUser())
  }, [dispatch])

  useEffect(() => {
    // Connect to socket when authenticated
    if (isAuthenticated && user) {
      // Ensure socket is connected
      if (!socket.connected) {
        socket.connect()
      }
      
      // Join user-specific room for notifications
      const roomName = `user_${user.id}`
      socket.emit('join', roomName)
      console.log(`Joined socket room: ${roomName}`)

      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission()
      }

      // Log socket connection status
      socket.on('connect', () => {
        console.log('Socket connected, joining room:', roomName)
        socket.emit('join', roomName)
      })

      socket.on('disconnect', () => {
        console.log('Socket disconnected')
      })

      return () => {
        socket.off('connect')
        socket.off('disconnect')
        socket.off('hired')
        socket.off('bidRejected')
        if (socket.connected) {
          socket.disconnect()
        }
      }
    } else {
      // Disconnect socket when not authenticated
      if (socket.connected) {
        socket.disconnect()
      }
    }
  }, [isAuthenticated, user, dispatch])

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <Notification />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gig/:id" element={<GigDetail />} />
        <Route
          path="/post-gig"
          element={
            <ProtectedRoute>
              <PostGig />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-gigs"
          element={
            <ProtectedRoute>
              <MyGigs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App

