# GitHub Push Guide - Campus Connect

## Step-by-Step Instructions

### Step 1: Initialize Git Repository

Open your terminal in the project root directory and run:

```bash
git init
```

### Step 2: Add All Files

```bash
git add .
```

This stages all files for commit. The `.gitignore` file will automatically exclude:

- node_modules folders
- .env files
- build outputs
- logs

### Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: Campus Connect - Full-stack social media app with AI features"
```

### Step 4: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the "+" icon in top right
3. Select "New repository"
4. Fill in details:
   - **Repository name**: `campus-connect` (or your preferred name)
   - **Description**: "Full-stack social media platform with AI-powered features"
   - **Visibility**: Public (recommended for portfolio) or Private
   - **DO NOT** initialize with README (we already have one)
5. Click "Create repository"

### Step 5: Connect Local Repository to GitHub

GitHub will show you commands. Use these (replace with your actual URL):

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

### Step 6: Verify Push

1. Refresh your GitHub repository page
2. You should see all your files
3. README.md will be displayed on the main page

## Alternative: Using GitHub Desktop

If you prefer a GUI:

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Open GitHub Desktop
3. File → Add Local Repository
4. Select your project folder
5. Click "Publish repository"
6. Choose name and visibility
7. Click "Publish"

## Important: Before Pushing

### ✅ Checklist

- [ ] `.gitignore` file created (prevents sensitive files from being pushed)
- [ ] `.env` files are NOT included (check with `git status`)
- [ ] `node_modules` folders are NOT included
- [ ] README.md is present
- [ ] All code is working locally

### ⚠️ Security Check

**CRITICAL**: Make sure these files are NOT in your commit:

```bash
# Check what will be committed
git status

# If you see .env files, they should be in .gitignore
# If you accidentally added them:
git rm --cached Backend/.env
git rm --cached Frontend/.env
git commit -m "Remove .env files"
```

## After Pushing

### Update README

1. Go to your GitHub repository
2. Click on README.md
3. Click the pencil icon to edit
4. Update these sections:
   - Replace `yourusername` with your actual GitHub username
   - Add your LinkedIn profile
   - Add screenshots (optional)
5. Commit changes

### Add Topics

1. Go to repository main page
2. Click the gear icon next to "About"
3. Add topics: `react`, `nodejs`, `mongodb`, `ai`, `social-media`, `full-stack`, `socket-io`
4. Save changes

### Create Releases (Optional)

1. Go to "Releases" tab
2. Click "Create a new release"
3. Tag: `v1.0.0`
4. Title: "Campus Connect v1.0 - Initial Release"
5. Description: List all features
6. Publish release

## Future Updates

When you make changes:

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add dark mode feature"

# Push to GitHub
git push
```

## Common Issues

### Issue 1: Permission Denied

**Solution**: Set up SSH key or use HTTPS with personal access token

**HTTPS with Token:**

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select `repo` scope
4. Copy token
5. Use token as password when pushing

### Issue 2: Large Files

**Error**: "File size exceeds GitHub's limit"

**Solution**:

- Remove large files from commit
- Use Git LFS for large files
- Or host large files elsewhere (Cloudinary, etc.)

### Issue 3: Merge Conflicts

**Solution**:

```bash
git pull origin main
# Resolve conflicts in files
git add .
git commit -m "Resolve merge conflicts"
git push
```

## Best Practices

### Commit Messages

Good examples:

- `feat: Add AI hashtag generation`
- `fix: Resolve Socket.IO connection issue`
- `docs: Update README with deployment guide`
- `style: Improve UI with gradient backgrounds`
- `refactor: Optimize database queries`

### Branch Strategy

For future development:

```bash
# Create feature branch
git checkout -b feature/stories

# Make changes and commit
git add .
git commit -m "feat: Add stories feature"

# Push branch
git push origin feature/stories

# Create Pull Request on GitHub
# Merge after review
```

## Repository Settings

### Recommended Settings

1. **Branch Protection** (Settings → Branches):
   - Protect `main` branch
   - Require pull request reviews
   - Require status checks

2. **GitHub Pages** (Settings → Pages):
   - Can host documentation
   - Source: `main` branch, `/docs` folder

3. **Secrets** (Settings → Secrets):
   - Add environment variables for GitHub Actions
   - Never commit secrets to repository

## Next Steps

After pushing to GitHub:

1. ✅ Verify all files are on GitHub
2. ✅ Check README displays correctly
3. ✅ Add repository description and topics
4. ✅ Star your own repository (why not? 😄)
5. ✅ Share with friends/recruiters
6. ⏭️ Proceed to deployment (Vercel)

## Deployment Preparation

Before deploying:

1. **Create `.env.example` files** (template for others):

**Backend/.env.example:**

```
PORT=3000
MONGO_URL=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
CLOUD_NAME=your_cloudinary_cloud_name
URL=http://localhost:5173
```

**Frontend/.env.example:**

```
VITE_API_URL=https://campus-connect-bn54.vercel.app
VITE_HF_TOKEN=optional_huggingface_token
```

2. **Commit these example files**:

```bash
git add Backend/.env.example Frontend/.env.example
git commit -m "docs: Add environment variable examples"
git push
```

## Congratulations! 🎉

Your code is now on GitHub and ready for:

- Portfolio showcase
- Collaboration
- Deployment
- Job applications

**Next**: Follow `VERCEL_DEPLOYMENT_GUIDE.md` to deploy your app!
