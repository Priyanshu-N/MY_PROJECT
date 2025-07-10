import React from 'react'

export default function About() {
  return (
    <div >
      <h1 className='text-3xl font-bold'>Welcome to HomeHub – Your Gateway to a Better Home</h1>
      <p className='text-slate-500 text-sm'>At HomeHub, we make it simple for you to find your dream 
        property — whether you're looking to buy, sell, 
        or rent. Our platform is built for speed, ease, and
         reliability, giving you all the tools you need to 
         explore the real estate market effortlessly.</p>

        <div className='mt-8 gap-4 flex flex-col'>
          <h1 className='text-2xl font-bold'>What We Offer</h1>
          <ul>
            <li>
              <strong>Smart Search & Filtering</strong>
              <p>Easily narrow down your search by price, location, amenities, and more.</p>
            </li>
            <li>
              <strong>Verified Listings Only</strong>
              <p>Every listing is curated and managed by registered users to ensure authenticity.</p>
            </li>
            <li>
              <strong>Upload & Manage Listings</strong>
              <p>Property owners can quickly upload images, enter details, and manage their properties from one place.</p>
            </li>
            <li>
              <strong>Interactive UI with Swiper Integration</strong>
              <p>Enjoy a smooth browsing experience with dynamic image sliders and modern design.</p>
            </li>
          </ul>
        </div>

        <div>
          <h2 className='text-lg font-bold'>Responsive & Fast</h2>
          <p>Built using the MERN stack (MongoDB, Express.js, React.js, Node.js), the platform delivers seamless performance on all devices.</p>
        </div>
    </div>
    

  )
}
