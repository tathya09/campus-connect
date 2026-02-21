# Troubleshooting Guide - Campus Connect

## 🐛 Common Issues and Solutions

### Issue 1: "User not found" when clicking Follow

**Symptoms**:

- Click follow button
- Get "User not found" error
- 400 Bad Request in console

**Possible Causes**:

1. User session expired after running seed script
2. Authentication token invalid
3. User ID mismatch

**Solutions**:

#### Solution A: Re-login (MOST COMMON)

1. Click "Logout" in sidebar
2. Login again with: `john_smith@example.com` / `password123`
3. Try follow button again

#### Solution B: Clear Browser Data

1. Open browser DevTools (F12)
2. Go to Application tab
3. Clear all cookies
4. Clear local storage
5. Refresh page
6. Login again

#### Solution C: Check Backend Logs

1. Look at backend terminal
2. Check for "Follow request:" log
3. Check if both user IDs are shown
4. If one is undefined, authentication issue

**Debug Steps**:

```bash
# In backend terminal, you should see:
Follow request: {
  followKrneWala: '507f1f77bcf86cd799439011',
  jiskoFollowKrunga: '507f191e810c19729de860ea'
}
Users found: {
  userFound: true,
  targetUserFound: true
}
```

---

### Issue 2: Can't Save Posts (Bookmark)

**Symptoms**:

- Click bookmark icon
- Nothing happens or error appears

**Solutions**:

#### Check if Bookmark is Working:

1. Click the bookmark icon on any post
2. Check browser console for errors
3. Check backend terminal for logs

#### If Getting Error:

1. Make sure you're logged in
2. Check if post ID is valid
3. Try refreshing the page

#### Test Bookmark:

1. Go to Home feed
2. Find any post
3. Click the bookmark icon (looks like a ribbon)
4. Should see success toast
5. Go to your profile
6. Click "SAVED" tab
7. Should see bookmarked post

---

### Issue 3: Can't Find AI Feature

**Where is the AI Feature?**

The AI Caption Suggestions appear in the **Create Post Dialog**.

**Step-by-Step to See AI Feature**:

1. **Click "Create" in Sidebar**
   - Look for the + icon (PlusSquare)
   - It's the 6th item in the sidebar
   - Click it

2. **Dialog Opens**
   - You'll see "Create New Post" at the top
   - Your profile picture and username
   - A text area for caption

3. **Upload an Image**
   - Click "Select from computer" button (blue button)
   - Choose any image from your computer
   - Wait for image to upload

4. **AI Suggestions Appear**
   - **AUTOMATICALLY** after image uploads
   - Look for section with sparkle icon (✨)
   - Says "AI Caption Suggestions"
   - Shows 4 gradient cards with suggestions

5. **Use a Suggestion**
   - Click any of the 4 suggestion cards
   - Caption field fills automatically
   - Toast notification says "Caption applied!"

6. **Generate More**
   - Click "Generate new suggestions" link
   - Wait 0.8 seconds
   - Get 4 new suggestions

**Visual Indicators**:

- ✨ Sparkle icon = AI feature
- Purple/pink gradient cards = Suggestions
- "AI Caption Suggestions" header

**If You Don't See It**:

1. Make sure you uploaded an image first
2. Wait 0.8 seconds after upload
3. Scroll down in the dialog
4. Check if CreatePost.jsx was updated correctly

---

### Issue 4: Posts Not Loading

**Symptoms**:

- Home feed is empty
- No posts showing

**Solutions**:

#### Re-run Seed Script:

```bash
cd Backend
node seed.js
```

This will:

- Clear old data
- Create 55 new users
- Create 120 new posts
- Add comments and likes

#### Check Backend Connection:

1. Make sure backend is running: `npm run dev`
2. Check terminal for "mongodb connected successfully"
3. Check for any errors

#### Check Frontend:

1. Open browser console (F12)
2. Look for API errors
3. Check if posts are being fetched

---

### Issue 5: Search Not Working

**Symptoms**:

- Type in search box
- No results appear

**Solutions**:

1. **Make sure you're on Search page**
   - Click "Search" in sidebar
   - URL should be `/search`

2. **Wait for debounce**
   - Type your search term
   - Wait 300ms (0.3 seconds)
   - Results should appear

3. **Try different searches**:
   - "john" - finds users with john in name
   - "coffee" - finds users with coffee in bio
   - "student" - finds students

4. **Check backend**:
   - Look for search API logs
   - Make sure backend is running

---

### Issue 6: Explore Page Empty

**Symptoms**:

- Explore page shows no content
- No popular users or trending posts

**Solutions**:

1. **Re-run seed script** (creates posts with likes)

```bash
cd Backend
node seed.js
```

2. **Check if posts exist**:
   - Go to Home feed
   - If posts show there, Explore should work

3. **Check backend logs**:
   - Look for explore API calls
   - Check for any errors

---

### Issue 7: Messages Not Working

**Symptoms**:

- Can't send messages
- Messages not appearing

**Solutions**:

