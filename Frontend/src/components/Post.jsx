import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'

const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post.likes.length);
    const [comment, setComment] = useState(post.comments);
    const [bookmarked, setBookmarked] = useState(user?.bookmarks?.includes(post._id) || false);
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    }

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`https://campus-connect-bn54.vercel.app/api/v1/post/${post._id}/${action}`, { withCredentials: true });
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                setLiked(!liked);

                // apne post ko update krunga
                const updatedPostData = posts.map(p =>
                    p._id === post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const commentHandler = async () => {

        try {
            const res = await axios.post(`https://campus-connect-bn54.vercel.app/api/v1/post/${post._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updatedCommentData } : p
                );

                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`https://campus-connect-bn54.vercel.app/api/v1/post/delete/${post?._id}`, { withCredentials: true })
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`https://campus-connect-bn54.vercel.app/api/v1/post/${post?._id}/bookmark`, { withCredentials: true });
            if (res.data.success) {
                setBookmarked(!bookmarked);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='my-8 w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300'>
            <div className='flex items-center justify-between p-4'>
                <div className='flex items-center gap-2'>
                    <Avatar className="ring-2 ring-purple-200 ring-offset-2">
                        <AvatarImage src={post.author?.profilePicture} alt="post_image" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex items-center gap-3'>
                        <h1 className='font-semibold text-gray-800'>{post.author?.username}</h1>
                        {user?._id === post.author._id && <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0">Author</Badge>}
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer hover:bg-gray-100 rounded-full p-1 transition-colors' />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center bg-white">
                        {
                            post?.author?._id !== user?._id && <Button variant='ghost' className="cursor-pointer w-fit text-[#ED4956] font-bold">Unfollow</Button>
                        }

                        <Button variant='ghost' className="cursor-pointer w-fit">Add to favorites</Button>
                        {
                            user && user?._id === post?.author._id && <Button onClick={deletePostHandler} variant='ghost' className="cursor-pointer w-fit">Delete</Button>
                        }
                    </DialogContent>
                </Dialog>
            </div>
            <img
                className='w-full aspect-square object-cover'
                src={post.image}
                alt="post_img"
            />
            <div className='p-4'>
                <div className='flex items-center justify-between my-2'>
                    <div className='flex items-center gap-4'>
                        {
                            liked ? <FaHeart onClick={likeOrDislikeHandler} size={'24'} className='cursor-pointer text-red-500 hover:scale-110 transition-transform' /> : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600 hover:scale-110 transition-transform' />
                        }
                        <MessageCircle onClick={() => {
                            dispatch(setSelectedPost(post));
                            setOpen(true);
                        }} className='cursor-pointer hover:text-purple-600 hover:scale-110 transition-transform' />
                        <Send className='cursor-pointer hover:text-purple-600 hover:scale-110 transition-transform' />
                    </div>
                    {
                        bookmarked ? <FaBookmark onClick={bookmarkHandler} size={'20'} className='cursor-pointer text-purple-600 hover:scale-110 transition-transform' /> : <FaRegBookmark onClick={bookmarkHandler} size={'20'} className='cursor-pointer hover:text-purple-600 hover:scale-110 transition-transform' />
                    }
                </div>
                <span className='font-semibold block mb-2 text-gray-800'>{postLike} likes</span>
                <p className='text-gray-700'>
                    <span className='font-semibold mr-2'>{post.author?.username}</span>
                    {post.caption}
                </p>
                {
                    comment.length > 0 && (
                        <span onClick={() => {
                            dispatch(setSelectedPost(post));
                            setOpen(true);
                        }} className='cursor-pointer text-sm text-gray-500 hover:text-gray-700'>View all {comment.length} comments</span>
                    )
                }
                <CommentDialog open={open} setOpen={setOpen} />
                <div className='flex items-center justify-between mt-3 pt-3 border-t border-gray-100'>
                    <input
                        type="text"
                        placeholder='Add a comment...'
                        value={text}
                        onChange={changeEventHandler}
                        className='outline-none text-sm w-full text-gray-600 placeholder:text-gray-400'
                    />
                    {
                        text && <span onClick={commentHandler} className='text-purple-600 cursor-pointer font-semibold hover:text-purple-700'>Post</span>
                    }
                </div>
            </div>
        </div>
    )
}

export default Post
