import React from 'react'
import { useSelector } from "react-redux"

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user)
  return (
    <div className='p-3 max-w-lg mx-auto gap-4'>
      <h1 className='text-3xl font-semibold text text-center my-7'> Profile </h1>
      <form className='flex flex-col'>
        <img
          src={currentUser.avatar}
          alt="User profile photo showing the account owner in a neutral setting, part of the profile page interface"
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <input type="text" placeholder='username' id='username' className='border p-3 rounded-lg'/>
        <input type="email" placeholder='email' id='username' className='border p-3 rounded-lg'/>
        <input type="text" placeholder='password' id='password' className='border p-3 rounded-lg'/>
        <button className='bg-slate-700 text-white p-3 uppercase hover:opacity-95 
        disabled:opacity-80'>update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete accoount</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}

 