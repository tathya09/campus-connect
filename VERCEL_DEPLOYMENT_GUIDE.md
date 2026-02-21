# Vercel Deployment Guide for Campus Connect

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- MongoDB Atlas account (for cloud database)
- Cloudinary account (for image hosting)

## Part 1: Prepare Your Code

### 1. Update Backend for Production

Create a new file `Backend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### 2. Update CORS Settings

In `Backend/server.js`, update CORS configuration:

```javascript
const corsOptions = {
  origin: process.env.URL || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
```

### 3. Update Frontend API URLs

Create `Frontend/.env`:

```
VITE_API_URL=https://your-backend-url.vercel.app
```

Update `Frontend/src/lib/axios.js`:

```javascript
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

export default axiosInstance;
```

Then replace all `http://localhost:3000` with the axios instance in all components.

## Part 2: Deploy Backend to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/campus-connect.git
git push -u origin main
```

### 2. Deploy Backend

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the `Backend` folder as the root directory
5. Add Environment Variables:
   - `MONGO_URL`: Your MongoDB Atlas connection string
   - `SECRET_KEY`: Your JWT secret
   - `API_KEY`: Cloudinary API key
   - `API_SECRET`: Cloudinary API secret
   - `CLOUD_NAME`: Cloudinary cloud name
   - `URL`: Your frontend URL (add after frontend deployment)
   - `PORT`: 3000

6. Click "Deploy"

### 3. Note Your Backend URL

After deployment, copy the URL (e.g., `https://your-backend.vercel.app`)

## Part 3: Deploy Frontend to Vercel

### 1. Update Frontend Environment

Create `Frontend/.env.production`:

```
VITE_API_URL=https://your-backend-url.vercel.app
```

### 2. Deploy Frontend

1. In Vercel, click "Add New Project"
2. Import the same repository
3. Select the `Frontend` folder as the root directory
4. Framework Preset: Vite
5. Add Environment Variables:
   - `VITE_API_URL`: Your backend URL from step 2.3

6. Click "Deploy"

### 3. Update Backend URL Environment Variable

Go back to your backend deployment and update the `URL` environment variable with your frontend URL.

## Part 4: MongoDB Atlas Setup

### 1. Create Cluster

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist all IP addresses (0.0.0.0/0) for Vercel

### 2. Get Connection String

1. Click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Add this to your backend Vercel environment variables

## Part 5: Cloudinary Setup

Your existing Cloudinary credentials should work. Just ensure they're added to Vercel environment variables.

## Part 6: Testing

1. Visit your frontend URL
2. Test signup/login
3. Test creating posts
4. Test image uploads
5. Test messaging (Socket.IO should work on Vercel)

## Common Issues & Solutions

### Issue 1: CORS Errors

**Solution**: Ensure `URL` environment variable in backend matches your frontend URL exactly (no trailing slash).

### Issue 2: Socket.IO Not Working

**Solution**: Vercel supports WebSockets. Ensure your Socket.IO configuration includes:

```javascript
const io = new Server(server, {
  cors: {
    origin: process.env.URL,
    credentials: true,
  },
  transports: ["websocket", "polling"],
});
```

### Issue 3: 404 on Routes

**Solution**: Add `vercel.json` to Frontend:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Issue 4: Environment Variables Not Working

**Solution**:

- Redeploy after adding environment variables
- Check variable names match exactly
- For frontend, variables must start with `VITE_`

### Issue 5: MongoDB Connection Timeout

**Solution**:

- Whitelist 0.0.0.0/0 in MongoDB Atlas Network Access
- Check connection string format
- Ensure database user has correct permissions

## Alternative: Deploy Backend to Railway/Render

If Vercel has issues with your backend, consider:

### Railway.app

1. Connect GitHub repo
2. Select Backend folder
3. Add environment variables
4. Deploy

### Render.com

1. Create new Web Service
2. Connect GitHub repo
3. Root directory: `Backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] MongoDB Atlas connected
- [ ] Cloudinary working
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Socket.IO working
- [ ] Image uploads working
- [ ] Authentication working
- [ ] All features tested

## Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `URL` environment variable in backend

## Monitoring & Logs

- View logs in Vercel dashboard
- Monitor function execution time
- Check for errors in real-time
- Set up error notifications

## Cost Considerations

**Free Tier Limits:**

- Vercel: 100GB bandwidth/month
- MongoDB Atlas: 512MB storage
- Cloudinary: 25 credits/month

**Upgrade When:**

- Traffic exceeds free tier
- Need more storage
- Require better performance

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Socket.IO on Vercel](https://socket.io/docs/v4/server-deployment/#vercel)
