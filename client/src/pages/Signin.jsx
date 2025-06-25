import { set } from 'mongoose';
import { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';


export default function Signin() {

  const [formData, setFormData] = useState({})
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange= (e) => {
    setFormData(
      {
        ...formData,
        [e.target.id]: e.target.value
      }
    )

  }
  const handleSubmit= async (e) => {
    e.preventDefault(); //so the page doesn't refresh
    try{
        dispatch(signInStart())      
        const res = await fetch('api/auth/signin',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (err) {
      dispatch(signInFailure(err.message));
      
    }
    // console.log(data);

  }
  // console.log(formData);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semi
      bold my-7'>Sign in</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        <input type="email" placeholder="email" className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder="password" className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' >
          {loading ? "Loading..." : "Sign in"}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Don`t have an account?</p>
        <Link to={"/sign-up"}>
          <span className='text-blue-500'>Sign up</span>
        </Link>
      </div>
      {error && <div className='text-red-500 mt-3'>{error}</div>}
    </div>
  )
}

 