import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "./Models/UserModel.js";
import { Post } from "./Models/PostModel.js";
import { Comment } from "./Models/CommentModel.js";
import connectDB from "./utils/db.js";

dotenv.config();

// Generate 50+ diverse users
const firstNames = ["John", "Sarah", "Mike", "Emma", "Alex", "Lisa", "David", "Maria", "James", "Anna", 
                    "Robert", "Jennifer", "Michael", "Linda", "William", "Patricia", "Richard", "Barbara",
                    "Joseph", "Elizabeth", "Thomas", "Susan", "Charles", "Jessica", "Daniel", "Karen",
                    "Matthew", "Nancy", "Anthony", "Betty", "Mark", "Helen", "Donald", "Sandra", "Steven",
                    "Ashley", "Paul", "Kimberly", "Andrew", "Emily", "Joshua", "Donna", "Kenneth", "Michelle",
                    "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa", "Edward", "Deborah", "Ronald"];

const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez",
                   "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor",
                   "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez",
                   "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright"];

const bios = [
    "Love coding and photography 📸",
    "Coffee lover ☕ | Tech enthusiast",
    "Gamer | Streamer 🎮",
    "Book lover 📚 | Writer",
    "Fitness freak 💪 | Healthy living",
    "Travel addict ✈️ | Adventure seeker",
    "Foodie 🍕 | Chef wannabe",
    "Music lover 🎵 | Guitar player",
    "Artist 🎨 | Creative soul",
    "Sports fan ⚽ | Weekend warrior",
    "Movie buff 🎬 | Netflix addict",
    "Nature lover 🌲 | Hiking enthusiast",
    "Tech geek 💻 | AI researcher",
    "Fashion enthusiast 👗 | Style blogger",
    "Pet lover 🐶 | Animal rights activist",
    "Yoga instructor 🧘 | Mindfulness coach",
    "Entrepreneur 🚀 | Startup founder",
    "Teacher 📝 | Lifelong learner",
    "Photographer 📷 | Visual storyteller",
    "Designer 🎨 | UX/UI specialist"
];

const userTypes = ["Student", "Teacher", "Parent", "Organisation"];

const generateUsers = () => {
    const users = [];
    for (let i = 0; i < 55; i++) {
        const firstName = firstNames[i % firstNames.length];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}${i > 20 ? i : ''}`;
        const email = `${username}@example.com`;
        
        users.push({
            username,
            email,
            password: "password123",
            usertype: userTypes[Math.floor(Math.random() * userTypes.length)],
            bio: bios[Math.floor(Math.random() * bios.length)],
            gender: i % 2 === 0 ? "male" : "female",
            profilePicture: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`
        });
    }
    return users;
};

// Generate diverse posts
const postCaptions = [
    "Beautiful sunset at the beach 🌅",
    "My new coding setup! 💻",
    "Coffee and code ☕️",
    "Weekend vibes 🎉",
    "Nature walk 🌲",
    "Delicious breakfast 🍳",
    "City lights at night 🌃",
    "Workout done! 💪",
    "New book arrived! 📚",
    "Concert night 🎵",
    "Homemade pizza 🍕",
    "Morning yoga session 🧘",
    "Road trip adventures ✈️",
    "Study mode activated 📝",
    "Game night with friends 🎮",
    "Fresh flowers 🌸",
    "Mountain hiking 🏔️",
    "Beach day! 🏖️",
    "Art project in progress 🎨",
    "Late night coding session 👨‍💻",
    "Healthy meal prep 🥗",
    "Pet cuddles 🐶",
    "New gadget unboxing 📦",
    "Sunset photography 📸",
    "Coffee shop vibes ☕",
    "Gym progress 💪",
    "Weekend brunch 🥞",
    "Movie marathon 🎬",
    "Garden blooming 🌺",
    "New recipe tried 👨‍🍳",
    "Campus life 🎓",
    "Team project success 🎯",
    "Morning run 🏃",
    "Cozy reading corner 📖",
    "Tech conference 🎤",
    "Birthday celebration 🎂",
    "New haircut 💇",
    "Rainy day mood 🌧️",
    "Stargazing night ✨",
    "Farmers market finds 🥕"
];

const postImages = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=800&fit=crop"
];

