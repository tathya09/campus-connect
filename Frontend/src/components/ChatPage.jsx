import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("");
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
    const { onlineUsers, messages } = useSelector(store => store.chat);
    const dispatch = useDispatch();

    // Filter to show users that the logged-in user is following
    const followingUsers = suggestedUsers.filter(suggestedUser => 
        user?.following?.includes(suggestedUser._id)
    );

    // If no following users, show all suggested users for messaging
    const usersToShow = followingUsers.length > 0 ? followingUsers : suggestedUsers;

    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`http://localhost:3000/api/v1/message/send/${receiverId}`, { textMessage }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        }
    }, []);

    return (
        <div className='flex ml-[16%] h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'>
            <section className='w-full md:w-1/4 my-8 ml-4'>
                <h1 className='font-bold mb-4 px-3 text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>{user?.username}</h1>
                <hr className='mb-4 border-gray-300' />
                <div className='overflow-y-auto h-[80vh] space-y-2'>
                    {
                        usersToShow.length === 0 ? (
                            <p className='text-center text-gray-500 mt-4'>Follow users to start messaging</p>
                        ) : (
                            usersToShow.map((suggestedUser) => {
                                const isOnline = onlineUsers.includes(suggestedUser?._id);
                                return (
                                    <div key={suggestedUser._id} onClick={() => dispatch(setSelectedUser(suggestedUser))} className='flex gap-3 items-center p-3 hover:bg-white rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md border border-transparent hover:border-purple-200'>
                                        <Avatar className='w-14 h-14 ring-2 ring-purple-200 ring-offset-2'>
                                            <AvatarImage src={suggestedUser?.profilePicture} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div className='flex flex-col flex-1'>
                                            <span className='font-semibold text-gray-800'>{suggestedUser?.username}</span>
                                            <span className={`text-xs font-semibold ${isOnline ? 'text-green-600' : 'text-red-600'} `}>{isOnline ? 'online' : 'offline'}</span>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    }
                </div>

            </section>
            {
                selectedUser ? (
                    <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full bg-white rounded-l-2xl shadow-xl my-8 mr-4'>
                        <div className='flex gap-3 items-center px-3 py-4 border-b border-gray-200 sticky top-0 bg-gradient-to-r from-purple-50 to-pink-50 z-10 rounded-tl-2xl'>
                            <Avatar className='ring-2 ring-purple-200 ring-offset-2'>
                                <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                                <span className='font-semibold text-gray-800'>{selectedUser?.username}</span>
                            </div>
                        </div>
                        <Messages selectedUser={selectedUser} />
                        <div className='flex items-center p-4 border-t border-t-gray-200 bg-gray-50'>
                            <Input value={textMessage} onChange={(e) => setTextMessage(e.target.value)} type="text" className='flex-1 mr-2 focus-visible:ring-purple-500 bg-white rounded-xl' placeholder="Messages..." />
                            <Button onClick={() => sendMessageHandler(selectedUser?._id)} className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'>Send</Button>
                        </div>
                    </section>
                ) : (
                    <div className='flex flex-col items-center justify-center mx-auto flex-1'>
                        <MessageCircleCode className='w-32 h-32 my-4 text-purple-300' />
                        <h1 className='font-semibold text-2xl text-gray-600'>Your messages</h1>
                        <span className='text-gray-500'>Send a message to start a chat.</span>
                    </div>
                )
            }
        </div>
    )
}

export default ChatPage
