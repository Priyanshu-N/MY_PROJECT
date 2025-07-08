import { FaSearch } from 'react-icons/fa';
import { Link,useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);


  }
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
     
    }
  },[location.search]);

  const avatarUrl = currentUser?.avatar
    ? currentUser.avatar.startsWith('http')
      ? currentUser.avatar
      : `http://localhost:3000${currentUser.avatar}`
    : null;

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>

        {/* Logo */}
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Sahand</span>
            <span className='text-slate-700'>Estate</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className='bg-slate-100 p-2 sm:p-3 rounded-lg flex items-center'>
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className='text-slate-600 ml-1' />
          </button>
        </form>

        {/* Links + Profile Icon */}
        <ul className='flex items-center gap-4'>
          <Link to='/'>
            <li className='text-slate-700 hover:underline'>Home</li>
          </Link>
          <Link to='/about'>
            <li className='text-slate-700 hover:underline'>About</li>
          </Link>

          <Link to='/profile'>
            {currentUser && avatarUrl ? (
              <img
                src={avatarUrl}
                alt='profile'
                className='h-8 w-8 rounded-full object-cover border border-gray-300'
              />
            ) : (
              <li className='text-slate-700 hover:underline'>Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
