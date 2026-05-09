# Deployment Guide - SkillSync AI

This guide will help you deploy the SkillSync AI application using Vercel (Frontend) and Railway (Backend).

## Prerequisites
- MongoDB Atlas account with connection string ready
- Groq API key (from https://console.groq.com)
- GitHub repository pushed (✓ Already done)
- Vercel account (https://vercel.com)
- Railway account (https://railway.app)

---

## Part 1: Deploy Backend on Railway

### Step 1: Create Railway Account & Connect GitHub
1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway to access your repositories

### Step 2: Create New Railway Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `fisble/SkyllSync-Ai`
4. Select "Backend" service deployment

### Step 3: Configure Environment Variables
In Railway dashboard, go to Variables and add:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skillsync?retryWrites=true&w=majority
GROQ_API_KEY=your_groq_api_key_here
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=production
```

### Step 4: Configure Root Directory
1. Go to "Settings"
2. Set "Root Directory" to `backend`
3. Save

### Step 5: Deploy
1. Railway will auto-deploy from GitHub
2. Once deployed, you'll get a URL like: `https://your-backend-name.up.railway.app`
3. **Copy this URL** - you'll need it for frontend configuration

**✓ Backend Live URL:** `https://your-backend-name.up.railway.app`

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
REACT_APP_API_URL=https://your-backend-name.up.railway.app/api
```

Replace `your-backend-name` with the actual Railway backend URL from Part 1.

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

Push the change to GitHub - Railway will auto-redeploy.

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

### Backend (Railway)
- [ ] MONGO_URI
- [ ] GROQ_API_KEY
- [ ] JWT_SECRET
- [ ] PORT=5000
- [ ] NODE_ENV=production

### Frontend (Vercel)
- [ ] REACT_APP_API_URL=https://your-railway-backend.up.railway.app/api

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
- **Backend API:** https://your-backend-name.up.railway.app
- **GitHub:** https://github.com/fisble/SkyllSync-Ai

---

## Troubleshooting

### "Cannot reach backend"
- Check REACT_APP_API_URL is correct in Vercel
- Verify CORS settings in backend
- Test API directly: `https://your-backend.up.railway.app/health`

### "MongoDB connection error"
- Verify MONGO_URI is correct
- Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for all IPs)
- Test connection locally first

### "Groq API error"
- Verify GROQ_API_KEY is valid
- Check Groq API status: https://status.groq.com

---

## Next Steps After Deployment
1. Test all features on the live application
2. Monitor logs in Railway and Vercel dashboards
3. Set up custom domain (optional)
4. Configure email notifications for deployments
5. Set up CI/CD for automatic deployments

