# Quick Implementation Guide - Search, Explore & Notifications

This guide provides step-by-step instructions to implement the three most important missing features.

---

## 1. Search Functionality (2-3 hours)

### Backend: Create Search API

**File**: `Backend/Controllers/UserController.js`

Add this function:

```javascript
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        message: "Search query is required",
        success: false,
      });
    }

    // Search users by username or bio (case-insensitive)
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { bio: { $regex: query, $options: "i" } },
      ],
      _id: { $ne: req.id }, // Exclude current user
    })
      .select("-password")
      .limit(20);

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error searching users",
      success: false,
    });
  }
};
```

**File**: `Backend/Routes/UserRoute.js`

Add this route:

```javascript
router.get("/search", isAuthenticated, searchUsers);
```

### Frontend: Create Search Component

**File**: `Frontend/src/components/Search.jsx`

```javascript
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import axios from "axios";
import { Loader2, Search as SearchIcon } from "lucide-react";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `https://campus-connect-bn54.vercel.app/api/v1/user/search?query=${searchQuery}`,
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        setResults(res.data.users);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ml-[16%] p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Search Users
        </h1>

        <div className="relative mb-6">
          <SearchIcon
            className="absolute left-3 top-3 text-gray-400"
            size={20}
          />
          <Input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search by username or bio..."
            className="pl-10 py-6 text-lg border-2 focus-visible:ring-2 focus-visible:ring-purple-500"
          />
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-purple-600" size={32} />
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <p className="text-center text-gray-500 py-8">No users found</p>
        )}

        <div className="space-y-4">
          {results.map((user) => (
            <Link
              key={user._id}
              to={`/profile/${user._id}`}
              className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100"
            >
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{user.username}</h3>
                <p className="text-gray-600 text-sm">{user.bio || "No bio"}</p>
                <span className="text-xs text-purple-600 font-medium">
                  {user.usertype}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
```

### Update App.jsx

Add the route:

```javascript
import Search from './components/Search'

// In browserRouter children:
{
    path: '/search',
    element: <ProtectedRoutes><Search /></ProtectedRoutes>
}
```

### Update LeftSidebar.jsx

Update the sidebarHandler:

```javascript
const sidebarHandler = (textType) => {
  if (textType === "Logout") {
    logoutHandler();
  } else if (textType === "Create") {
    setOpen(true);
  } else if (textType === "Profile") {
    navigate(`/profile/${user?._id}`);
  } else if (textType === "Home") {
    navigate("/");
  } else if (textType === "Messages") {
    navigate("/chat");
  } else if (textType === "Search") {
    navigate("/search");
  }
};
```

---

## 2. Explore Page (2-3 hours)

### Backend: Create Explore API

**File**: `Backend/Controllers/PostController.js`

Add this function:

```javascript
export const getExplorePosts = async (req, res) => {
  try {
    // Get trending posts (most likes in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trendingPosts = await Post.find({
      createdAt: { $gte: sevenDaysAgo },
    })
      .populate({ path: "author", select: "username profilePicture" })
      .sort({ likes: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      posts: trendingPosts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching explore posts",
      success: false,
    });
  }
};

export const getPopularUsers = async (req, res) => {
  try {
    // Get users with most followers
    const popularUsers = await User.find({ _id: { $ne: req.id } })
      .select("-password")
      .sort({ followers: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      users: popularUsers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching popular users",
      success: false,
    });
  }
};
```

**File**: `Backend/Routes/PostRoute.js`

Add routes:

```javascript
router.get("/explore", isAuthenticated, getExplorePosts);
router.get("/popular-users", isAuthenticated, getPopularUsers);
```

### Frontend: Create Explore Component

**File**: `Frontend/src/components/Explore.jsx`

```javascript
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, TrendingUp } from "lucide-react";

