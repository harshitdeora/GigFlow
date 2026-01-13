# GigFlow - Freelance Marketplace Platform

A full-stack freelance marketplace platform where clients can post jobs (Gigs) and freelancers can apply for them (Bids). Built with React, Node.js, Express, MongoDB, and Socket.io.

![GigFlow](https://img.shields.io/badge/GigFlow-Freelance%20Marketplace-blue)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-22.16.0-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0.3-47A248?logo=mongodb)

## ✨ Features

### Core Features
- 🔐 **User Authentication** - Secure sign-up and login with JWT and HttpOnly cookies
- 💼 **Gig Management** - Browse, search, and post gigs
- 💰 **Bidding System** - Freelancers can submit bids on open gigs
- ✅ **Hiring Logic** - Clients can hire freelancers with atomic transactions
- 🔔 **Real-time Notifications** - Socket.io integration for instant hire notifications
- 🎨 **Dark Theme UI** - Modern dark theme with beautiful glow effects

### Advanced Features
- 🔒 **Transactional Integrity** - MongoDB transactions prevent race conditions
- ⚡ **Real-time Updates** - Socket.io notifications when hired or rejected
- 🔍 **Search & Filter** - Search gigs by title
- 📊 **Bid Management** - View and manage bids for your gigs

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite) - Modern React with fast HMR
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **Socket.io Client** - Real-time communication
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **Socket.io** - Real-time WebSocket communication
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gigflow.git
   cd gigflow
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```
   Or install separately:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Configure environment variables**
   
   Create `backend/.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/gigflow
   JWT_SECRET=your_super_secret_jwt_key_change_this
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGODB_URI` in `.env`.

5. **Run the application**
   
   Start both backend and frontend:
   ```bash
   npm run dev
   ```
   
   Or run separately:
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
gigflow/
├── backend/
│   ├── models/          # Mongoose models (User, Gig, Bid)
│   ├── routes/          # API routes (auth, gigs, bids)
│   ├── middleware/      # Authentication middleware
│   ├── server.js       # Express server with Socket.io
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store and slices
│   │   └── utils/       # Utilities (socket, axios)
│   ├── public/
│   └── package.json
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login & set HttpOnly cookie
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Gigs
- `GET /api/gigs` - Fetch all open gigs (with optional `?search=query`)
- `GET /api/gigs/:id` - Get single gig
- `POST /api/gigs` - Create a new gig (authenticated)

### Bids
- `POST /api/bids` - Submit a bid for a gig (authenticated)
- `GET /api/bids/:gigId` - Get all bids for a gig (owner only)
- `PATCH /api/bids/:bidId/hire` - Hire a freelancer (atomic transaction)
- `PATCH /api/bids/:bidId/reject` - Reject a bid

## 🗄️ Database Schema

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed)
}
```

### Gig
```javascript
{
  title: String (required),
  description: String (required),
  budget: Number (required),
  ownerId: ObjectId (ref: User),
  status: String (enum: 'open', 'assigned')
}
```

### Bid
```javascript
{
  gigId: ObjectId (ref: Gig),
  freelancerId: ObjectId (ref: User),
  message: String (required),
  price: Number (required),
  status: String (enum: 'pending', 'hired', 'rejected')
}
```

## 🎯 Key Features Explained

### Hiring Logic with Transactional Integrity
The hiring process uses MongoDB transactions to ensure atomicity:
- When a client hires a freelancer, all operations happen in a single transaction
- If two clients try to hire for the same gig simultaneously, only one will succeed
- The transaction ensures: gig status → 'assigned', chosen bid → 'hired', other bids → 'rejected'

### Real-time Notifications
- Socket.io is integrated for real-time communication
- When a freelancer is hired, they receive an instant notification
- Notifications appear both in the UI and as browser notifications (if permitted)

## 🧪 Testing the Application

1. **Register/Login**: Create an account or login
2. **Post a Gig**: Navigate to "Post a Gig" and create a job posting
3. **Browse Gigs**: View all open gigs on the home page
4. **Search**: Use the search bar to find specific gigs
5. **Submit a Bid**: As a freelancer, submit a bid on an open gig
6. **Hire a Freelancer**: As a client, view bids and hire a freelancer
7. **Real-time Notification**: The hired freelancer will receive an instant notification

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for the blazing fast build tool
- MongoDB for the flexible database
- Socket.io for real-time capabilities

---

⭐ If you like this project, give it a star!
