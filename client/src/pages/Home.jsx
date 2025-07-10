import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Listingitem from '../components/Listingitem';


export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  console.log(saleListings)

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data.listings);
        fetchRentListings();
      } catch (error) {
        console.error("Error fetching offer listings:", error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data.listings);
        fetchSaleListings();
      } catch (error) {
        console.error("Error fetching rent listings:", error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data.listings);
      } catch (error) {
        console.error("Error fetching sale listings:", error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 max-w-6xl'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-500 text-xs sm:text-sm'>
          This site will help you find your home fast, easy and comfortable
          <br />
          Our expert support are always available.
        </div>
        <Link to={"/search"} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
          let’s get started...
        </Link>
      </div>

      {/* Swiper */}
      <Swiper navigation={true} modules={[Navigation]}>
        {
          offerListings && offerListings.length > 0 &&
          offerListings.map((listing) => {  
            const url = listing.imageUrls?.[0];
            if(!url) return null;
            console.log("Image URL:", url);
            const fullUrl = url.startsWith('http') ? url :`http://localhost:3000${url}`;
            const encodedUrl = encodeURI(fullUrl);
            console.log("Encoded URL:", encodedUrl);
            return (
              <SwiperSlide key={listing._id}>
                <div
                  style={{
                    backgroundImage: `url(${encodedUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: '#ccc',  
                  }}
                  className='h-[500px] w-full'
                ></div>
              </SwiperSlide>
            );
          })
        }
      </Swiper>

      {/* listings for offer / sale / rent can go here */}

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {
        offerListings && offerListings.length > 0 &&(
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-700'>Recent offers</h2>
              <Link to={'/search/offer=true'} className='text-sm text-blue-800 hover:underline'>
                Show more offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <Listingitem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {
        rentListings && rentListings.length > 0 &&(
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-700'>Recent places for rent</h2>
              <Link to={'/search/type=rent'} className='text-sm text-blue-800 hover:underline'>
                Show more offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <Listingitem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {
        saleListings && saleListings.length > 0 &&(
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-700'>Recent places for sale</h2>
              <Link to={'/search/type=sale'} className='text-sm text-blue-800 hover:underline'>
                Show more offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <Listingitem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
