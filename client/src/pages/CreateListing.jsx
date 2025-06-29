import React from 'react'
import { useState } from 'react'
export default function CreateListing() {
  const [files, setFiles] = useState([])

  
  const handleImageSubmit = async () => {
  if (files.length > 0 && files.length <= 6) {
    const uploadPromises = files.map((file) => storeImage(file));

    try {
      const uploadedImagePaths = await Promise.all(uploadPromises);
      console.log('Uploaded:', uploadedImagePaths);

      // Use uploadedImagePaths to show previews or save in MongoDB
    } catch (error) {
      console.error('Upload error:', error);
    }
  } else {
    alert('Please upload 1–6 images only.');
  }
};


  const storeImage = async (file) => {
  const formData = new FormData();
  formData.append('images', file); // field name must match Multer field

  try {
    const res = await fetch('http://localhost:3000/api/listing/upload-images', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data.imagePaths[0]; // return file path for MongoDB or preview
  } catch (err) {
    console.error('Image upload failed:', err);
    return null;
  }
};


  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
      <form className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1 font-semibold'>
          <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required />
          <textarea type="text" placeholder='Description' className='border p-3 rounded-lg' id='Description' required />
          <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='address'  required />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input type="checkbox" id='sale' className='w-5' />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id='rent' className='w-5' />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id='parking' className='w-5' />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id='furnished' className='w-5' />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id='offer' className='w-5' />
              <span>Offer</span>
            </div>
          </div>



          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input type="number" id='bedrooms' min='1' max='10' required  className='p-3 border border-gray-300 rounded-lg'/>
              <p>Beds</p>
            </div>

             <div className='flex items-center gap-2'>
              <input type="number" id='bathrooms' min='1' max='10' required  className='p-3 border border-gray-300 rounded-lg'/>
              <p>Baths</p>
            </div>

            <div className='flex items-center gap-2'>
              <input type="number" id='regularPrice' min='1' max='10' required  className='p-3 border border-gray-300 rounded-lg'/>
              <div className='flex flex-col items-center'>
                  <p>Regular price</p>
                  <span className='text-xs'> ($ / Month)</span>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <input type="number" id='discountedPrice' min='1' max='10' required  className='p-3 border border-gray-300 rounded-lg'/>
              <div className='flex flex-col items-center'>
                  <p>Regular price</p>
                  <span className='text-xs'> ($ / Month)</span>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>Images:
          <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span> 
          </p>
          <div className='flex gap-4'>
            <input  onChange={(e)=>setFiles([...e.target.files])} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
            <button type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>Upload</button>
          </div>
        <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 '>Create Listing</button>
        </div>

      </form>
    </main>
  )
}
