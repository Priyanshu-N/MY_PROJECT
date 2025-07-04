import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
import app from '../firebase';
import {useDispatch} from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import {useNavigate} from 'react-router-dom';


export default function OAuth() {
    const dispatchEvent = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider)
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL}),
            })
            const data = await res.json()
            dispatchEvent(signInSuccess(data))
            navigate('/')

        }catch (error) {
            console.log('could not sign in with google', error)

        }
    }
  return (
    <button onClick={handleGoogleClick} type='button' 
    className='bg-red-700 text-white p-3 rounded-lg uppercase
     hover:opacity-95'>Continue with google</button>
  )
}
