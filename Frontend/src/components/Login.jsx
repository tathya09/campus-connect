import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:3000/api/v1/user/login', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
                setInput({
                    email: "",
                    password: ""
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])

    return (
        <div className='flex items-center w-screen h-screen justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50'>
            <form onSubmit={signupHandler} className='shadow-2xl flex flex-col gap-5 p-8 bg-white rounded-2xl w-96 border border-gray-100'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>Campus Connect</h1>
                    <p className='text-sm text-center text-gray-600 mt-2'>Login to connect with friends</p>
                </div>
                <div>
                    <span className='font-medium text-gray-700'>Email</span>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-2 focus-visible:ring-purple-500 my-2 border-gray-300"
                        placeholder="Enter your email"
                    />
                </div>
                <div>
                    <span className='font-medium text-gray-700'>Password</span>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-2 focus-visible:ring-purple-500 my-2 border-gray-300"
                        placeholder="Enter your password"
                    />
                </div>
                {
                    loading ? (
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        <Button type='submit' className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">Login</Button>
                    )
                }
                <span className='text-center text-sm text-gray-600'>Don't have an account? <Link to="/signup" className='text-purple-600 font-semibold hover:text-purple-700'>Sign up</Link></span>
            </form>
        </div>
    )
}

export default Login
