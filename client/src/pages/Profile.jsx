import React from 'react'
import { useSelector } from "react-redux"
import { useRef, useState} from 'react'
import axios from 'axios'


export default function Profile() {
  const fileRef = useRef(null)
  const { currentUser } = useSelector((state) => state.user)
  const [selectFile, setselectFile] = useState(null);
  const [previewUrl, setPreviewUrl]=useState(currentUser.avatar)

  const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setselectFile(file);
  setPreviewUrl(URL.createObjectURL(file)); // show preview immediately

  const formData = new FormData();
  formData.append('avatar', file);
  formData.append('userId', currentUser._id); // make sure this is correct

  try {
    const res = await axios.post('http://localhost:3000/api/user/upload-avatar', formData);

    // Safe check for structure
    if (res.data && res.data.user && res.data.user.avatar) {
      setPreviewUrl(`http://localhost:3000${res.data.user.avatar}`);
      console.log('✅ Image uploaded:', res.data);
    } else {
      console.error('❌ Invalid server response:', res.data);
    }

  } catch (error) {
    console.error('❌ Error uploading avatar:', error);
  }
};

  return (
    <div className='p-3 max-w-lg mx-auto gap-4'>
      <h1 className='text-3xl font-semibold text-center my-7'> Profile </h1>
      <form className='flex flex-col gap-4'>
        <input type="file" ref={fileRef} hidden accept='image/*' onChange={handleFileChange}/>
        <img
          onClick={()=>fileRef.current.click()}
          src={previewUrl}
          alt="profile"
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <input type="text" placeholder='username' id='username' className='border p-3 rounded-lg'/>
        <input type="email" placeholder='email' id='email' className='border p-3 rounded-lg'/>
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

 