# Render Deployment Fix Instructions

## Current Issue
The deployment is failing because:
1. Build command is running from root instead of backend directory
2. Start command can't find the start script

## Solution: Update Render Settings

Go to your Render service settings and update these fields:

### Root Directory
**Keep as:** `backend`

### Build Command
**Change to:** `npm install`
(Since Root Directory is set to `backend`, this will run `npm install` in the backend folder)

### Start Command  
**Change to:** `npm start`
(Since Root Directory is set to `backend`, this will run `npm start` from backend/package.json)

## Alternative Solution (If Root Directory doesn't work)

If the Root Directory setting isn't working, try this:

### Root Directory
**Leave empty** (remove `backend`)

### Build Command
**Change to:** `cd backend && npm install`

### Start Command
**Change to:** `cd backend && npm start`

## After Making Changes

1. Save the settings
2. Render will automatically trigger a new deployment
3. Check the logs to verify it's working

## Verify Environment Variables

Make sure you have these set:
- `NODE_ENV` = `production`
- `PORT` = `10000`
- `MONGODB_URI` = Your MongoDB connection string
- `JWT_SECRET` = A strong random string
- `CLIENT_URL` = Your frontend URL (or placeholder for now)

