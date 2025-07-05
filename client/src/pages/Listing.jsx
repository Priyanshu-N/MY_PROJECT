import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaBed, FaBath, FaParking, FaCouch } from 'react-icons/fa';

export default function Listing() {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/${listingId}`);
        const data = await res.json();
        if (!res.ok || data.success === false) {
          throw new Error(data.message || 'Listing not found');
        }
        setListing(data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <main>
      {/* Cover Image */}
      {listing.imageUrls?.[0] && (
        <div className="w-full max-h-[500px] overflow-hidden">
          <img
            src={listing.imageUrls[0]}
            alt="cover"
            className="w-full object-cover h-[500px]"
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto p-4">
        {/* Name + Price */}
        <h1 className="text-3xl font-bold mt-6">
          {listing.name} - <span className="text-green-600">${listing.regularPrice}/month</span>
        </h1>

        {/* Address */}
        <div className="flex items-center gap-2 mt-2 text-gray-600">
          <FaMapMarkerAlt className="text-green-700" />
          <p>{listing.address}</p>
        </div>

        {/* Type Button */}
        <button
          className={`mt-3 px-4 py-2 rounded font-semibold text-white ${
            listing.type === 'rent' ? 'bg-red-600' : 'bg-blue-600'
          }`}
        >
          {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
        </button>

        {/* Description */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{listing.description}</p>
        </div>

        {/* All Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {listing.imageUrls
            ?.filter((_, index) => index !== 1) // ⛔ Skip second image
            .map((url, index) => (
                <img
                key={index}
                src={url}
                alt={`Listing ${index}`}
                className="w-full h-64 object-cover rounded-lg shadow-md"
            />
        ))}
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-4 mt-6 text-sm font-medium">
          <span className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded">
            <FaBed /> {listing.bedrooms} Bed
          </span>
          <span className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded">
            <FaBath /> {listing.bathrooms} Bath
          </span>
          <span className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded">
            <FaParking /> {listing.parking ? 'Parking' : 'No Parking'}
          </span>
          <span className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded">
            <FaCouch /> {listing.furnished ? 'Furnished' : 'Not Furnished'}
          </span>
        </div>

        {/* Offer Info */}
        {listing.offer && (
          <div className="mt-4 text-green-600 font-semibold">
            🎉 Special Offer: ${listing.discountPrice} / month
          </div>
        )}
      </div>
    </main>
  );
}
