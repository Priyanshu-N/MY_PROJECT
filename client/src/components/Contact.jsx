import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import {Link} from 'react-router-dom'

export default function Contact({listing}) {
  const[landlord, setLandlord] = useState(null)
  const [message, setMessage] = useState('')

const onChange = (e) => {
  setMessage(e.target.value);
};

  useEffect(() => {
    try {
      const fetchLandlord = async () => {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json()
        setLandlord(data);
      };
      fetchLandlord();
    } catch (error) {
      console.log(error)
    }


  },[listing.userRef])

  return (
    <>
    {/* <h1>Contact</h1> */}
    {landlord && (
      <div className='flex flex-col gap-2'>
        <p>contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>
          {listing.name.toLowerCase()}</span></p>
        <textarea name="message" id="message" rows="2" value={message} 
        onChange={onChange} placeholder="Type your message here..."
        className='w-full border border-gray-300 rounded-lg pd-2 mt-2'></textarea>
        <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
        className='bg-blue-500 text-white text-center rounded-lg  p-3 hover:opacity- mt-2'>
          Send message to {landlord.username}
        </Link>
      </div>
    )}

    </>
  )
}
