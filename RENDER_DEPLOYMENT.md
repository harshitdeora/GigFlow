# Deploying GigFlow to Render.com

This guide will help you deploy your GigFlow application to Render.com.

## Prerequisites

1. A GitHub account with your GigFlow repository
2. A MongoDB Atlas account (free tier works)
3. A Render.com account (free tier available)

## Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (use `0.0.0.0/0` for Render)
5. Get your connection string (replace `<password>` with your password)

## Step 2: Deploy Backend Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `gigflow-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render automatically assigns port, but this is a fallback)
   - `MONGODB_URI` = Your MongoDB Atlas connection string
   - `JWT_SECRET` = A strong random string (generate one: `openssl rand -base64 32`)
   - `CLIENT_URL` = Your frontend URL (you'll get this after deploying frontend, e.g., `https://gigflow-frontend.onrender.com`)

6. Click **"Create Web Service"**

7. Wait for deployment to complete and note your backend URL (e.g., `https://gigflow-backend.onrender.com`)

## Step 3: Deploy Frontend Service

1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `gigflow-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Plan**: Free

4. Add Environment Variable:
   - `VITE_API_URL` = Your backend URL from Step 2 (e.g., `https://gigflow-backend.onrender.com`)

5. Click **"Create Static Site"**

6. Wait for deployment to complete and note your frontend URL

## Step 4: Update Backend CORS

1. Go back to your backend service in Render
2. Update the `CLIENT_URL` environment variable to your frontend URL
3. Add both URLs if needed (comma-separated): `https://gigflow-frontend.onrender.com,http://localhost:5173`
4. Redeploy the backend service

## Step 5: Update Frontend Socket URL

The frontend socket connection should automatically use the `VITE_API_URL` environment variable. If you need to update it, modify the environment variable in Render and redeploy.

## Environment Variables Summary

### Backend:
- `NODE_ENV` = `production`
- `PORT` = `10000`
- `MONGODB_URI` = Your MongoDB connection string
- `JWT_SECRET` = Strong random string
- `CLIENT_URL` = Your frontend URL

### Frontend:
- `VITE_API_URL` = Your backend URL

## Troubleshooting

### Backend won't start:
- Check that MongoDB URI is correct
- Verify all environment variables are set
- Check Render logs for errors

### Frontend can't connect to backend:
- Verify `VITE_API_URL` is set correctly
- Check CORS settings in backend
- Ensure backend URL in `CLIENT_URL` matches frontend URL

### Socket.io not working:
- Verify `VITE_API_URL` includes the protocol (https://)
- Check that CORS allows your frontend URL
- Check browser console for connection errors

## Free Tier Limitations

- Services may spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to paid plan for always-on services

## Custom Domain (Optional)

1. In Render dashboard, go to your service
2. Click **"Settings"** → **"Custom Domain"**
3. Add your domain and follow DNS instructions

## Notes

- Render free tier services spin down after inactivity
- First request after spin-down will be slow
- For production, consider using a paid plan for always-on services
- Keep your `.env` file local and never commit secrets to GitHub

