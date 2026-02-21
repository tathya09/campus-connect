import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';

const SuggestedUsers = () => {
    const { suggestedUsers, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    
    const followHandler = async (userId) => {
        try {
            const res = await axios.post(`https://campus-connect-bn54.vercel.app/api/v1/user/followorunfollow/${userId}`, {}, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                
                // Update the user's following list in Redux
                const isCurrentlyFollowing = user?.following?.some(id => id.toString() === userId.toString());
                const updatedFollowing = isCurrentlyFollowing 
                    ? user.following.filter(id => id.toString() !== userId.toString())
                    : [...(user.following || []), userId];
                
                dispatch(setAuthUser({ ...user, following: updatedFollowing }));
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    }
    
    return (
        <div className='my-10'>
            <div className='flex items-center justify-between text-sm'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>
            </div>
            {
                suggestedUsers.map((suggestedUser) => {
                    const isFollowing = user?.following?.some(id => id.toString() === suggestedUser._id.toString());
                    return (
                        <div key={suggestedUser._id} className='flex items-center justify-between my-5'>
                            <div className='flex items-center gap-2'>
                                <Link to={`/profile/${suggestedUser?._id}`}>
                                    <Avatar>
                                        <AvatarImage src={suggestedUser?.profilePicture} alt="post_image" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <h1 className='font-semibold text-sm'><Link to={`/profile/${suggestedUser?._id}`}>{suggestedUser?.username}</Link></h1>
                                    <span className='text-gray-600 text-sm'>{suggestedUser?.bio || 'Bio here...'}</span>
                                </div>
                            </div>
                            <span 
                                onClick={() => followHandler(suggestedUser._id)} 
                                className={`text-xs font-bold cursor-pointer ${isFollowing ? 'text-gray-600 hover:text-gray-700' : 'text-purple-600 hover:text-purple-700'}`}
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </span>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default SuggestedUsers
