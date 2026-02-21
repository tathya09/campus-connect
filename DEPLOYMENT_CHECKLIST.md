# Deployment Checklist - Campus Connect

## ✅ Pre-Deployment Checklist

### Local Setup Complete

- [x] Git repository initialized
- [x] All files committed
- [x] .gitignore configured
- [x] README.md created
- [x] Environment variable examples created
- [ ] All features tested locally
- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173

### GitHub Setup

- [ ] GitHub account created
- [ ] New repository created on GitHub
- [ ] Repository connected to local
- [ ] Code pushed to GitHub
- [ ] README displays correctly
- [ ] Repository topics added
- [ ] Repository description added

### MongoDB Atlas Setup

- [ ] MongoDB Atlas account created
- [ ] Cluster created (free tier)
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] Connection string tested locally

### Cloudinary Setup

- [ ] Cloudinary account created
- [ ] Cloud name obtained
- [ ] API key obtained
- [ ] API secret obtained
- [ ] Credentials tested locally

## 📋 GitHub Push Steps

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `campus-connect`
3. Description: "Full-stack social media platform with AI-powered features"
4. Visibility: **Public** (recommended for portfolio)
5. **DO NOT** check "Initialize with README"
6. Click "Create repository"

### Step 2: Connect and Push

Run these commands in your terminal (replace YOUR_USERNAME):

```bash
git remote add origin https://github.com/YOUR_USERNAME/campus-connect.git
git branch -M main
git push -u origin main
```

**Example:**

```bash
git remote add origin https://github.com/johndoe/campus-connect.git
git branch -M main
git push -u origin main
```

### Step 3: Verify on GitHub

1. Refresh your GitHub repository page
2. Verify all files are present
3. Check README displays correctly
4. Verify .env files are NOT visible

## 🚀 Vercel Deployment Steps

### Backend Deployment

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Click "Import"

3. **Configure Backend**
   - Framework Preset: **Other**
   - Root Directory: **Backend**
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:

   ```
   PORT=3000
   MONGO_URL=your_mongodb_atlas_connection_string
   SECRET_KEY=your_jwt_secret_key
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   CLOUD_NAME=your_cloudinary_cloud_name
   URL=https://your-frontend-url.vercel.app
   ```

   **Note**: You'll update URL after frontend deployment

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the deployment URL (e.g., `https://campus-connect-backend.vercel.app`)

### Frontend Deployment

1. **Import Same Repository**
   - Click "Add New" → "Project"
   - Select same repository
   - Click "Import"

2. **Configure Frontend**
   - Framework Preset: **Vite**
   - Root Directory: **Frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variables**

   ```
   VITE_API_URL=https://your-backend-url.vercel.app
   ```

   Use the backend URL from previous step

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the deployment URL (e.g., `https://campus-connect.vercel.app`)

### Update Backend URL

1. Go back to backend deployment in Vercel
2. Settings → Environment Variables
3. Update `URL` variable with frontend URL
4. Redeploy backend (Deployments → ... → Redeploy)

## 🧪 Post-Deployment Testing

### Test These Features

- [ ] Open frontend URL
- [ ] Register new user
- [ ] Login with credentials
- [ ] Create post with image
- [ ] AI caption generation works
- [ ] AI hashtag suggestions work
- [ ] Like/unlike posts
- [ ] Add comments
- [ ] Bookmark posts
- [ ] Follow/unfollow users
- [ ] View followers/following lists
- [ ] Search users
- [ ] Send messages
- [ ] Real-time message delivery
- [ ] Online/offline status
- [ ] Explore page loads
- [ ] Profile page works
- [ ] Edit profile works

### Common Issues

**Issue: CORS Error**

- Solution: Verify URL environment variable in backend matches frontend URL exactly

**Issue: AI Not Working**

- Solution: Check browser console, verify Hugging Face API is accessible

**Issue: Images Not Uploading**

- Solution: Verify Cloudinary credentials in backend environment variables

**Issue: Socket.IO Not Connecting**

- Solution: Check backend logs, verify CORS settings

**Issue: Database Connection Failed**

- Solution: Verify MongoDB Atlas connection string, check network access settings

## 📝 Final Steps

### Update Repository

1. **Add Deployment URLs to README**
   - Edit README.md on GitHub
   - Add live demo links
   - Commit changes

2. **Add Topics**
   - Go to repository main page
   - Click gear icon next to "About"
   - Add: `react`, `nodejs`, `mongodb`, `ai`, `social-media`, `full-stack`, `socket-io`, `vercel`

3. **Create Release**
   - Go to "Releases" tab
   - Click "Create a new release"
   - Tag: `v1.0.0`
   - Title: "Campus Connect v1.0 - Initial Release"
   - Describe features
   - Publish release

### Share Your Project

- [ ] Add to LinkedIn profile
- [ ] Add to resume
- [ ] Share with friends
- [ ] Post on social media
- [ ] Add to portfolio website

## 🎯 Interview Preparation

- [ ] Review PROJECT_DOCUMENTATION.md
- [ ] Study INTERVIEW_PREPARATION_GUIDE.md
- [ ] Practice demo (10-12 minutes)
- [ ] Prepare to explain technical decisions
- [ ] Test all features before interview
- [ ] Have deployment URLs ready

## 📊 Success Metrics

Your deployment is successful when:

- ✅ Frontend loads without errors
- ✅ Backend API responds
- ✅ Database connection works
- ✅ Images upload to Cloudinary
- ✅ AI features work
- ✅ Real-time messaging works
- ✅ All features functional
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Fast load times

## 🎉 Congratulations!

Once all checkboxes are complete, your app is:

- ✅ Live on the internet
- ✅ Accessible to anyone
- ✅ Portfolio-ready
- ✅ Interview-ready
- ✅ Production-ready

**Next**: Share your achievement and prepare for interviews!

---

## Quick Reference

**GitHub Repository**: https://github.com/YOUR_USERNAME/campus-connect
**Frontend URL**: https://campus-connect.vercel.app
**Backend URL**: https://campus-connect-backend.vercel.app

**Test Credentials** (if using seed data):

- Email: john_smith@example.com
- Password: password123

---

**Need Help?**

- Check VERCEL_DEPLOYMENT_GUIDE.md for detailed instructions
- Review TROUBLESHOOTING.md for common issues
- Check Vercel deployment logs for errors