const Explore = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [popularUsers, setPopularUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExploreData = async () => {
      try {
        const [postsRes, usersRes] = await Promise.all([
          axios.get(
            "https://campus-connect-bn54.vercel.app/api/v1/post/explore",
            {
              withCredentials: true,
            },
          ),
          axios.get(
            "https://campus-connect-bn54.vercel.app/api/v1/post/popular-users",
            {
              withCredentials: true,
            },
          ),
        ]);

        if (postsRes.data.success) {
          setTrendingPosts(postsRes.data.posts);
        }
        if (usersRes.data.success) {
          setPopularUsers(usersRes.data.users);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchExploreData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen ml-[16%]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="ml-[16%] p-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <TrendingUp className="text-purple-600" />
        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Explore
        </span>
      </h1>

      {/* Popular Users Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Popular Users</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {popularUsers.map((user) => (
            <Link
              key={user._id}
              to={`/profile/${user._id}`}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100"
            >
              <Avatar className="w-20 h-20 mb-2">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-center">{user.username}</h3>
              <p className="text-xs text-gray-600">
                {user.followers?.length || 0} followers
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Posts Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Trending Posts</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trendingPosts.map((post) => (
            <div
              key={post._id}
              className="relative group cursor-pointer bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex items-center gap-4 text-white">
                  <div className="flex items-center gap-1">
                    <Heart fill="white" />
                    <span>{post.likes?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle fill="white" />
                    <span>{post.comments?.length || 0}</span>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={post.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold">
                    {post.author?.username}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {post.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
```

### Update App.jsx

Add the route:

```javascript
import Explore from './components/Explore'

// In browserRouter children:
{
    path: '/explore',
    element: <ProtectedRoutes><Explore /></ProtectedRoutes>
}
```

### Update LeftSidebar.jsx

Update the sidebarHandler:

```javascript
else if (textType === 'Explore') {
    navigate("/explore");
}
```

---

## 3. Complete Notifications System (3-4 hours)

### Backend: Create Notification Model

**File**: `Backend/Models/NotificationModel.js`

```javascript
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "comment", "follow"],
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Notification = mongoose.model("Notification", notificationSchema);
```

### Backend: Create Notification Controller

**File**: `Backend/Controllers/NotificationController.js`

```javascript
import { Notification } from "../Models/NotificationModel.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.id })
      .populate("sender", "username profilePicture")
      .populate("post", "image")
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching notifications",
      success: false,
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    await Notification.findByIdAndUpdate(notificationId, { read: true });

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error marking notification as read",
      success: false,
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.id, read: false },
      { read: true },
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error marking notifications as read",
      success: false,
    });
  }
};
```

### Backend: Create Notification Routes

**File**: `Backend/Routes/NotificationRoute.js`

```javascript
import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../Controllers/NotificationController.js";

const router = express.Router();

router.get("/", isAuthenticated, getNotifications);
router.put("/:notificationId/read", isAuthenticated, markAsRead);
router.put("/read-all", isAuthenticated, markAllAsRead);

export default router;
```

### Backend: Update server.js

Add the notification route:

```javascript
import notificationRoute from "./Routes/NotificationRoute.js";

app.use("/api/v1/notification", notificationRoute);
```

### Backend: Create Notifications on Actions

Update `PostController.js` to create notifications:

```javascript
// In likePost function, after adding like:
if (!post.likes.includes(userId)) {
  post.likes.push(userId);
  await post.save();

  // Create notification
  if (post.author.toString() !== userId) {
    await Notification.create({
      recipient: post.author,
      sender: userId,
      type: "like",
      post: postId,
    });
  }
}

// In addComment function, after creating comment:
const comment = await Comment.create({
  text,
  author: req.id,
  post: postId,
});

// Create notification
if (post.author.toString() !== req.id) {
  await Notification.create({
    recipient: post.author,
    sender: req.id,
    type: "comment",
    post: postId,
  });
}
```

Update `UserController.js` to create follow notifications:

```javascript
// In followOrUnfollow function, after following:
if (!isFollowing) {
  await Promise.all([
    User.updateOne(
      { _id: followKrneWala },
      { $push: { following: jiskoFollowKrunga } },
    ),
    User.updateOne(
      { _id: jiskoFollowKrunga },
      { $push: { followers: followKrneWala } },
    ),
    Notification.create({
      recipient: jiskoFollowKrunga,
      sender: followKrneWala,
      type: "follow",
    }),
  ]);
}
```

### Frontend: Create Notifications Page

**File**: `Frontend/src/components/Notifications.jsx`

```javascript
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, UserPlus, Bell } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "https://campus-connect-bn54.vercel.app/api/v1/notification",
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await axios.put(
        "https://campus-connect-bn54.vercel.app/api/v1/notification/read-all",
        {},
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        toast.success("All notifications marked as read");
        fetchNotifications();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="text-red-500" fill="red" size={20} />;
      case "comment":
        return <MessageCircle className="text-blue-500" size={20} />;
      case "follow":
        return <UserPlus className="text-purple-600" size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "follow":
        return "started following you";
      default:
        return "interacted with you";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen ml-[16%]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="ml-[16%] p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bell className="text-purple-600" />
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Notifications
          </span>
        </h1>
        {notifications.some((n) => !n.read) && (
          <Button onClick={markAllAsRead} variant="outline">
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No notifications yet</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <Link
              key={notification._id}
              to={
                notification.post ? `/` : `/profile/${notification.sender._id}`
              }
              className={`flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors ${
                !notification.read ? "bg-purple-50" : "bg-white"
              } border border-gray-100`}
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={notification.sender?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">
                    {notification.sender?.username}
                  </span>{" "}
                  {getNotificationText(notification)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getNotificationIcon(notification.type)}
                {notification.post?.image && (
                  <img
                    src={notification.post.image}
                    alt="post"
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
```

### Update App.jsx

Add the route:

```javascript
import Notifications from './components/Notifications'

// In browserRouter children:
{
    path: '/notifications',
    element: <ProtectedRoutes><Notifications /></ProtectedRoutes>
}
```

### Update LeftSidebar.jsx

Update the sidebarHandler:

```javascript
else if (textType === 'Notifications') {
    navigate("/notifications");
}
```

---

## Testing Checklist

After implementing these features:

### Search

- [ ] Search for users by username
- [ ] Search for users by bio keywords
- [ ] Verify results update as you type
- [ ] Click on a user to view their profile

### Explore

- [ ] View trending posts
- [ ] View popular users
- [ ] Click on posts/users to navigate
- [ ] Verify posts are sorted by likes

### Notifications

- [ ] Like a post and verify notification is created
- [ ] Comment on a post and verify notification
- [ ] Follow a user and verify notification
- [ ] Mark notifications as read
- [ ] Mark all as read

---

## Estimated Time

- **Search**: 2-3 hours
- **Explore**: 2-3 hours
- **Notifications**: 3-4 hours
- **Total**: 7-10 hours

With these three features implemented, Campus Connect will be feature-complete with all core social media functionality!
