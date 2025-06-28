import React from 'react'
import { useSelector } from "react-redux"
import { useRef, useState, useEffect} from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { updateUserSuccess, updateUserFailure, updateUserStart} from '../redux/user/userSlice'



export default function Profile() {
  const fileRef = useRef(null)
  const dispatch = useDispatch();
  const { currentUser, loading, error} = useSelector((state) => state.user)
  const [selectFile, setselectFile] = useState(null);
  const [previewUrl, setPreviewUrl]=useState('');
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)

  // console.log('cr',currentUser);
  useEffect(() => {
    if (currentUser?.avatar) {
      const fullUrl = currentUser.avatar.startsWith('http')
        ? currentUser.avatar
        : `http://localhost:3000${currentUser.avatar}`;
      setPreviewUrl(fullUrl);
    }
  }, [currentUser]);

  const handleFileChange = async (e) => {
  const file = e.target.files[0];
  


  if (!file) return;

  setselectFile(file);
  setPreviewUrl(URL.createObjectURL(file)); // show preview immediately

  const formData = new FormData();
  formData.append('avatar', file);
  formData.append('userId', currentUser._id); // make sure this is correct

  try {
      const res = await axios.post(
        'http://localhost:3000/api/user/upload-avatar',
        formData
      );

      if (res.data && res.data.user && res.data.user.avatar) {
        const newAvatarUrl = `http://localhost:3000${res.data.user.avatar}`;
        setPreviewUrl(newAvatarUrl);
        dispatch(updateUserSuccess(res.data.user)); // ✅ update Redux store
        console.log('✅ Image uploaded:', res.data);
      } else {
        console.error('❌ Invalid server response:', res.data);
      }
    } catch (error) {
      console.error('❌ Error uploading avatar:', error);
    }
  };

  const handleChange = (e)=>{
    setFormData({ ...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit =async (e)=> {
    e.preventDefault();
    try{
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json()
      if(data.success==false){
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)

    }catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto gap-4'>
      <h1 className='text-3xl font-semibold text-center my-7'> Profile </h1>


      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="file" ref={fileRef} hidden accept='image/*' onChange={handleFileChange}/>
        <img
          onClick={()=>fileRef.current.click()}
          src={previewUrl || 'https://picsum.photos/100'}
          alt="profile"
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <input 
          type="text" 
          placeholder='username' 
          defaultValue={currentUser.username} 
          id='username' 
          className='border p-3 rounded-lg'
          onChange={handleChange}
          />

        <input 
          type="email" 
          placeholder='email' 
          defaultValue={currentUser.email}  
          id='email' 
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type="password" 
          placeholder='password' 
          id='password' 
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <button disabled={loading} className='bg-slate-700 text-white p-3 uppercase hover:opacity-95 
        disabled:opacity-80'>
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete accoount</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-500'>{error ? error: ''}</p>
      <p className='text-green-500'>{updateSuccess ? 'User is updated successfully': ''}</p>
    </div>
  )
}

 