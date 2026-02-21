import { User } from "../Models/UserModel.js";
import { Post } from "../Models/PostModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { username, email, password, usertype} = req.body;
        if (!username||!email ||!password||!usertype) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "This email-id already exists ,try different email",
                success: false,
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword,
            usertype
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        };

        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '7d' });

        // populate each post if in the posts array
        const populatedPosts = await Promise.all(
            user.posts.map( async (postId) => {
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            usertype:user.usertype,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts
        }
        return res.cookie('token', token, { httpOnly: true, sameSite: 'none',secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};

export const logout=async(_,res)=>
{
    try{
        return res.cookie("token","",{maxAge:0}).json(
            {
                message:"Logoed out successfully",
                success:true
            }
        )
    }

    catch(error)
    {
        console.log(error);
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).select('-password').populate({path:'posts', createdAt:-1}).populate('bookmarks');
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        console.log('Edit profile request:', { userId, bio, gender, hasFile: !!profilePicture });

        // Check if file is present and convert it to Data URI
        if (profilePicture) {
            try {
                const fileUri = getDataUri(profilePicture);
                cloudResponse = await cloudinary.uploader.upload(fileUri);
                console.log('Cloudinary upload successful');
            } catch (uploadError) {
                console.log('Cloudinary upload error:', uploadError);
                return res.status(500).json({
                    message: 'Error uploading image to Cloudinary',
                    success: false,
                    error: uploadError.message
                });
            }
        }

        // Find the user
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }

        // Update user profile details
        if (bio !== undefined) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture && cloudResponse) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated successfully.',
            success: true,
            user
        });

    } catch (error) {
        console.log('Edit profile error:', error);
        return res.status(500).json({
            message: 'An error occurred while updating the profile.',
            success: false,
            error: error.message
        });
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
            })
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error);
    }
};

export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id;
        const jiskoFollowKrunga = req.params.id;
        
        console.log('Follow request:', { 
            followKrneWala, 
            jiskoFollowKrunga,
            followKrneWalaType: typeof followKrneWala,
            jiskoFollowKrungaType: typeof jiskoFollowKrunga
        });
        
        if (!followKrneWala) {
            return res.status(401).json({
                message: 'Not authenticated',
                success: false
            });
        }
        
        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);

        console.log('Users found:', { 
            userFound: !!user, 
            targetUserFound: !!targetUser,
            userName: user?.username,
            targetUserName: targetUser?.username
        });

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false,
                debug: {
                    currentUserFound: !!user,
                    targetUserFound: !!targetUser
                }
            });
        }
        
        // mai check krunga ki follow krna hai ya unfollow
        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if (isFollowing) {
            // unfollow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        } else {
            // follow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'followed successfully', success: true });
        }
    } catch (error) {
        console.log('Follow error:', error);
        return res.status(500).json({
            message: 'Error in follow/unfollow',
            success: false,
            error: error.message
        });
    }
}


export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query || query.trim() === '') {
            return res.status(400).json({
                message: 'Search query is required',
                success: false
            });
        }

        // Search users by username or bio (case-insensitive)
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { bio: { $regex: query, $options: 'i' } }
            ],
            _id: { $ne: req.id } // Exclude current user
        }).select('-password').limit(20);

        return res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error searching users',
            success: false
        });
    }
};

export const getFollowers = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate('followers', '-password');
        
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            followers: user.followers
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error fetching followers',
            success: false
        });
    }
};

export const getFollowing = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate('following', '-password');
        
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            following: user.following
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error fetching following',
            success: false
        });
    }
};
