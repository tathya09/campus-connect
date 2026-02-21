# Complete Vercel Deployment Guide for Campus Connect

## 🚨 IMPORTANT: The 404 Error You're Seeing

The 404 error happens because:

1. **CORS is blocking your frontend** - Backend only allows `http://localhost:5173`
2. **You need to deploy Backend and Frontend as TWO SEPARATE projects**
3. **Environment variables need to be configured on Vercel**

I've just fixed the CORS issue in `Backend/server.js` - it now reads from the `URL` environment variable.

---

## 📋 Prerequisites

You already have:

- ✅ MongoDB Atlas connection string
- ✅ Cloudinary credentials
- ✅ Code pushed to GitHub
- ✅ Vercel account

---

## 🎯 Step-by-Step Deployment

### STEP 1: Deploy Backend First

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import Your GitHub Repository**
   - Select your `campus-connect` repository
   - Click "Import"

3. **Configure Backend Project**
   - **Project Name**: `campus-connect-backend` (or any name you want)
   - **Framework Preset**: Other
   - **Root Directory**: Click "Edit" → Select `Backend` folder
   - **Build Command**: Leave empty (not needed for Node.js)
   - **Output Directory**: Leave empty

4. **Add Environment Variables** (Click "Environment Variables")

   ```
   PORT = 3000
   MONGO_URL = mongodb+srv://tathyajha01:Shopmo@cluster0.wwerswk.mongodb.net/Chat-bot
   SECRET_KEY = Pencil
   API_KEY = 922671917482668
   API_SECRET = 2WO8JfDrGOFLnvaimemvwpuuCD8
   CLOUD_NAME = dfsbyn21o
   URL = https://campus-connect-frontend.vercel.app
   ```

   **⚠️ IMPORTANT**: For `URL`, use a placeholder like `https://campus-connect-frontend.vercel.app` for now. You'll update this after deploying the frontend.

5. **Click "Deploy"**
   - Wait for deployment to complete (2-3 minutes)
   - Copy your backend URL (e.g., `https://campus-connect-backend.vercel.app`)

---

### STEP 2: Deploy Frontend

1. **Go Back to Vercel Dashboard**
   - Click "Add New" → "Project"
   - Select your `campus-connect` repository again

2. **Configure Frontend Project**
   - **Project Name**: `campus-connect-frontend` (or any name you want)
   - **Framework Preset**: Vite
   - **Root Directory**: Click "Edit" → Select `Frontend` folder
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

3. **Add Environment Variable**

   ```
   VITE_API_URL = https://campus-connect-backend.vercel.app
   ```

   **⚠️ IMPORTANT**: Replace with YOUR actual backend URL from Step 1

4. **Click "Deploy"**
   - Wait for deployment to complete (2-3 minutes)
   - Copy your frontend URL (e.g., `https://campus-connect-frontend.vercel.app`)

---

### STEP 3: Update Backend URL Environment Variable

This is CRITICAL to fix CORS errors!

1. **Go to Backend Project on Vercel**
   - Dashboard → Select your backend project
   - Go to "Settings" → "Environment Variables"

2. **Update the URL Variable**
   - Find the `URL` variable
   - Click "Edit"
   - Change value to your ACTUAL frontend URL: `https://campus-connect-frontend.vercel.app`
   - Click "Save"

3. **Redeploy Backend**
   - Go to "Deployments" tab
   - Click the three dots (•••) on the latest deployment
   - Click "Redeploy"
   - Wait for redeployment to complete

---

### STEP 4: Test Your Deployment

1. **Visit Your Frontend URL**
   - Open `https://campus-connect-frontend.vercel.app` (your actual URL)

2. **Test Login**
   - Email: `john_smith@example.com`
   - Password: `password123`

3. **Check if Everything Works**
   - ✅ Can you log in?
   - ✅ Can you see posts?
   - ✅ Can you create a post?
   - ✅ Can you chat with users?
   - ✅ Does AI caption generation work?

---

## 🔧 Troubleshooting

### Issue: Still Getting 404 Errors

**Solution**: Make sure you selected the correct root directory:

- Backend project → Root Directory = `Backend`
- Frontend project → Root Directory = `Frontend`

### Issue: CORS Errors in Browser Console

**Solution**:

1. Check that backend `URL` environment variable matches your frontend URL EXACTLY
2. Make sure you redeployed backend after updating the URL
3. Check browser console for the exact error message

### Issue: "Cannot connect to server"

**Solution**:

1. Check backend deployment logs: Dashboard → Backend Project → Deployments → View Function Logs
2. Make sure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
3. Verify all environment variables are set correctly

### Issue: Images Not Uploading

**Solution**:

1. Verify Cloudinary credentials in backend environment variables
2. Check backend logs for Cloudinary errors
3. Make sure API_KEY, API_SECRET, and CLOUD_NAME are correct

---

## 📝 Quick Reference

### Your Environment Variables

**Backend (7 variables)**:

```
PORT = 3000
MONGO_URL = mongodb+srv://tathyajha01:Shopmo@cluster0.wwerswk.mongodb.net/Chat-bot
SECRET_KEY = Pencil
API_KEY = 922671917482668
API_SECRET = 2WO8JfDrGOFLnvaimemvwpuuCD8
CLOUD_NAME = dfsbyn21o
URL = https://your-frontend-url.vercel.app
```

**Frontend (1 variable)**:

```
VITE_API_URL = https://your-backend-url.vercel.app
```

### Test Credentials

Any of the 55 seeded users work:

- Email: `john_smith@example.com`
- Password: `password123`

---

## ✅ Deployment Checklist

- [ ] Backend deployed with correct root directory (`Backend`)
- [ ] Backend has all 7 environment variables
- [ ] Frontend deployed with correct root directory (`Frontend`)
- [ ] Frontend has VITE_API_URL pointing to backend
- [ ] Backend URL variable updated with frontend URL
- [ ] Backend redeployed after URL update
- [ ] Login works
- [ ] Posts load correctly
- [ ] Chat functionality works
- [ ] AI features work
- [ ] Image uploads work

---

## 🎉 After Successful Deployment

Your app will be live at:

- **Frontend**: `https://your-frontend-url.vercel.app`
- **Backend API**: `https://your-backend-url.vercel.app`

You can share the frontend URL with anyone to showcase your project!

---

## 💡 Pro Tips

1. **Custom Domain**: You can add a custom domain in Vercel project settings
2. **Automatic Deployments**: Every push to GitHub will auto-deploy
3. **Preview Deployments**: Every PR gets its own preview URL
4. **Environment Variables**: You can have different variables for production/preview/development
5. **Logs**: Check Function Logs in Vercel dashboard to debug issues

---

## 🚀 Next Steps After Deployment

1. Test all features thoroughly
2. Share the link with friends/recruiters
3. Add the live URL to your resume
4. Update GitHub README with live demo link
5. Consider adding analytics (Google Analytics, Vercel Analytics)

---

Need help? Check the error logs in Vercel dashboard or ask me!
