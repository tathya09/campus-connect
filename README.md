# Campus Connect 🎓

A modern, full-stack social media platform designed for college students, featuring real-time messaging, AI-powered content creation, and social networking capabilities.

![Campus Connect](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen)
![AI Powered](https://img.shields.io/badge/AI-Hugging%20Face-orange)

## ✨ Features

### Core Features

- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 📸 **Post Creation** - Upload images with Cloudinary integration
- 🤖 **AI Caption Generation** - Powered by Hugging Face BLIP model
- #️⃣ **AI Hashtag Suggestions** - Smart hashtag recommendations using BART model
- 💬 **Real-time Messaging** - Instant messaging with Socket.IO
- 👥 **Social Networking** - Follow/unfollow, like, comment, bookmark
- 🔍 **User Search** - Find users by username or bio
- 🔥 **Explore Page** - Discover trending posts and popular users
- 👤 **User Profiles** - View posts, followers, and following lists
- ✏️ **Edit Profile** - Update bio, profile picture, and gender
- 🟢 **Online Status** - Real-time online/offline indicators

### AI Features

- **Image Analysis**: Real AI that understands image content
- **Smart Captions**: Generates 4 contextual caption variations
- **Hashtag Intelligence**: Categorizes content and suggests relevant hashtags
- **Time-Aware**: Adjusts suggestions based on time of day
- **Fallback System**: Seamless fallback to templates if AI unavailable

## 🚀 Tech Stack

### Frontend

- **React 18** - Modern UI library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Beautiful component library
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.IO** - WebSocket server
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Cloudinary** - Image hosting
- **Multer** - File upload handling

### AI Integration

- **Hugging Face BLIP** - Image captioning
- **Hugging Face BART** - Text classification

## 📦 Installation

### Prerequisites

- Node.js 16+ installed
- MongoDB installed or MongoDB Atlas account
- Cloudinary account (free tier)

### Clone Repository

```bash
git clone https://github.com/yourusername/campus-connect.git
cd campus-connect
```

### Backend Setup

```bash
cd Backend
npm install

# Create .env file
echo "PORT=3000
MONGO_URL=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
CLOUD_NAME=your_cloudinary_cloud_name
URL=http://localhost:5173" > .env

# Start backend
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install

# Start frontend
npm run dev
```

### Seed Database (Optional)

```bash
cd Backend
node seed.js
```

This creates 55 users, 120 posts, and 600+ comments for testing.

**Test Credentials:**

- Email: john_smith@example.com
- Password: password123

## 🌐 Deployment

### Deploy to Vercel

**Backend:**

1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `Backend`
4. Add environment variables
5. Deploy

**Frontend:**

1. Import same repository
2. Set root directory to `Frontend`
3. Add `VITE_API_URL` environment variable
4. Deploy

**Detailed Guide:** See `VERCEL_DEPLOYMENT_GUIDE.md`

## 📖 Documentation

- **PROJECT_DOCUMENTATION.md** - Complete technical documentation
- **INTERVIEW_PREPARATION_GUIDE.md** - 32 interview Q&A
- **HUGGING_FACE_AI_SETUP.md** - AI integration guide
- **VERCEL_DEPLOYMENT_GUIDE.md** - Deployment instructions
- **PROJECT_COMPLETE_SUMMARY.md** - Project overview

## 🎯 Key Highlights

### Architecture

- Clean MVC architecture
- RESTful API design
- Real-time WebSocket integration
- Centralized state management
- Secure authentication flow

### Security

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies
- CORS configuration
- Input validation
- XSS prevention

### Performance

- Redux Persist for offline capability
- Debounced search (300ms)
- Image CDN delivery
- Database indexing
- Optimistic UI updates
- Code splitting

## 🖼️ Screenshots

### Home Feed

Beautiful gradient design with posts, likes, and comments.

### AI Caption Generation

Upload an image and watch AI analyze it in real-time.

### Real-time Messaging

Instant messaging with online/offline status indicators.

### Explore Page

Discover trending posts and popular users.

## 🧪 Testing

### Run Tests

```bash
# Frontend tests
cd Frontend
npm test

# Backend tests
cd Backend
npm test
```

### Manual Testing

1. Register new user
2. Create post with AI captions
3. Like, comment, bookmark posts
4. Follow/unfollow users
5. Send real-time messages
6. Search for users
7. Explore trending content

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is for educational purposes.

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co) for AI models
- [Cloudinary](https://cloudinary.com) for image hosting
- [MongoDB](https://mongodb.com) for database
- [Vercel](https://vercel.com) for hosting

## 📊 Project Stats

- **Lines of Code**: 5,000+
- **Components**: 20+
- **API Endpoints**: 20+
- **Features**: 16
- **AI Models**: 2

## 🔮 Future Enhancements

- [ ] Stories (24-hour posts)
- [ ] Video support
- [ ] Group chats
- [ ] Push notifications
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Post analytics
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Content moderation AI

## 📞 Support

For issues or questions:

1. Check documentation files
2. Open an issue on GitHub
3. Review code comments

---

**Built with ❤️ for college students**

⭐ Star this repo if you found it helpful!
