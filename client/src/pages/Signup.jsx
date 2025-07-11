import { set } from 'mongoose';
import { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import OAuth from '../components/OAuth';


export default function Signup() {

  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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
      setLoading(true);
      const res = await fetch('api/auth/signup',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/signin');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
    // console.log(data);

  }
  // console.log(formData);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semi
      bold my-7'>Sign up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        <input type="text" placeholder="username" id='username' className='border p-3 rounded-lg id=username' onChange={handleChange}/>
        <input type="email" placeholder="email" className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder="password" className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' >
          {loading ? "Loading..." : "Sign up"}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/signin"}>
          <span className='text-blue-500'>Sign in</span>
        </Link>
      </div>
      {error && <div className='text-red-500 mt-3'>{error}</div>}
    </div>
  )
}

 