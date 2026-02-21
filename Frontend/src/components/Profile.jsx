import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser, setSelectedUser } from '@/redux/authSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');
  const [showFollowersDialog, setShowFollowersDialog] = useState(false);
  const [showFollowingDialog, setShowFollowingDialog] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userProfile, user } = useSelector(store => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = user?.following?.some(id => id.toString() === userProfile?._id?.toString());

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  const followOrUnfollowHandler = async () => {
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

  const handleMessage = () => {
    dispatch(setSelectedUser(userProfile));
    navigate('/chat');
  }

  const fetchFollowers = async () => {
    try {
      const res = await axios.get(`https://campus-connect-bn54.vercel.app/api/v1/user/${userId}/followers`, { withCredentials: true });
      if (res.data.success) {
        setFollowersList(res.data.followers);
        setShowFollowersDialog(true);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch followers');
    }
  }

  const fetchFollowing = async () => {
    try {
      const res = await axios.get(`https://campus-connect-bn54.vercel.app/api/v1/user/${userId}/following`, { withCredentials: true });
      if (res.data.success) {
        setFollowingList(res.data.following);
        setShowFollowingDialog(true);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch following');
    }
  }

  const handleUserClick = (clickedUserId) => {
    setShowFollowersDialog(false);
    setShowFollowingDialog(false);
    navigate(`/profile/${clickedUserId}`);
  }

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className='flex max-w-5xl justify-center mx-auto pl-10 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen'>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2 bg-white rounded-2xl shadow-lg p-8'>
          <section className='flex items-center justify-center'>
            <Avatar className='h-32 w-32 ring-4 ring-purple-200 ring-offset-4'>
              <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-2'>
                <span>{userProfile?.username}</span>
                {
                  isLoggedInUserProfile ? (
                    <>
                      <Link to="/account/edit"><Button variant='secondary' className='hover:bg-gray-200 h-8'>Edit profile</Button></Link>
                      <Button variant='secondary' className='hover:bg-gray-200 h-8'>View archive</Button>
                      <Button variant='secondary' className='hover:bg-gray-200 h-8'>Ad tools</Button>
                    </>
                  ) : (
                    isFollowing ? (
                      <>
                        <Button onClick={followOrUnfollowHandler} variant='secondary' className='h-8 hover:bg-gray-200'>Unfollow</Button>
                        <Button onClick={handleMessage} variant='secondary' className='h-8 hover:bg-gray-200'>Message</Button>
                      </>
                    ) : (
                      <Button onClick={followOrUnfollowHandler} className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-8'>Follow</Button>
                    )
                  )
                }
              </div>
              <div className='flex items-center gap-4'>
                <p><span className='font-semibold'>{userProfile?.posts.length} </span>posts</p>
                <p className='cursor-pointer hover:text-gray-600' onClick={fetchFollowers}>
                  <span className='font-semibold'>{userProfile?.followers.length} </span>followers
                </p>
                <p className='cursor-pointer hover:text-gray-600' onClick={fetchFollowing}>
                  <span className='font-semibold'>{userProfile?.following.length} </span>following
                </p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='font-semibold'>{userProfile?.bio || 'bio here...'}</span>
                <Badge className='w-fit' variant='secondary'><AtSign /> <span className='pl-1'>{userProfile?.username}</span> </Badge>
                <span>🤯Learn code with patel mernstack style</span>
                <span>🤯Turning code into fun</span>
                <span>🤯DM for collaboration</span>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange('posts')}>
              POSTS
            </span>
            <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={() => handleTabChange('saved')}>
              SAVED
            </span>
            <span className='py-3 cursor-pointer'>REELS</span>
            <span className='py-3 cursor-pointer'>TAGS</span>
          </div>
          <div className='grid grid-cols-3 gap-1'>
            {
              displayedPost?.map((post) => {
                return (
                  <div key={post?._id} className='relative group cursor-pointer'>
                    <img src={post.image} alt='postimage' className='rounded-sm my-2 w-full aspect-square object-cover' />
                    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <div className='flex items-center text-white space-x-4'>
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <Heart />
                          <span>{post?.likes.length}</span>
                        </button>
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <MessageCircle />
                          <span>{post?.comments.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>

      {/* Followers Dialog */}
      <Dialog open={showFollowersDialog} onOpenChange={setShowFollowersDialog}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Followers</DialogTitle>
          </DialogHeader>
          <div className='max-h-96 overflow-y-auto'>
            {followersList.length === 0 ? (
              <p className='text-center text-gray-500 py-4'>No followers yet</p>
            ) : (
              followersList.map((follower) => (
                <div 
                  key={follower._id} 
                  className='flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer'
                  onClick={() => handleUserClick(follower._id)}
                >
                  <div className='flex items-center gap-3'>
                    <Avatar>
                      <AvatarImage src={follower.profilePicture} />
                      <AvatarFallback>{follower.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-semibold text-sm'>{follower.username}</p>
                      <p className='text-xs text-gray-500'>{follower.bio || 'No bio'}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Following Dialog */}
      <Dialog open={showFollowingDialog} onOpenChange={setShowFollowingDialog}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Following</DialogTitle>
          </DialogHeader>
          <div className='max-h-96 overflow-y-auto'>
            {followingList.length === 0 ? (
              <p className='text-center text-gray-500 py-4'>Not following anyone yet</p>
            ) : (
              followingList.map((following) => (
                <div 
                  key={following._id} 
                  className='flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer'
                  onClick={() => handleUserClick(following._id)}
                >
                  <div className='flex items-center gap-3'>
                    <Avatar>
                      <AvatarImage src={following.profilePicture} />
                      <AvatarFallback>{following.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-semibold text-sm'>{following.username}</p>
                      <p className='text-xs text-gray-500'>{following.bio || 'No bio'}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Profile
