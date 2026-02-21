# Campus Connect - Complete Project Documentation

## Project Overview

**Campus Connect** is a full-stack social media application designed for college students, featuring real-time messaging, AI-powered content creation, and social networking capabilities.

## Tech Stack

### Frontend

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **Redux Persist** - State persistence
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Component library
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **Sonner** - Toast notifications
- **Lucide React** - Icon library

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.IO** - WebSocket server
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image hosting
- **Multer** - File upload handling
- **Cookie Parser** - Cookie management
- **CORS** - Cross-origin resource sharing

### AI Integration

- **Hugging Face API** - Image captioning (BLIP model)
- **Hugging Face API** - Text classification (BART model)

## Architecture

### Frontend Architecture

```
Frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── ChatPage.jsx    # Real-time messaging
│   │   ├── CreatePost.jsx  # Post creation with AI
│   │   ├── Profile.jsx     # User profiles
│   │   ├── Explore.jsx     # Content discovery
│   │   └── ...
│   ├── redux/              # State management
│   │   ├── store.js        # Redux store configuration
│   │   ├── authSlice.js    # Authentication state
│   │   ├── postSlice.js    # Posts state
│   │   ├── chatSlice.js    # Chat state
│   │   └── socketSlice.js  # Socket state
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utilities
```

### Backend Architecture

```
Backend/
├── Controllers/            # Business logic
│   ├── UserController.js   # User operations
│   ├── PostController.js   # Post operations
│   └── MessageController.js # Messaging
├── Models/                 # Database schemas
│   ├── UserModel.js
│   ├── PostModel.js
│   ├── MessageModel.js
│   └── ConversationModel.js
├── Routes/                 # API endpoints
├── middlewares/            # Custom middleware
│   ├── isAuthenticated.js  # Auth middleware
│   └── multer.js          # File upload
├── utils/                  # Utilities
│   ├── cloudinary.js      # Image upload
│   ├── datauri.js         # File conversion
│   └── db.js              # Database connection
└── socket/                 # WebSocket logic
    └── socket.js
```

## Key Features

### 1. Authentication System

- **JWT-based authentication**
- **Secure password hashing** with bcrypt
- **HTTP-only cookies** for token storage
- **Protected routes** on both frontend and backend

### 2. Post Management

- **Image upload** to Cloudinary
- **AI-powered caption generation** using Hugging Face BLIP
- **AI-powered hashtag suggestions** using Hugging Face BART
- **Like/Unlike functionality**
- **Comment system**
- **Bookmark posts**
- **Delete own posts**

### 3. Real-time Messaging

- **Socket.IO** for WebSocket connections
- **One-on-one messaging**
- **Online/offline status**
- **Real-time message delivery**
- **Message persistence** in MongoDB

### 4. Social Features

- **Follow/Unfollow users**
- **View followers/following lists**
- **User profiles** with posts and bookmarks
- **Search users** by username or bio
- **Suggested users** sidebar
- **Explore page** with trending posts and popular users

### 5. AI Features

- **Image Analysis**: BLIP model analyzes uploaded images
- **Caption Generation**: Creates 4 contextual captions
- **Hashtag Suggestions**: Categorizes content and suggests hashtags
- **Time-aware**: Adjusts suggestions based on time of day
- **Fallback system**: Uses templates if AI fails

## Database Schema

### User Model

```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  usertype: String (required),
  profilePicture: String (default),
  bio: String,
  gender: String,
  followers: [ObjectId] (ref: User),
  following: [ObjectId] (ref: User),
  posts: [ObjectId] (ref: Post),
  bookmarks: [ObjectId] (ref: Post)
}
```

### Post Model

```javascript
{
  caption: String (required),
  image: String (required),
  author: ObjectId (ref: User, required),
  likes: [ObjectId] (ref: User),
  comments: [{
    text: String (required),
    author: ObjectId (ref: User, required)
  }]
}
```

