import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, TrendingUp } from 'lucide-react'

const Explore = () => {
    const [trendingPosts, setTrendingPosts] = useState([]);
    const [popularUsers, setPopularUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExploreData = async () => {
            try {
                const [postsRes, usersRes] = await Promise.all([
                    axios.get('https://campus-connect-bn54.vercel.app/api/v1/post/explore', { withCredentials: true }),
                    axios.get('https://campus-connect-bn54.vercel.app/api/v1/post/popular-users', { withCredentials: true })
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
            <div className='flex items-center justify-center min-h-screen ml-[16%]'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600'></div>
            </div>
        );
    }

    return (
        <div className='ml-[16%] p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen'>
            <h1 className='text-3xl font-bold mb-8 flex items-center gap-2'>
                <TrendingUp className='text-purple-600' />
                <span className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                    Explore
                </span>
            </h1>

            {/* Popular Users Section */}
            <div className='mb-12'>
                <h2 className='text-xl font-semibold mb-4'>Popular Users</h2>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                    {popularUsers.map((user) => (
                        <Link 
                            key={user._id} 
                            to={`/profile/${user._id}`}
                            className='flex flex-col items-center p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-purple-100 hover:scale-105'
                        >
                            <Avatar className='w-20 h-20 mb-2 ring-2 ring-purple-200 ring-offset-2'>
                                <AvatarImage src={user.profilePicture} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <h3 className='font-semibold text-center text-sm'>{user.username}</h3>
                            <p className='text-xs text-gray-600'>{user.followerCount || 0} followers</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Trending Posts Section */}
            <div>
                <h2 className='text-xl font-semibold mb-4'>Trending Posts</h2>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {trendingPosts.map((post) => (
                        <div 
                            key={post._id}
                            className='relative group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105'
                        >
                            <img 
                                src={post.image} 
                                alt={post.caption}
                                className='w-full aspect-square object-cover'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center'>
                                <div className='flex items-center gap-4 text-white'>
                                    <div className='flex items-center gap-1'>
                                        <Heart fill='white' />
                                        <span>{post.likes?.length || 0}</span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <MessageCircle fill='white' />
                                        <span>{post.comments?.length || 0}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='p-3'>
                                <div className='flex items-center gap-2 mb-2'>
                                    <Avatar className='w-6 h-6 ring-1 ring-purple-200'>
                                        <AvatarImage src={post.author?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <span className='text-sm font-semibold'>{post.author?.username}</span>
                                </div>
                                <p className='text-sm text-gray-600 line-clamp-2'>{post.caption}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Explore