1. **Make sure you follow the user first**
   - Messages only work with users you follow
   - Go to their profile
   - Click "Follow"
   - Then try messaging

2. **Check Socket.IO connection**:
   - Open browser console
   - Look for Socket.IO connection logs
   - Should see "connected" message

3. **Check backend**:
   - Make sure Socket.IO is running
   - Port 3000 should be open

---

## 🔧 General Troubleshooting Steps

### Step 1: Check Backend

```bash
cd Backend
npm run dev
```

**Should see**:

```
mongodb connected successfully.
Server listening at port 3000
```

### Step 2: Check Frontend

```bash
cd Frontend
npm run dev
```

**Should see**:

```
VITE v... ready in ...ms
Local: http://localhost:5173/
```

### Step 3: Check MongoDB

- Make sure MongoDB is running
- Check connection string in `.env`
- Verify database exists

### Step 4: Clear Everything

1. Stop both servers
2. Clear browser cache
3. Delete cookies
4. Restart servers
5. Login again

### Step 5: Re-seed Database

```bash
cd Backend
node seed.js
```

---

## 📊 How to Verify Everything Works

### Test Checklist:

#### Authentication ✅

- [ ] Can login with `john_smith@example.com` / `password123`
- [ ] Can logout
- [ ] Can signup new account
- [ ] Protected routes redirect to login

#### Posts ✅

- [ ] Can see posts on home feed
- [ ] Can like/unlike posts
- [ ] Can comment on posts
- [ ] Can bookmark posts
- [ ] Can delete own posts

#### Follow System ✅

- [ ] Can follow users from profile
- [ ] Can unfollow users
- [ ] Follow button changes to "Following"
- [ ] Can follow from suggested users

#### Search ✅

- [ ] Can search for users
- [ ] Results appear as you type
- [ ] Can click users to view profile

#### Explore ✅

- [ ] Can see popular users
- [ ] Can see trending posts
- [ ] Can click to view details

#### AI Feature ✅

- [ ] Click "Create" in sidebar
- [ ] Upload an image
- [ ] AI suggestions appear automatically
- [ ] Can click suggestions to apply
- [ ] Can generate new suggestions

#### Messaging ✅

- [ ] Can see users you follow in chat
- [ ] Can send messages
- [ ] Messages appear in real-time
- [ ] Online status shows correctly

---

## 🆘 Still Having Issues?

### Check These:

1. **Node Version**

   ```bash
   node --version
   # Should be v16 or higher
   ```

2. **NPM Packages**

   ```bash
   cd Backend && npm install
   cd Frontend && npm install
   ```

3. **Environment Variables**
   - Check `Backend/.env` exists
   - Has MongoDB connection string
   - Has SECRET_KEY
   - Has Cloudinary credentials

4. **Ports**
   - Backend: 3000
   - Frontend: 5173
   - Make sure no other apps using these ports

5. **Browser**
   - Try different browser
   - Try incognito mode
   - Clear all data

---

## 📝 Quick Fix Commands

### Reset Everything:

```bash
# Stop servers (Ctrl+C)

# Backend
cd Backend
rm -rf node_modules
npm install
node seed.js
npm run dev

# Frontend (new terminal)
cd Frontend
rm -rf node_modules
npm install
npm run dev
```

### Just Re-seed:

```bash
cd Backend
node seed.js
```

### Clear Browser:

1. F12 (DevTools)
2. Application tab
3. Clear storage
4. Refresh

---

## ✅ Success Indicators

### Backend Working:

```
mongodb connected successfully.
Server listening at port 3000
```

### Frontend Working:

```
VITE ready
Local: http://localhost:5173/
```

### Database Seeded:

```
✅ Created 55 users
✅ Created 120 posts
✅ Created 657 comments
🎉 Database seeded successfully!
```

### Login Working:

- No errors in console
- Redirects to home feed
- Can see posts

### AI Feature Working:

- Upload image in Create Post
- See "AI Caption Suggestions" with sparkle icon
- 4 gradient cards with suggestions
- Can click to apply

---

## 🎯 Most Common Solution

**90% of issues are solved by**:

1. Logout
2. Clear browser cookies
3. Login again
4. Try the feature again

**If that doesn't work**:

1. Re-run seed script
2. Restart both servers
3. Clear browser completely
4. Try again

---

## 📞 Debug Information to Collect

If still having issues, collect this info:

1. **Browser Console Errors**
   - F12 → Console tab
   - Copy any red errors

2. **Backend Terminal Output**
   - Copy last 20 lines
   - Look for errors

3. **Network Tab**
   - F12 → Network tab
   - Try the failing action
   - Check which API call fails
   - Look at response

4. **What You're Trying**
   - Exact steps
   - What you expect
   - What actually happens

---

## 🎉 Everything Should Work!

If you follow these steps, Campus Connect should work perfectly:

1. ✅ Backend running on port 3000
2. ✅ Frontend running on port 5173
3. ✅ MongoDB connected
4. ✅ Database seeded with 55 users
5. ✅ Logged in with valid account
6. ✅ All features accessible

**The platform is fully functional - just need to ensure proper setup!**
