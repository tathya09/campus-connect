import { readFileAsDataURL } from '@/lib/utils';
import axios from 'axios';
import { Loader2, Sparkles } from 'lucide-react';
import React, { useRef, useState } from 'react'
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const CreatePost = ({ open, setOpen }) => {
    const imageRef = useRef();
    const [file, setFile] = useState("");
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
    const [hashtags, setHashtags] = useState([]);
    const [generatingHashtags, setGeneratingHashtags] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const dispatch = useDispatch();

    // AI Caption Generator - Real AI using Hugging Face
    const generateCaptionSuggestions = async () => {
        setGeneratingSuggestions(true);
        
        try {
            // Try to use Hugging Face's BLIP model for real image captioning
            const response = await fetch(
                'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        inputs: imagePreview
                    })
                }
            );

            if (response.ok) {
                const result = await response.json();
                const aiCaption = result[0]?.generated_text || '';
                
                if (aiCaption) {
                    // Generate creative variations based on AI's understanding
                    const hour = new Date().getHours();
                    let timeEmoji = '✨';
                    let timeHashtag = '';
                    
                    if (hour >= 5 && hour < 12) {
                        timeEmoji = '☀️';
                        timeHashtag = '#morningvibes';
                    } else if (hour >= 12 && hour < 17) {
                        timeEmoji = '🌤️';
                        timeHashtag = '#afternoonmood';
                    } else {
                        timeEmoji = '🌙';
                        timeHashtag = '#eveningvibes';
                    }
                    
                    const variations = [
                        `${aiCaption} ${timeEmoji}`,
                        `Just captured: ${aiCaption} 📸 ${timeHashtag}`,
                        `${aiCaption} 💫 #campuslife`,
                        `${aiCaption.charAt(0).toUpperCase() + aiCaption.slice(1)} 🌟`
                    ];
                    
                    setSuggestions(variations);
                    
                    // Generate AI hashtags based on image description
                    generateAIHashtags(aiCaption);
                    
                    toast.success('AI analyzed your image!');
                } else {
                    // Fallback to templates if AI returns empty
                    generateTemplateSuggestions();
                }
            } else {
                // If API fails, use templates
                console.log('AI API unavailable, using templates');
                generateTemplateSuggestions();
            }
        } catch (error) {
            console.log('AI error, using templates:', error);
            generateTemplateSuggestions();
        } finally {
            setGeneratingSuggestions(false);
        }
    };

    // Fallback template-based suggestions
    const generateTemplateSuggestions = () => {
        const suggestions = [
            "Capturing moments that matter ✨",
            "Living my best life 🌟",
            "Making memories one day at a time 📸",
            "Good vibes only 🌈",
            "Chasing dreams and sunsets 🌅"
        ];
        
        // Add some variety based on time of day
        const hour = new Date().getHours();
        if (hour < 12) {
            suggestions.push("Morning motivation 🌄");
            suggestions.push("Rise and shine ☀️");
        } else if (hour < 18) {
            suggestions.push("Afternoon adventures 🎯");
            suggestions.push("Making the most of today 💫");
        } else {
            suggestions.push("Evening vibes 🌙");
            suggestions.push("Night owl mode 🦉");
        }
        
        // Shuffle and pick 4 random suggestions
        const shuffled = suggestions.sort(() => 0.5 - Math.random());
        setSuggestions(shuffled.slice(0, 4));
    };

    const applySuggestion = (suggestion) => {
        setCaption(suggestion);
        toast.success("Caption applied!");
    };

    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const dataUrl = await readFileAsDataURL(file);
            setImagePreview(dataUrl);
            // Auto-generate suggestions when image is uploaded
            generateCaptionSuggestions();
        }
    }

    const createPostHandler = async (e) => {
        const formData = new FormData();
        formData.append("caption", caption);
        if (imagePreview) formData.append("image", file);
        try {
            setLoading(true);
            const res = await axios.post('https://campus-connect-bn54.vercel.app/api/v1/post/addpost', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setPosts([res.data.post, ...posts]));
                toast.success(res.data.message);
                setOpen(false);
                // Reset state
                setCaption("");
                setImagePreview("");
                setSuggestions([]);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    // AI-powered Hashtag Generator
    const generateAIHashtags = async (imageDescription) => {
        setGeneratingHashtags(true);
        
        try {
            // Use zero-shot classification to categorize the image
            const response = await fetch(
                'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        inputs: imageDescription,
                        parameters: {
                            candidate_labels: [
                                "nature", "food", "travel", "fashion", "fitness", 
                                "technology", "art", "music", "sports", "education",
                                "friends", "family", "celebration", "work", "study"
                            ]
                        }
                    })
                }
            );

            if (response.ok) {
                const result = await response.json();
                const topCategories = result.labels.slice(0, 3);
                
                // Generate hashtags based on categories and time
                const hour = new Date().getHours();
                const timeHashtags = hour < 12 ? ['morning', 'sunrise'] : 
                                    hour < 18 ? ['afternoon', 'daytime'] : 
                                    ['evening', 'night'];
                
                const generatedHashtags = [
                    ...topCategories.map(cat => cat.toLowerCase()),
                    ...timeHashtags.slice(0, 1),
                    'campuslife',
                    'instagood'
                ];
                
                setHashtags(generatedHashtags.slice(0, 6));
            } else {
                generateFallbackHashtags();
            }
        } catch (error) {
            console.log('Hashtag AI error:', error);
            generateFallbackHashtags();
        } finally {
            setGeneratingHashtags(false);
        }
    };

    const generateFallbackHashtags = () => {
        const hour = new Date().getHours();
        const timeHashtags = hour < 12 ? ['morning', 'sunrise', 'morningvibes'] : 
                            hour < 18 ? ['afternoon', 'daytime', 'goodvibes'] : 
                            ['evening', 'night', 'nightlife'];
        
        const commonHashtags = ['campuslife', 'instagood', 'photooftheday', 'instadaily'];
        setHashtags([...timeHashtags.slice(0, 2), ...commonHashtags.slice(0, 4)]);
    };

    const addHashtagToCaption = (hashtag) => {
        const hashtagText = `#${hashtag}`;
        if (!caption.includes(hashtagText)) {
            setCaption(caption ? `${caption} ${hashtagText}` : hashtagText);
            toast.success(`Added ${hashtagText}`);
        }
    };

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-2xl">
                <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>
                <div className='flex gap-3 items-center'>
                    <Avatar>
                        <AvatarImage src={user?.profilePicture} alt="img" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className='font-semibold text-xs'>{user?.username}</h1>
                        <span className='text-gray-600 text-xs'>{user?.bio}</span>
                    </div>
                </div>
                
                <Textarea 
                    value={caption} 
                    onChange={(e) => setCaption(e.target.value)} 
                    className="focus-visible:ring-transparent border-none" 
                    placeholder="Write a caption..." 
                />
                
                {/* AI Caption Suggestions - Powered by Hugging Face */}
                {imagePreview && suggestions.length > 0 && (
                    <div className='space-y-2'>
                        <div className='flex items-center gap-2 text-sm font-semibold text-purple-600'>
                            <Sparkles size={16} className='animate-pulse' />
                            <span>AI Caption Suggestions</span>
                            <span className='text-xs font-normal text-gray-500'>(Powered by Hugging Face)</span>
                        </div>
                        <div className='grid grid-cols-2 gap-2'>
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => applySuggestion(suggestion)}
                                    className='text-left p-3 text-sm bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-lg border border-purple-200 transition-all hover:scale-102 hover:shadow-md'
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={generateCaptionSuggestions}
                            disabled={generatingSuggestions}
                            className='text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1 font-medium'
                        >
                            {generatingSuggestions ? (
                                <>
                                    <Loader2 className='animate-spin' size={12} />
                                    AI is analyzing your image...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={12} />
                                    Regenerate with AI
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* AI Hashtag Suggestions */}
                {imagePreview && hashtags.length > 0 && (
                    <div className='space-y-2'>
                        <div className='flex items-center gap-2 text-sm font-semibold text-blue-600'>
                            <span className='text-lg'>#</span>
                            <span>AI Hashtag Suggestions</span>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            {hashtags.map((hashtag, index) => (
                                <button
                                    key={index}
                                    onClick={() => addHashtagToCaption(hashtag)}
                                    className='px-3 py-1 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full border border-blue-200 transition-all hover:scale-105'
                                >
                                    #{hashtag}
                                </button>
                            ))}
                        </div>
                        {generatingHashtags && (
                            <p className='text-xs text-gray-500 flex items-center gap-1'>
                                <Loader2 className='animate-spin' size={12} />
                                Generating smart hashtags...
                            </p>
                        )}
                    </div>
                )}
                
                {
                    imagePreview && (
                        <div className='w-full h-64 flex items-center justify-center'>
                            <img src={imagePreview} alt="preview_img" className='object-cover h-full w-full rounded-md' />
                        </div>
                    )
                }
                <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} />
                <Button onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]'>Select from computer</Button>
                {
                    imagePreview && (
                        loading ? (
                            <Button>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please wait
                            </Button>
                        ) : (
                            <Button onClick={createPostHandler} type="submit" className="w-full">Post</Button>
                        )
                    )
                }
            </DialogContent>
        </Dialog>
    )
}

export default CreatePost
