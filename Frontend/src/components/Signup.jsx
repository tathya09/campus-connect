import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const Signup = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
        usertype: ""  
    });
    const [loading, setLoading] = useState(false);
    const {user} = useSelector(store=>store.auth);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:3000/api/v1/user/register', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: "",
                    usertype: ""
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])
    return (
        <div className='flex items-center w-screen h-screen justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50'>
            <form onSubmit={signupHandler} className='shadow-2xl flex flex-col gap-5 p-8 bg-white rounded-2xl w-96 border border-gray-100'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>Campus Connect</h1>
                    <p className='text-sm text-center text-gray-600 mt-2'>Sign up to connect with friends</p>
                </div>
                <div>
                    <span className='font-medium text-gray-700'>Username</span>
                    <Input
                        type="text"
                        name="username"
                        value={input.username}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-2 focus-visible:ring-purple-500 my-2 border-gray-300"
                        placeholder="Choose a username"
                    />
                </div>
                <div>
    <span className='font-medium text-gray-700'>User Type</span>
    <select
        name="usertype"
        value={input.usertype}
        onChange={changeEventHandler}
        className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 my-2"
        required
    >
        <option value="" disabled>Select User Type</option>
        <option value="Student">Student</option>
        <option value="Parent">Parent</option>
        <option value="Organisation">Organisation</option>
        <option value="Teacher">Teacher</option>
    </select> 
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
                        placeholder="Create a password"
                    />
                </div>
                {
                    loading ? (
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        <Button type='submit' className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">Sign up</Button>
                    )
                }
                <span className='text-center text-sm text-gray-600'>Already have an account? <Link to="/login" className='text-purple-600 font-semibold hover:text-purple-700'>Login</Link></span>
            </form>
        </div>
    )
}

export default Signup