import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: '1',
    bathrooms: '1',
    regularPrice: '50',
    discountPrice: '0',
    offer: false,
    parking: false,
    furnished: false,
  });

  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log(formData)
  const handleImageSubmit = async () => {
    if (files.length < 1 || files.length > 6) {
      return setError('Please upload 1–6 images.');
    }

    setUploading(true);
    try {
      const uploadPromises = files.map((file) => storeImage(file));
      const uploadedPaths = await Promise.all(uploadPromises);
      const validPaths = uploadedPaths.filter(Boolean);

      if (validPaths.length) {
        setFormData((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...validPaths],
        }));
        setError('');
      } else {
        setError('Image upload failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    const form = new FormData();
    form.append('images', file);
    try {
      const res = await fetch('http://localhost:3000/api/listing-upload/upload-images', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      return data?.imagePaths?.[0] || null;
    } catch (err) {
      console.error('Image store error:', err);
      return null;
    }
  };

  const handleChange = (e) => {
    if(e.target.id === 'sale' || e.target.id === 'rent'){
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      })
    }
    if(e.target.type === 'number' || e.target.type ==='text' || e.target.type === 'textarea'){
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      })

    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('✅ Form submitted')

    if (formData.imageUrls.length < 1) {
      return setError('You must upload at least one image');
    }

    if (+formData.discountPrice > +formData.regularPrice) {
      return setError('Discount price must be lower than regular price');
    }

    try {
      setLoading(true);
      setError('');

      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
        ...formData, 
        userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      console.log('✅ Response from backend:', data);
      

      if(!data || !data._id){
        setError('listing creation failed: missing listing id')
        setLoading(false)
        return;
      }

     
      setLoading(false);

      if (data.success === false) return setError(data.message);
      console.log("Created listing:", data); // <- check this in browser console

      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError('Failed to create listing');
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* LEFT SIDE: Form fields */}
        <div className="flex flex-col gap-4 flex-1 font-semibold">
          <input
            type="text"
            id="name"
            placeholder="Name"
            className="border p-3 rounded-lg"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            id="description"
            placeholder="Description"
            className="border p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            className="border p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.address}
          />

          {/* Checkboxes */}
          <div className="flex gap-6 flex-wrap">
            {['sale', 'rent'].map((option) => (
              <div key={option} className="flex gap-2">
                <input
                  type="checkbox"
                  id={option}
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.type === option}
                />
                <span>{option === 'sale' ? 'Sell' : 'Rent'}</span>
              </div>
            ))}
            {['parking', 'furnished', 'offer'].map((feature) => (
              <div key={feature} className="flex gap-2">
                <input
                  type="checkbox"
                  id={feature}
                  className="w-5"
                  onChange={handleChange}
                  checked={formData[feature]}
                />
                <span>{feature.charAt(0).toUpperCase() + feature.slice(1)}</span>
              </div>
            ))}
          </div>

          {/* Room & Price */}
          <div className="flex flex-wrap gap-6">
            {[
              { id: 'bedrooms', label: 'Beds' },
              { id: 'bathrooms', label: 'Baths' },
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center gap-2">
                <input
                  type="number"
                  id={id}
                  min="1"
                  max="10"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData[id]}
                />
                <p>{label}</p>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Upload + Submit */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images: <span className="font-normal text-gray-600 ml-2">(max 6, cover is first)</span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full"
              onChange={(e) => setFiles([...e.target.files])}
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading || loading}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>

          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
