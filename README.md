# GigFlow - Mini Freelance Marketplace Platform

A full-stack freelance marketplace platform where clients can post jobs (Gigs) and freelancers can apply for them (Bids). Built with React, Node.js, Express, MongoDB, and Socket.io.

## Features

### Core Features
- ✅ **User Authentication**: Secure sign-up and login with JWT and HttpOnly cookies
- ✅ **Gig Management**: Browse, search, and post gigs
- ✅ **Bidding System**: Freelancers can submit bids on open gigs
- ✅ **Hiring Logic**: Clients can hire freelancers with atomic transactions
- ✅ **Real-time Notifications**: Socket.io integration for instant hire notifications

### Bonus Features
- ✅ **Transactional Integrity**: MongoDB transactions prevent race conditions
- ✅ **Real-time Updates**: Socket.io notifications when hired

## Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS (Dark theme with glow effects)
- Redux Toolkit (State management)
- Socket.io Client (Real-time updates)
- React Router (Navigation)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication (HttpOnly cookies)
- Socket.io (Real-time notifications)
- MongoDB Transactions (Race condition prevention)

## Project Structure

```
gigflow/
├── backend/
│   ├── models/          # Mongoose models (User, Gig, Bid)
│   ├── routes/          # API routes (auth, gigs, bids)
│   ├── middleware/      # Authentication middleware
│   └── server.js        # Express server with Socket.io
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── store/        # Redux store and slices
│   │   └── utils/        # Utilities (socket, axios)
│   └── ...
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
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
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
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

## API Endpoints

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

## Database Schema

### User
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)

### Gig
- `title`: String (required)
- `description`: String (required)
- `budget`: Number (required)
- `ownerId`: ObjectId (ref: User)
- `status`: String (enum: 'open', 'assigned')

### Bid
- `gigId`: ObjectId (ref: Gig)
- `freelancerId`: ObjectId (ref: User)
- `message`: String (required)
- `price`: Number (required)
- `status`: String (enum: 'pending', 'hired', 'rejected')

## Key Features Explained

### 1. Hiring Logic with Transactional Integrity
The hiring process uses MongoDB transactions to ensure atomicity:
- When a client hires a freelancer, all operations happen in a single transaction
- If two clients try to hire for the same gig simultaneously, only one will succeed
- The transaction ensures: gig status → 'assigned', chosen bid → 'hired', other bids → 'rejected'

### 2. Real-time Notifications
- Socket.io is integrated for real-time communication
- When a freelancer is hired, they receive an instant notification
- Notifications appear both in the UI and as browser notifications (if permitted)

### 3. Dark Theme with Glow Effects
- Custom dark theme with purple/indigo glow effects
- Smooth animations and transitions
- Modern, professional UI design

## Testing the Application

1. **Register/Login**: Create an account or login
2. **Post a Gig**: Navigate to "Post a Gig" and create a job posting
3. **Browse Gigs**: View all open gigs on the home page
4. **Search**: Use the search bar to find specific gigs
5. **Submit a Bid**: As a freelancer, submit a bid on an open gig
6. **Hire a Freelancer**: As a client, view bids and hire a freelancer
7. **Real-time Notification**: The hired freelancer will receive an instant notification

## Development Notes

- The application uses HttpOnly cookies for secure JWT storage
- CORS is configured for development (update for production)
- Socket.io rooms are used for user-specific notifications
- MongoDB transactions prevent race conditions in the hiring process

## Production Deployment

Before deploying to production:
1. Update `JWT_SECRET` to a strong, random value
2. Set `NODE_ENV=production`
3. Update CORS origins to your production domain
4. Use a production MongoDB instance (MongoDB Atlas)
5. Configure proper HTTPS for secure cookies
6. Update `CLIENT_URL` in backend `.env`

 