const commentTexts = [
    "Amazing! 😍", "Love this!", "Great shot! 📸", "So cool!", "Awesome work!",
    "Beautiful! ❤️", "Nice one!", "This is great!", "Incredible!", "Stunning!",
    "Perfect! 👌", "Wow! 🤩", "Fantastic!", "Love it! 💕", "Amazing view!",
    "So beautiful!", "Great job!", "Impressive!", "Wonderful!", "Gorgeous!",
    "This is awesome!", "Love the vibes!", "So inspiring!", "Keep it up!",
    "Brilliant!", "Spectacular!", "Breathtaking!", "Lovely!", "Superb!",
    "Outstanding!", "Magnificent!", "Excellent!", "Fabulous!", "Terrific!"
];

const seedDatabase = async () => {
    try {
        await connectDB();
        
        // Clear existing data
        console.log("Clearing existing data...");
        await User.deleteMany({});
        await Post.deleteMany({});
        await Comment.deleteMany({});
        
        // Create users
        console.log("Creating 55 users...");
        const sampleUsers = generateUsers();
        const createdUsers = [];
        
        for (const userData of sampleUsers) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = await User.create({
                ...userData,
                password: hashedPassword
            });
            createdUsers.push(user);
        }
        console.log(`✅ Created ${createdUsers.length} users`);
        
        // Create 100+ posts
        console.log("Creating 120 posts...");
        const createdPosts = [];
        for (let i = 0; i < 120; i++) {
            const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
            const caption = postCaptions[i % postCaptions.length];
            const image = postImages[i % postImages.length];
            
            const post = await Post.create({
                caption,
                image,
                author: randomUser._id
            });
            
            // Add post to user's posts array
            randomUser.posts.push(post._id);
            await randomUser.save();
            
            createdPosts.push(post);
        }
        console.log(`✅ Created ${createdPosts.length} posts`);
        
        // Add comments to posts
        console.log("Creating comments...");
        let totalComments = 0;
        for (const post of createdPosts) {
            // Add 3-8 random comments to each post
            const commentCount = Math.floor(Math.random() * 6) + 3;
            for (let i = 0; i < commentCount; i++) {
                const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
                const randomCommentText = commentTexts[Math.floor(Math.random() * commentTexts.length)];
                
                const comment = await Comment.create({
                    text: randomCommentText,
                    author: randomUser._id,
                    post: post._id
                });
                
                post.comments.push(comment._id);
                totalComments++;
            }
            await post.save();
        }
        console.log(`✅ Created ${totalComments} comments`);
        
        // Add likes to posts
        console.log("Adding likes to posts...");
        for (const post of createdPosts) {
            // Add 5-20 random likes to each post
            const likeCount = Math.floor(Math.random() * 16) + 5;
            const likedUsers = new Set();
            
            for (let i = 0; i < likeCount; i++) {
                const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
                if (!likedUsers.has(randomUser._id.toString())) {
                    post.likes.push(randomUser._id);
                    likedUsers.add(randomUser._id.toString());
                }
            }
            await post.save();
        }
        console.log("✅ Added likes to posts");
        
        // Create follow relationships
        console.log("Creating follow relationships...");
        for (let i = 0; i < createdUsers.length; i++) {
            const user = createdUsers[i];
            const otherUsers = createdUsers.filter((u, index) => index !== i);
            
            // Each user follows 5-15 random users
            const followCount = Math.floor(Math.random() * 11) + 5;
            const shuffled = otherUsers.sort(() => 0.5 - Math.random());
            
            for (let j = 0; j < followCount && j < shuffled.length; j++) {
                const userToFollow = shuffled[j];
                
                if (!user.following.includes(userToFollow._id)) {
                    user.following.push(userToFollow._id);
                    userToFollow.followers.push(user._id);
                    await userToFollow.save();
                }
            }
            await user.save();
        }
        console.log("✅ Created follow relationships");
        
        console.log("\n🎉 Database seeded successfully!");
        console.log("\n📊 Summary:");
        console.log(`   Users: ${createdUsers.length}`);
        console.log(`   Posts: ${createdPosts.length}`);
        console.log(`   Comments: ${totalComments}`);
        console.log("\n🔑 Sample login credentials:");
        console.log("   Email: john_smith@example.com | Password: password123");
        console.log("   Email: sarah_johnson@example.com | Password: password123");
        console.log("   Email: mike_williams@example.com | Password: password123");
        console.log("\n💡 All users have password: password123");
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
