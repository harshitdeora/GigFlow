import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { socket } from '../utils/socket'

const Notification = () => {
  const [notifications, setNotifications] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Listen for hire notifications
    const handleHired = (data) => {
      console.log('Received hired notification:', data)
      
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

      // Show browser notification
      if (window.Notification && Notification.permission === 'granted') {
        const browserNotification = new Notification('🎉 You\'ve been hired!', {
          body: data.message,
          icon: '/vite.svg',
          badge: '/vite.svg',
          tag: `hired-${data.gig?.id}`,
          requireInteraction: false
        })
        
        // Navigate to gig detail when notification is clicked
        browserNotification.onclick = () => {
          window.focus()
          if (data.gig?.id) {
            navigate(`/gig/${data.gig.id}`)
          }
          browserNotification.close()
        }
      }

      // Auto-remove notification after 10 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id))
      }, 10000)
    }

    // Listen for bid rejection notifications
    const handleBidRejected = (data) => {
      console.log('Received bid rejection notification:', data)
      
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

      // Show browser notification
      if (window.Notification && Notification.permission === 'granted') {
        const browserNotification = new Notification('❌ Bid Rejected', {
          body: data.message,
          icon: '/vite.svg',
          badge: '/vite.svg',
          tag: `rejected-${data.gig?.id}`,
          requireInteraction: false
        })
        
        // Navigate to gig detail when notification is clicked
        browserNotification.onclick = () => {
          window.focus()
          if (data.gig?.id) {
            navigate(`/gig/${data.gig.id}`)
          }
          browserNotification.close()
        }
      }

      // Auto-remove notification after 10 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id))
      }, 10000)
    }

    socket.on('hired', handleHired)
    socket.on('bidRejected', handleBidRejected)

    return () => {
      socket.off('hired', handleHired)
      socket.off('bidRejected', handleBidRejected)
    }
  }, [navigate])

  if (notifications.length === 0) return null

  const handleNotificationClick = (gigId) => {
    if (gigId) {
      navigate(`/gig/${gigId}`)
    }
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => {
        const isRejected = notification.type === 'rejected'
        const borderColor = isRejected ? 'border-red-500' : 'border-glow-primary'
        const shadowColor = isRejected ? 'shadow-red-500/20' : 'shadow-glow-lg'
        
        return (
          <div
            key={notification.id}
            className={`bg-dark-card border-2 ${borderColor} rounded-lg p-4 ${shadowColor} animate-glow cursor-pointer hover:shadow-glow-md transition-all`}
            onClick={() => handleNotificationClick(notification.gig?.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{isRejected ? '❌' : '🎉'}</span>
                  <h4 className={`font-bold text-lg ${isRejected ? 'text-red-400' : 'text-glow-primary'}`}>
                    {isRejected ? 'Bid Rejected' : "You've been hired!"}
                  </h4>
                </div>
                <p className="text-dark-text text-sm mb-2">{notification.message}</p>
                {notification.gig && (
                  <div className="bg-dark-surface rounded p-2 mb-2">
                    <p className="text-dark-text font-semibold text-xs mb-1">Project Details:</p>
                    <p className={`text-sm font-semibold ${isRejected ? 'text-red-400' : 'text-glow-primary'}`}>
                      {notification.gig.title}
                    </p>
                    {notification.bid && (
                      <p className="text-dark-text-muted text-xs mt-1">
                        Your bid: <span className={`font-semibold ${isRejected ? 'text-red-400' : 'text-glow-primary'}`}>
                          ${notification.bid.price?.toLocaleString()}
                        </span>
                      </p>
                    )}
                  </div>
                )}
                {notification.client && (
                  <p className="text-dark-text-muted text-xs">
                    Client: <span className="text-glow-secondary">{notification.client.name}</span>
                  </p>
                )}
                <p className="text-dark-text-muted text-xs mt-2">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setNotifications(prev => prev.filter(n => n.id !== notification.id))
                }}
                className="text-dark-text-muted hover:text-red-400 ml-2 text-xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Notification

