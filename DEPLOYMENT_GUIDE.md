# Deployment Guide - SkillSync AI

This guide will help you deploy the SkillSync AI application using Vercel (Frontend) and Render (Backend).

## Prerequisites
- MongoDB Atlas account with connection string ready
- Groq API key (from https://console.groq.com)
- GitHub repository pushed (✓ Already done)
- Vercel account (https://vercel.com)
- Render account (https://render.com)

---

## Part 1: Deploy Backend on Render

### Step 1: Create Render Account & Connect GitHub
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 2: Create New Web Service
1. Click "New +"
2. Select "Web Service"
3. Choose your repository: `fisble/SkyllSync-Ai`
4. Continue

### Step 3: Configure Deployment Settings
Fill in these settings:
- **Name:** `skillsync-ai-backend` (or your preferred name)
- **Environment:** `Node`
- **Build Command:** `cd backend && npm install`
- **Start Command:** `node backend/server.js`
- **Root Directory:** Leave empty (Render will use the root)
- **Region:** Select your closest region

### Step 4: Configure Environment Variables
Click "Advanced" and add environment variables:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skillsync?retryWrites=true&w=majority
GROQ_API_KEY=your_groq_api_key_here
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=production
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Render will auto-deploy from GitHub (takes 3-5 minutes)
3. Once deployed, you'll get a URL like: `https://skillsync-ai-backend.onrender.com`
4. **Copy this URL** - you'll need it for frontend configuration

**✓ Backend Live URL:** `https://skillsync-ai-backend.onrender.com`

### Note: Render Free Tier
- Spins down after 15 min of inactivity
- First request may take 30-50 seconds to wake up
- Perfect for testing and small projects
- Upgrade to paid if you need always-on performance

---

## Part 2: Deploy Frontend on Vercel

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### Step 2: Import Project
1. Click "Add New"
2. Select "Project"
3. Choose repository: `fisble/SkyllSync-Ai`
4. Continue

### Step 3: Configure Project
1. **Framework Preset:** React
2. **Root Directory:** `frontend`
3. **Build Command:** `npm run build` (leave default)
4. **Output Directory:** `build` (leave default)

### Step 4: Environment Variables
Add these environment variables in Vercel dashboard:

```
REACT_APP_API_URL=https://skillsync-ai-backend.onrender.com/api
```

Replace `skillsync-ai-backend` with your actual Render service name from Part 1.

### Step 5: Deploy
1. Click "Deploy"
2. Wait for deployment to complete (usually 2-3 minutes)
3. You'll get a URL like: `https://skillsync-ai.vercel.app`

**✓ Frontend Live URL:** `https://skillsync-ai.vercel.app`

---

## Part 3: Update Backend CORS Settings (Important!)

The backend's CORS settings need to allow requests from your Vercel frontend.

Go to your repository and update `backend/server.js`:

```javascript
app.use(cors({
  origin: 'https://your-vercel-frontend-url.vercel.app',
  credentials: true
}));
```

Or allow all in development:
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-vercel-frontend-url.vercel.app'
    : '*'
}));
```

Push the change to GitHub - Render will auto-redeploy.

---

## Part 4: Test the Deployment

1. Go to your frontend URL: `https://skillsync-ai.vercel.app`
2. Try to:
   - Register a new user
   - Login
   - Upload a resume/PDF
   - View analysis results

If you see errors, check:
- MongoDB connection is working
- Environment variables are set correctly
- Groq API key is valid
- CORS is properly configured

---

## Environment Variables Checklist

### Backend (Render)
- [ ] MONGO_URI
- [ ] GROQ_API_KEY
- [ ] JWT_SECRET
- [ ] PORT=5000
- [ ] NODE_ENV=production

### Frontend (Vercel)
- [ ] REACT_APP_API_URL=https://skillsync-ai-backend.onrender.com/api

---

## Getting Your Keys

### MongoDB Atlas Connection String
1. Go to https://www.mongodb.com/cloud/atlas
2. Login to your cluster
3. Click "Connect"
4. Copy the connection string
5. Replace `<password>` with your database password

### Groq API Key
1. Go to https://console.groq.com
2. Create an API key
3. Copy and save it

---

## Live URLs (Once Deployed)
- **Frontend:** https://skillsync-ai.vercel.app
- **Backend API:** https://skillsync-ai-backend.onrender.com
- **GitHub:** https://github.com/fisble/SkyllSync-Ai

---

## Troubleshooting

### "Cannot reach backend"
- Check REACT_APP_API_URL is correct in Vercel
- Verify CORS settings in backend
- Test API directly: `https://skillsync-ai-backend.onrender.com/` (should show "SkillSync AI Server is running")
- Note: Render free tier spins down after 15 min, first request may take 30-50 seconds

### "MongoDB connection error"
- Verify MONGO_URI is correct
- Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for all IPs)
- Test connection locally first

### "Groq API error"
- Verify GROQ_API_KEY is valid
- Check Groq API status: https://status.groq.com

### "Backend URL is sleeping"
- Render free tier automatically spins down after 15 minutes of inactivity
- First request will take 30-50 seconds to wake up
- This is normal and free - upgrade to paid for always-on availability

---

## Next Steps After Deployment
1. Test all features on the live application
2. Monitor logs in Render and Vercel dashboards
3. Set up custom domain (optional)
4. Configure email notifications for deployments
5. Set up CI/CD for automatic deployments