### Message Model

```javascript
{
  senderId: ObjectId (ref: User, required),
  receiverId: ObjectId (ref: User, required),
  message: String (required)
}
```

### Conversation Model

```javascript
{
  participants: [ObjectId] (ref: User),
  messages: [ObjectId] (ref: Message)
}
```

## API Endpoints

### Authentication

- `POST /api/v1/user/register` - Register new user
- `POST /api/v1/user/login` - Login user
- `GET /api/v1/user/logout` - Logout user

### User Operations

- `GET /api/v1/user/:id/profile` - Get user profile
- `POST /api/v1/user/profile/edit` - Edit profile
- `GET /api/v1/user/suggested` - Get suggested users
- `POST /api/v1/user/followorunfollow/:id` - Follow/unfollow user
- `GET /api/v1/user/search` - Search users
- `GET /api/v1/user/:id/followers` - Get followers list
- `GET /api/v1/user/:id/following` - Get following list

### Post Operations

- `POST /api/v1/post/addpost` - Create new post
- `GET /api/v1/post/all` - Get all posts
- `GET /api/v1/post/userpost/all` - Get user's posts
- `GET /api/v1/post/:id/like` - Like post
- `GET /api/v1/post/:id/dislike` - Dislike post
- `POST /api/v1/post/:id/comment` - Add comment
- `GET /api/v1/post/:id/comment/all` - Get all comments
- `DELETE /api/v1/post/delete/:id` - Delete post
- `GET /api/v1/post/:id/bookmark` - Bookmark post
- `GET /api/v1/post/explore` - Get trending posts
- `GET /api/v1/post/popular-users` - Get popular users

### Messaging

- `POST /api/v1/message/send/:id` - Send message
- `GET /api/v1/message/all/:id` - Get all messages with user

## State Management (Redux)

### Auth Slice

```javascript
{
  user: null | UserObject,
  suggestedUsers: [],
  userProfile: null,
  selectedUser: null
}
```

### Post Slice

```javascript
{
  posts: [],
  selectedPost: null
}
```

### Chat Slice

```javascript
{
  onlineUsers: [],
  messages: []
}
```

### Socket Slice

```javascript
{
  socket: null;
}
```

## Real-time Features (Socket.IO)

### Events

**Client → Server:**

- `setup` - Initialize user connection
- `sendMessage` - Send new message

**Server → Client:**

- `getOnlineUsers` - Receive online users list
- `newMessage` - Receive new message
- `notification` - Receive notifications

### Implementation

```javascript
// Server
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Client
const socket = io("http://localhost:3000", {
  query: { userId: user?._id },
});
```

## AI Integration Details

### Caption Generation (BLIP)

```javascript
// API Call
fetch('https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large', {
  method: 'POST',
  body: JSON.stringify({ inputs: base64Image })
})

// Response
{ generated_text: "a sunset over the ocean" }

// Processing
- Add emojis based on time of day
- Create 4 variations
- Add contextual hashtags
```

### Hashtag Generation (BART)

```javascript
// API Call
fetch('https://api-inference.huggingface.co/models/facebook/bart-large-mnli', {
  method: 'POST',
  body: JSON.stringify({
    inputs: imageDescription,
    parameters: {
      candidate_labels: ["nature", "food", "travel", ...]
    }
  })
})

// Response
{ labels: ["nature", "travel", "food"], scores: [0.8, 0.6, 0.4] }

// Processing
- Take top 3 categories
- Add time-based hashtags
- Add generic hashtags (#campuslife, #instagood)
```

## Security Features

### 1. Authentication

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with 7-day expiration
- HTTP-only cookies prevent XSS attacks
- Secure cookie settings in production

### 2. Authorization

- Middleware checks JWT on protected routes
- User can only edit/delete own content
- Profile privacy controls

### 3. Input Validation

- Required field validation
- Email format validation
- File type validation for uploads
- XSS prevention through sanitization

