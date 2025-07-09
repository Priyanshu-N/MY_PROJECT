import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Listingitem from '../components/Listingitem';


export default function () {
    const navigate = useNavigate();
    const location = useLocation();


    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer:false,
        sortOrder: 'created_at',
        order: 'desc',
    })

    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]); 
    console.log(listings)


    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromURL = urlParams.get('searchTerm') || '';
        const typeFromURL = urlParams.get('type')
        const parkingFromURL = urlParams.get('parking')
        const furnishedFromURL = urlParams.get('furnished')
        const offerFromURL = urlParams.get('offer')
        const sortFromURL = urlParams.get('sort')
        const orderFromURL = urlParams.get('order')

        if(
            searchTermFromURL ||
            typeFromURL ||
            parkingFromURL ||
            furnishedFromURL ||
            offerFromURL ||
            sortFromURL ||
            orderFromURL
        ){
            setSidebardata({
                searchTerm: searchTermFromURL || '',
                type: typeFromURL || 'all',
                parking: parkingFromURL === 'true' ? true : false,
                furnished: furnishedFromURL === 'true' ? true : false,
                offer: offerFromURL === 'true' ? true : false,
                sort: sortFromURL || 'createdAt',
                order: orderFromURL || 'desc'
            })
        }
        const fetchListings = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`http://localhost:3000/api/listing/get?${searchQuery}`, {
                credentials: 'include', 
            });

            const data = await res.json();
            setListings(data);
            setLoading(false);
        }
        fetchListings();

        
    
    }, [location.search]);

        
    
    // console.log(sidebardata)
    const handleChange = (e) => {
        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSidebardata({
                ...sidebardata,
                type: e.target.id
            })
        }

        if(e.target.id === 'searchTerm') {
            setSidebardata({
                ...sidebardata,
                searchTerm: e.target.value
            })
        }

        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSidebardata({
                ...sidebardata,
                [e.target.id]: e.target.checked || e.target.checked === 'true '? true : false
            })
        }

        if(e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at'
            const order = e.target.value.split('_')[1] || 'desc'
            setSidebardata({
                ...sidebardata,
                sort,
                order
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams()
        urlParams.set('searchTerm', sidebardata.searchTerm)
        urlParams.set('type', sidebardata.type)
        urlParams.set('parking', sidebardata.parking)
        urlParams.set('furnished', sidebardata.furnished)
        urlParams.set('offer', sidebardata.offer)
        urlParams.set('sort', sidebardata.sort)
        urlParams.set('order', sidebardata.order)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`) // Assuming you have a navigate function from react-router or similar
    }



  return (
    <div className='flex flex-col md:flex-row'>
        <div className=' p-7 border-b-2 md:border-r-2 md:min-h-screen font-semibold'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div className='flex items-center gap-2 '>
                    <label className='whitespace-nowrap' >Search Term:</label>
                    <input type="text" id='searchTerm' placeholder='search...' 
                    className='border rounded-lg p-3 w-full'
                    value={sidebardata.searchTerm} 
                    onChange={handleChange} />
                </div>

                <div className='flex items-center gap-2 mt-4 flex-wrap font-semibold'>
                    <label >Type:</label>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='all' className='w-5'
                        onChange={handleChange}
                            checked={sidebardata.type === 'all'}/>
                        <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='rent' className='w-5'
                        onChange={handleChange}
                            checked={sidebardata.type === 'rent'}
                        />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sale' className='w-5'
                        onChange={handleChange}
                            checked={sidebardata.type === 'sale'}
                        />
                        <span>Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='offer' className='w-5'
                        onChange={handleChange}
                            checked={sidebardata.offer}
                        />
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex items-center gap-2 mt-4 flex-wrap font-semibold'>
                    <label >Amenties:</label>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='parking' className='w-5'
                        onChange={handleChange}
                            checked={sidebardata.parking}
                        />
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='furnished' className='w-5'
                        onChange={handleChange}
                            checked={sidebardata.furnished}
                        />
                        <span>Furnished</span>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <label>Sort:</label>
                    <select onChange={handleChange}
                    defaultValue={'created_at_desc'}
                    id="sort_order" className='border rounded-lg p-3 '>
                        <option value="regularPrice_desc">Price high to low</option>
                        <option value="regularPrice_asc">Price low to high</option>
                        <option value="created_at_desc">Latest</option>
                        <option value="created_at_asc">Oldest</option>
                    </select>
                </div>
                <button className='bg-blue-500 text-white rounded-lg p-3 uppercase hover:opacity-95'>Search</button>
            </form>

        </div>

        <div className='flex-1'>
            <h1 className='text-3xl font-semibold text-slate-700 border-b p-3 mt-5'>Listing Results:</h1>
            <div className='p-7 flex flex-wrap gap-5'>
                {!loading && listings.length ===0 && (
                    <p className=' text-xl text-slate-700'>No listings found</p>
                )}
                {loading && (
                    <p className='text-center text-xl text-slate-700 w-full'>Loading...</p>
                )}

                {
                    !loading && listings && listings.map((listing) => (
                        <Listingitem key={listing._id} listing={listing} />
                    ))
                }
            </div>
        </div>
    </div>
  )
}
