# Testing Guide - Campus Connect

## 🚀 Quick Start

### 1. Start the Backend

```bash
cd Backend
npm run dev
```

Backend should start on: `https://campus-connect-bn54.vercel.app`

### 2. Start the Frontend

```bash
cd Frontend
npm run dev
```

Frontend should start on: `http://localhost:5173`

---

## 🧪 Feature Testing Checklist

### ✅ Search Feature

**Test Steps**:

1. Login with: `john_smith@example.com` / `password123`
2. Click "Search" in the left sidebar
3. Test these searches:

| Search Term | Expected Results               |
| ----------- | ------------------------------ |
| "john"      | Users with "john" in username  |
| "sarah"     | Users with "sarah" in username |
| "coffee"    | Users with "coffee" in bio     |
| "tech"      | Users with "tech" in bio       |
| "student"   | Users with "Student" user type |
| "teacher"   | Users with "Teacher" user type |

**What to Verify**:

- [ ] Results appear as you type (debounced)
- [ ] Loading spinner shows during search
- [ ] User cards display avatar, username, bio, and user type
- [ ] Clicking a user navigates to their profile
- [ ] Empty state shows when no results found
- [ ] Search works case-insensitively

---

### ✅ Explore Feature

**Test Steps**:

1. Login with any account
2. Click "Explore" in the left sidebar
3. Observe the page layout

**Popular Users Section**:

- [ ] Shows top 10 users by follower count
- [ ] Displays user avatar, username, and follower count
- [ ] Clicking a user navigates to their profile
- [ ] Grid layout is responsive

**Trending Posts Section**:

- [ ] Shows posts sorted by like count
- [ ] Displays post image, author, and caption
- [ ] Hover effect reveals like and comment counts
- [ ] Posts from last 7 days are prioritized
- [ ] Grid layout is responsive

---

### ✅ Existing Features (Regression Testing)

**Home Feed**:

- [ ] All posts load correctly
- [ ] Like/unlike works
- [ ] Comment dialog opens
- [ ] Bookmark works
- [ ] Delete own posts works

**Profile**:

- [ ] View user profiles
- [ ] Follow/unfollow works instantly
- [ ] Message button navigates to chat
- [ ] Edit profile works
- [ ] Posts grid displays correctly

**Messaging**:

- [ ] Chat page shows users you follow
- [ ] Send messages works
- [ ] Real-time message delivery
- [ ] Online/offline status accurate

**Authentication**:

- [ ] Login works
- [ ] Signup works
- [ ] Logout works
- [ ] Protected routes redirect to login

---

## 🎯 User Journey Tests

### Journey 1: New User Discovery

1. Login as `john_smith@example.com`
2. Go to Explore
3. Click on a popular user
4. Follow them
5. Go to Messages
6. Send them a message

**Expected**: Smooth flow from discovery to connection

### Journey 2: Content Discovery

1. Login as `sarah_johnson@example.com`
2. Go to Explore
3. View trending posts
4. Like a trending post
5. Comment on it
6. Go to Home feed
7. Verify the post appears

**Expected**: Seamless content interaction

### Journey 3: User Search and Connect

1. Login as `mike_williams@example.com`
2. Go to Search
3. Search for "coffee"
4. Find a user who likes coffee
5. View their profile
6. Follow them
7. Message them

**Expected**: Easy user discovery and connection

---

## 🐛 Common Issues and Solutions

### Issue: Search returns no results

**Solution**:

- Check backend is running on port 3000
- Verify MongoDB connection
- Check browser console for errors
- Try a different search term

### Issue: Explore page is empty

**Solution**:

- Run the seed script: `node Backend/seed.js`
- Verify posts exist in database
- Check backend console for errors

### Issue: Navigation doesn't work

**Solution**:

- Check browser console for routing errors
- Verify all routes are defined in App.jsx
- Clear browser cache and reload

### Issue: Images not loading

**Solution**:

- Check internet connection (Unsplash images)
- Verify Cloudinary configuration
- Check browser console for CORS errors

---

## 📊 Performance Testing

### Load Testing

1. Login and navigate to Explore
2. Check page load time (should be < 2 seconds)
3. Scroll through trending posts
4. Verify smooth scrolling

### Search Performance

1. Type rapidly in search box
2. Verify debouncing works (not too many requests)
3. Check response time (should be < 500ms)

### Real-time Features

1. Open two browser windows
2. Login as different users
3. Send messages between them
4. Verify instant delivery
5. Like a post in one window
6. Check notification in other window

---

## 🎨 UI/UX Testing

### Responsive Design

Test on different screen sizes:

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### Visual Consistency

- [ ] Purple/pink gradient theme consistent
- [ ] Hover effects work smoothly
- [ ] Loading states are clear
- [ ] Error messages are helpful
- [ ] Empty states are informative

### Accessibility

- [ ] Tab navigation works
- [ ] Focus indicators visible
- [ ] Alt text on images
- [ ] Contrast ratios adequate
- [ ] Screen reader friendly

---

## 🔍 Edge Cases to Test

### Search Edge Cases

- [ ] Empty search query
- [ ] Very long search query
- [ ] Special characters in search
- [ ] Search with no results
- [ ] Search while offline

### Explore Edge Cases

- [ ] No trending posts available
- [ ] No popular users
- [ ] All posts have 0 likes
- [ ] User with 0 followers

### General Edge Cases

- [ ] Slow internet connection
- [ ] Backend server down
- [ ] Invalid authentication token
- [ ] Concurrent actions (like + unlike rapidly)

---

## 📝 Bug Report Template

If you find a bug, report it with:

```markdown
**Bug Title**: [Brief description]

**Steps to Reproduce**:

1.
2.
3.

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Screenshots**:
[If applicable]

**Environment**:

- Browser:
- OS:
- Screen Size:

**Console Errors**:
[Any errors from browser console]
```

---

## ✅ Final Checklist

Before considering testing complete:

### Backend

- [ ] All API endpoints respond correctly
- [ ] Database queries are efficient
- [ ] Error handling works
- [ ] CORS configured properly
- [ ] Authentication middleware works

### Frontend

- [ ] All routes accessible
- [ ] Components render correctly
- [ ] State management works
- [ ] API calls succeed
- [ ] Error boundaries catch errors

### Features

- [ ] Search works end-to-end
- [ ] Explore displays correct data
- [ ] All existing features still work
- [ ] Navigation is smooth
- [ ] Real-time features work

### User Experience

- [ ] UI is intuitive
- [ ] Loading states are clear
- [ ] Error messages are helpful
- [ ] Performance is acceptable
- [ ] Design is consistent

---

## 🎉 Success Criteria

Campus Connect is ready for demo when:

1. ✅ All features work without errors
2. ✅ Search returns relevant results
3. ✅ Explore shows trending content
4. ✅ Navigation is smooth
5. ✅ UI looks polished
6. ✅ Performance is good
7. ✅ No critical bugs

---

## 📞 Need Help?

If you encounter issues:

1. Check browser console for errors
2. Check backend terminal for errors
3. Verify MongoDB is running
4. Restart both servers
5. Clear browser cache
6. Try a different browser

Happy Testing! 🚀
