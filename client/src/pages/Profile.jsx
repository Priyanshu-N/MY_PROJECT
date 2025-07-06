import React from 'react'
import { useSelector } from "react-redux"
import { useRef, useState, useEffect} from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { updateUserSuccess, updateUserFailure, updateUserStart, 
  deleteUserFailure, deleteUserStart, deleteUserSuccess, 
  signOutUserStart, signOutUserFailure, signOutUserSuccess}
  from '../redux/user/userSlice'
import {Link} from 'react-router-dom'



export default function Profile() {
  const fileRef = useRef(null)
  const dispatch = useDispatch();
  const { currentUser, loading, error} = useSelector((state) => state.user)
  const [selectFile, setselectFile] = useState(null);
  const [previewUrl, setPreviewUrl]=useState('');
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([])

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

  const handleDeleteUser = async() =>{
    try{
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return
      }
      dispatch(deleteUserSuccess(data));
    }catch(error){
      dispatch(deleteUserFailure(error.message))
      
    }
  }

  const handleSignOut = async ()=> {
    dispatch(signOutUserStart())
    try{
      const res = await fetch('/api/auth/signout')
      const data = await res.json()
      if(data.success === false){
        dispatch(deleteUserFailure(data.message))
      }
      dispatch(deleteUserSuccess(data))
    }catch(error){
      dispatch(deleteUserFailure(data.message))

    }
  }

  const handleShowListings = async ()=>{
    try{
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json();
      if(data.success=== false){
        setShowListingsError(true);
        return;
      }
      setUserListings(data);

    }catch(error){
      setShowListingsError(true);

    }
  }

  const handleListingDelete = async (listingId) =>{
    try{
      const res = await fetch(`/api/listing/delete/${listingId}`,{
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await res.json();
      if(data.success === false){
        console.log(data.message)
        return
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    }catch(error){
      console.log(error.message)
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
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>
        CREATE LISTING</Link>

       
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete accoount</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-500'>{error ? error: ''}</p>
      <p className='text-green-500'>{updateSuccess ? 'User is updated successfully': ''}</p>
      <button onClick={handleShowListings} className='text-green-700 w-full'>Show Listings</button>
      <p className='text-red-700 mt-5'>{showListingsError ? 'error showing listings': ''}</p>


      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center text-green-700 font-semibold mt-7 text-3xl'>Your Listings</h1>
          {userListings.map((listing) => {
            console.log('Image URL:', listing.imageUrls[0]); // ✅ Add this line

            return (
              <div key={listing._id} className=' border rounded-lg p-3 flex justify-between items-center gap-4'>
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={`http://localhost:3000${listing.imageUrls[0].replace(/\\/g, '/')}`}
                    alt="listing cover"
                    className="h-16 w-16 object-contain "
                    onError={(e) => {
                        e.target.parentElement.parentElement.remove(); // 👈 remove the full listing div
                        console.warn("Removed broken image:", listing.imageUrls[0]);
                    }}
                  />
                </Link>
                <Link to={`/listing/${listing._id}`} className='text-slate-700 font-semibold truncate flex-1 hover:underline' >
                    <p>{listing.name}</p>
                </Link>
                <div className='flex flex-col item-center'>
                  <button onClick={() =>handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
                  <Link to={`/update-listing/${listing._id}`} >
                    <button className='text-green-700 uppercase'>edit</button>
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}

 