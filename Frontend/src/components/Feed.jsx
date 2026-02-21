import React from 'react'
import Posts from './Posts'

const Feed = () => {
  return (
    <div className='flex-1 my-8 flex flex-col items-center pl-[20%] bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen'>
      <Posts />
    </div>
  )
}

export default Feed