### 4. CORS Configuration

```javascript
const corsOptions = {
  origin: process.env.URL,
  credentials: true,
};
```

## Performance Optimizations

### Frontend

- **Code splitting** with React.lazy
- **Image optimization** via Cloudinary
- **Redux Persist** for offline capability
- **Debounced search** (300ms delay)
- **Memoization** with useMemo/useCallback

### Backend

- **Database indexing** on frequently queried fields
- **Populate** only necessary fields
- **Pagination** for large datasets
- **Connection pooling** with Mongoose

### AI

- **Fallback system** prevents blocking
- **Async/await** for non-blocking calls
- **Error handling** with try-catch
- **Template caching** for instant fallback

## Deployment Considerations

### Environment Variables

**Frontend (.env):**

```
VITE_API_URL=http://localhost:3000
VITE_HF_TOKEN=optional_huggingface_token
```

**Backend (.env):**

```
PORT=3000
MONGO_URL=mongodb_connection_string
SECRET_KEY=jwt_secret
API_KEY=cloudinary_api_key
API_SECRET=cloudinary_api_secret
CLOUD_NAME=cloudinary_cloud_name
URL=http://localhost:5173
```

### Production Checklist

- [ ] Set NODE_ENV=production
- [ ] Use HTTPS
- [ ] Enable rate limiting
- [ ] Set up monitoring (logs, errors)
- [ ] Configure CDN for static assets
- [ ] Database backups
- [ ] Security headers
- [ ] CORS whitelist specific domains

## Testing Strategy

### Unit Tests

- Component rendering
- Redux actions/reducers
- Utility functions
- API endpoints

### Integration Tests

- Authentication flow
- Post creation flow
- Messaging flow
- Follow/unfollow flow

### E2E Tests

- User registration → login → create post
- Search → follow → message
- Upload image → AI caption → post

## Future Enhancements

### Planned Features

1. **Stories** (24-hour temporary posts)
2. **Video posts** support
3. **Group chats** functionality
4. **Push notifications**
5. **Email notifications**
6. **Advanced search** with filters
7. **Post analytics** (views, reach)
8. **Dark mode** theme
9. **Multi-language** support
10. **Mobile app** (React Native)

### AI Enhancements

1. **Content moderation** (detect inappropriate content)
2. **Smart replies** in messages
3. **Image filters** and effects
4. **Face detection** for tagging
5. **Sentiment analysis** on comments

## Troubleshooting

### Common Issues

**Issue: CORS errors**

- Solution: Check URL environment variable matches frontend URL

**Issue: Socket.IO not connecting**

- Solution: Verify backend is running, check CORS settings

**Issue: Images not uploading**

- Solution: Check Cloudinary credentials, verify multer configuration

**Issue: AI captions not working**

- Solution: Check network, verify Hugging Face API is accessible

**Issue: JWT token expired**

- Solution: Implement refresh token mechanism or extend expiration

## Performance Metrics

### Target Metrics

- **Page Load Time**: < 2 seconds
- **API Response Time**: < 500ms
- **AI Caption Generation**: 2-5 seconds
- **Real-time Message Delivery**: < 100ms
- **Image Upload**: < 3 seconds

### Monitoring

- Use browser DevTools for frontend performance
- Use Morgan for backend request logging
- Monitor Cloudinary usage dashboard
- Track Hugging Face API usage

## Credits & Attribution

### Technologies

- React, Redux, Express, MongoDB
- Socket.IO for real-time features
- Cloudinary for image hosting
- Hugging Face for AI models

### AI Models

- **BLIP** by Salesforce Research
- **BART** by Facebook AI

### UI Components

- Shadcn/UI component library
- Tailwind CSS framework
- Lucide icons

## License

This project is for educational purposes.

## Contact & Support

For questions or issues:

- Check documentation files
- Review code comments
- Test with provided seed data
- Verify environment variables
