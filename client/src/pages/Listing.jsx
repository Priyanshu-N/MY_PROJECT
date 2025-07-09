import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaBed, FaBath, FaParking, FaCouch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';

export default function Listing() {
  const { currentUser } = useSelector((state) => state.user);
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contact, setContact] = useState(false);

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
    <main className="bg-white min-h-screen">
      {/* Cover Image */}
      {listing.imageUrls?.[0] && (
        <div className="  overflow-hidden">
          <img
            src={`http://localhost:3000${listing.imageUrls[0]}`} // Update if needed
            alt="cover"
            className="w-full h object-cover"
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto p-4">
        {/* Title + Price */}
        <h1 className="text-3xl font-bold mt-6">
          {listing.name} -{' '}
          <span className="text-green-600">${listing.regularPrice} / month</span>
        </h1>

        {/* Address */}
        <div className="flex items-center gap-2 mt-2 text-gray-600">
          <FaMapMarkerAlt className="text-green-700" />
          <p>{listing.address}</p>
        </div>

        {/* For Rent / Sale Tag + Offer Price */}
        <div className="flex items-center gap-4 mt-4">
          <span
            className={`text-white font-medium px-4 py-2 rounded ${
              listing.type === 'rent' ? 'bg-red-600' : 'bg-blue-600'
            }`}
          >
            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
          {listing.offer && (
            <span className="text-white bg-green-600 px-4 py-2 rounded font-semibold">
              ${listing.discountPrice}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{listing.description}</p>
        </div>

        {/* Gallery Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {listing.imageUrls
            ?.filter((_, index) => index !== 0) // skip cover image
            .map((url, index) => (
              <img
                key={index}
                src={`http://localhost:3000${url}`} // adjust for local API
                alt={`Listing image ${index}`}
                className="w-full h object-cover rounded shadow"
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

        {/* Contact Landlord */}
        {currentUser && listing.useRef !== currentUser._id && !contact && (
          <div className="flex justify-center">
            <button onClick={() => setContact(true)} className="bg-slate-700 mt-6 text-white rounded uppercase hover:opacity-90 px-6 py-3">
              Contact Landlord
            </button>
          </div>
        )}
        {contact && <Contact listing={listing} />}
      </div>
    </main>
  );
}
