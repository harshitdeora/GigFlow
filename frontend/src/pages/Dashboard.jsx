import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { socket } from '../utils/socket'

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Listen for hire notifications
    const handleHired = (data) => {
      console.log('Dashboard received hired notification:', data)
      const notification = {
        id: Date.now(),
        type: 'hired',
        message: data.message,
        gig: data.gig,
        bid: data.bid,
        client: data.client,
        timestamp: new Date(data.timestamp || Date.now())
      }
      setNotifications(prev => [notification, ...prev])
    }

    // Listen for bid rejection notifications
    const handleBidRejected = (data) => {
      console.log('Dashboard received bid rejection notification:', data)
      const notification = {
        id: Date.now(),
        type: 'rejected',
        message: data.message,
        gig: data.gig,
        bid: data.bid,
        client: data.client,
        timestamp: new Date(data.timestamp || Date.now())
      }
      setNotifications(prev => [notification, ...prev])
    }

    socket.on('hired', handleHired)
    socket.on('bidRejected', handleBidRejected)

    return () => {
      socket.off('hired', handleHired)
      socket.off('bidRejected', handleBidRejected)
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-glow-primary to-glow-accent bg-clip-text text-transparent">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-dark-card border border-dark-border rounded-lg p-6 shadow-glow-md">
          <h2 className="text-xl font-semibold mb-4 text-dark-text">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/post-gig"
              className="block px-4 py-2 bg-glow-primary hover:bg-glow-secondary text-white rounded-lg transition-all text-center"
            >
              Post a New Gig
            </Link>
            <Link
              to="/my-gigs"
              className="block px-4 py-2 bg-dark-surface hover:bg-dark-border border border-dark-border text-dark-text rounded-lg transition-all text-center"
            >
              View My Gigs
            </Link>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-lg p-6 shadow-glow-md">
          <h2 className="text-xl font-semibold mb-4 text-dark-text">Profile</h2>
          <div className="space-y-2">
            <p className="text-dark-text-muted">
              <span className="text-dark-text">Name:</span> {user?.name}
            </p>
            <p className="text-dark-text-muted">
              <span className="text-dark-text">Email:</span> {user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-lg p-6 shadow-glow-md">
        <h2 className="text-xl font-semibold mb-4 text-dark-text">Notifications</h2>
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <p className="text-dark-text-muted">No new notifications</p>
          ) : (
            notifications.map((notification) => {
              const isRejected = notification.type === 'rejected'
              const borderColor = isRejected ? 'border-red-500' : 'border-glow-primary'
              const textColor = isRejected ? 'text-red-400' : 'text-glow-primary'
              
              return (
                <div
                  key={notification.id}
                  className={`bg-dark-surface border-2 ${borderColor} rounded-lg p-4 shadow-glow-md hover:shadow-glow-lg transition-all`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{isRejected ? '❌' : '🎉'}</span>
                    <p className={`text-dark-text font-bold ${textColor} text-lg`}>
                      {isRejected ? 'Bid Rejected' : "You've been hired!"}
                    </p>
                  </div>
                  <p className="text-dark-text text-sm mb-3">{notification.message}</p>
                  {notification.gig && (
                    <div className="bg-dark-card rounded p-3 mb-3">
                      <p className="text-dark-text font-semibold text-xs mb-1">Project:</p>
                      <p className={`font-semibold ${textColor}`}>{notification.gig.title}</p>
                      {notification.bid && (
                        <p className="text-dark-text-muted text-xs mt-2">
                          Your bid: <span className={`font-semibold ${textColor}`}>
                            ${notification.bid.price?.toLocaleString()}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                  {notification.client && (
                    <p className="text-dark-text-muted text-xs mb-2">
                      Client: <span className="text-glow-secondary">{notification.client.name}</span>
                    </p>
                  )}
                  <p className="text-dark-text-muted text-xs">
                    {notification.timestamp.toLocaleString()}
                  </p>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

