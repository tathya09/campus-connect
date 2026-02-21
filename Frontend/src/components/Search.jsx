import React, { useState, useEffect } from 'react'
import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Loader2, Search as SearchIcon } from 'lucide-react'

const Search = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query.trim()) {
                handleSearch(query);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSearch = async (searchQuery) => {
        setLoading(true);
        try {
            const res = await axios.get(`https://campus-connect-bn54.vercel.app/api/v1/user/search?query=${searchQuery}`, {
                withCredentials: true
            });
            if (res.data.success) {
                setResults(res.data.users);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col items-center justify-start min-h-screen ml-[16%] p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'>
            <div className='w-full max-w-2xl'>
                <h1 className='text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                    Search Users
                </h1>
                
                <div className='relative mb-6'>
                    <SearchIcon className='absolute left-3 top-3 text-gray-400' size={20} />
                    <Input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by username or bio..."
                        className="pl-10 py-6 text-lg border-2 focus-visible:ring-2 focus-visible:ring-purple-500 bg-white rounded-xl shadow-md"
                    />
                </div>

                {loading && (
                    <div className='flex justify-center py-8'>
                        <Loader2 className='animate-spin text-purple-600' size={32} />
                    </div>
                )}

                {!loading && query && results.length === 0 && (
                    <p className='text-center text-gray-500 py-8'>No users found</p>
                )}

                <div className='space-y-4'>
                    {results.map((user) => (
                        <Link 
                            key={user._id} 
                            to={`/profile/${user._id}`}
                            className='flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-purple-100 hover:scale-102'
                        >
                            <Avatar className='w-16 h-16 ring-2 ring-purple-200 ring-offset-2'>
                                <AvatarImage src={user.profilePicture} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='flex-1'>
                                <h3 className='font-semibold text-lg'>{user.username}</h3>
                                <p className='text-gray-600 text-sm line-clamp-1'>{user.bio || 'No bio'}</p>
                                <span className='text-xs text-purple-600 font-medium'>{user.usertype}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Search
