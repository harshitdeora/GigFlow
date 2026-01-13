# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm run install-all
```

This will install dependencies for:
- Root package (concurrently)
- Backend (Express, MongoDB, etc.)
- Frontend (React, Vite, etc.)

## Step 2: Configure Environment

Create `backend/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Note**: If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

## Step 3: Start MongoDB

### Local MongoDB
Make sure MongoDB is running on your system:
- Windows: MongoDB should be running as a service
- Mac: `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`

### MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in `backend/.env`

## Step 4: Run the Application

```bash
npm run dev
```

This starts both:
- Backend server on http://localhost:5000
- Frontend dev server on http://localhost:5173

## Step 5: Test the Application

1. Open http://localhost:5173 in your browser
2. Register a new account
3. Post a gig
4. Open another browser/incognito window and register as a different user
5. Submit a bid on the gig
6. Switch back to the first user and hire the freelancer
7. Check the second user's dashboard for the real-time notification!

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check your `MONGODB_URI` in `backend/.env`
- For Atlas: Whitelist your IP address in Atlas dashboard

### Port Already in Use
- Change `PORT` in `backend/.env`
- Or kill the process using the port

### CORS Errors
- Ensure `CLIENT_URL` in `backend/.env` matches your frontend URL
- Default is `http://localhost:5173`

### Socket.io Connection Issues
- Ensure backend is running before frontend
- Check browser console for connection errors
- Verify CORS settings in `backend/server.js`

## Notification Permissions

The app will request browser notification permissions when you first use it. This is required for real-time hire notifications.

