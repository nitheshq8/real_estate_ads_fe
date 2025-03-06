"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { fetchPropertiesDetailsById } from "@/services/api";

const PropertyDetailPage = () => {
  const { access_token, ad_id } = useParams();
  const router = useRouter();

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (access_token && ad_id) {
        fetchPropertiesDetailsById(ad_id)
        .then(({ details }) => {
          const detailsData = details.result?.result;
          setProperty(detailsData?.data || null);
          const myf = {
            property_type: detailsData?.property_type,
            reason: detailsData?.reason,
            city: detailsData?.city,
          };
        })

        // fetchPropertiesDetailsById();
    }
  }, [access_token, ad_id]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/shared/${access_token}`)}
        className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-md w-fit mb-4 hover:bg-gray-900"
      >
        <FiArrowLeft className="mr-2" /> Back to List
      </button>

      <h1 className="text-3xl font-bold mb-6 text-gray-900">Property Details</h1>

      {loading && <p className="text-blue-500">Loading details...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {property && (
        <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-2/3 lg:w-1/2 mx-auto">
          {/* Main Image */}
          <img
            src={selectedImage || property.image}
            alt={property.name}
            className="w-full h-96 object-cover rounded-lg"
          />

          {/* Thumbnail Images */}
          <div className="flex space-x-2 mt-4">
            {[property.image, ...(property.additional_images || [])].map((img, index) => (
              <img
                key={index}
                src={`data:image/jpeg;base64,${img}`}
                // src={img}
                alt={`Thumbnail ${index}`}
                className={`w-24 h-24 object-cover rounded-lg cursor-pointer ${
                  selectedImage === img ? "border-2 border-blue-500" : ""
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>

          {/* Property Details */}
          <h2 className="text-xl font-semibold mt-4">{property.name}</h2>
          <p className="text-gray-700 mt-2">{property.description}</p>
          <p className="text-gray-900 font-bold mt-4">${property.price}</p>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;
