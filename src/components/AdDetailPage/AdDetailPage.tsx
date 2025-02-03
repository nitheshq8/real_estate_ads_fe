"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import ShareAdsModal from "../PropertyPage/ShareAdsModal";
import CreateAdModal from "../PropertyPage/CreateAdModal";

const AdDetailPage = ({ cities }: any) => {
  const params = useParams();
  const adId = params.id; // Get ad ID from URL

  const [adDetails, setAdDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchAdDetailsAndUpdateVisits = async () => {
      if (!adId) return; // Prevent unnecessary API calls

      setLoading(true);
      setError(null);

      try {
        const accessToken = localStorage.getItem("accessToken");
        const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
    
        const [detailsResponse, visitsResponse] = await Promise.all([
          axios.post("http://localhost:8069/api/real-estate/ads/detail", {
            jsonrpc: "2.0",
            method: "call",
            params: { ad_id: adId ,user_id: userData.user_id,},
          }),
          axios.post("http://localhost:8069/api/real-estate/ads/update-visits", {
            jsonrpc: "2.0",
            method: "call",
            params: { ad_id: Number(adId) },
          }),
        ]);

        // Extract response data
        const detailsData = detailsResponse.data.result?.result;
        if (detailsData?.success) {
          setAdDetails(detailsData?.data);
        } else {
          setError(detailsData?.message || "Failed to fetch ad details");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdDetailsAndUpdateVisits();
  }, [adId]);

  if (loading) return <p className="text-blue-500 text-center text-xl">🔄 Loading ad details...</p>;
  if (error) return <p className="text-red-500 text-center text-lg">❌ {error}</p>;
console.log("additional_images",adDetails);

  const images = [
    `${adDetails?.image}`,
    ...(adDetails?.additional_images?.map((img: any) => img.image_url) || []),
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Edit Modal */}
      {adDetails?.isOwner?<CreateAdModal cities={cities} ad={adDetails} isEditMode={true} />:''}
      

      {/* Image Slider */}
      <div className="relative w-full h-[300px] rounded-lg overflow-hidden bg-gray-200">
        {images.length > 0 ? (
          <>
            <img
              src={`data:image/jpeg;base64,${images[currentImageIndex]}`}
              alt={adDetails?.name}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute top-1/2 left-2 bg-gray-700 text-white p-2 rounded-full transform -translate-y-1/2"
                >
                  ◀
                </button>
                <button
                  onClick={nextImage}
                  className="absolute top-1/2 right-2 bg-gray-700 text-white p-2 rounded-full transform -translate-y-1/2"
                >
                  ▶
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg">
            📸 No Image Available
          </div>
        )}
      </div>

      {/* Ad Information */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold text-gray-900">{adDetails?.name}</h1>
        <p className="text-gray-600 text-lg mt-2" dangerouslySetInnerHTML={{ __html: adDetails?.description }}></p>

        {/* Pricing & Location */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4">
          <p className="text-lg font-semibold text-gray-800">
            💰 Price: <span className="text-green-600">{adDetails?.price} {adDetails?.currency}</span>
          </p>
          <p className="text-gray-500">
            📍 Location: <span className="font-semibold">{adDetails?.city}</span>
          </p>
          <p className="text-gray-500">
            👀 Views: <span className="font-semibold">{adDetails?.total_visits}</span>
          </p>
        </div>

        {/* Owner Info */}
        <div className="bg-gray-100 p-4 mt-6 rounded-lg shadow">
          <p className="text-gray-700">
            🏡 <span className="font-semibold">Owner:</span> {adDetails?.owner_name}
          </p>
          <p className="text-gray-500">
            📞 <span className="font-semibold">Phone:</span> {adDetails?.owner_phone}
          </p>
          {adDetails?.created_by && (
            <p className="text-gray-500">
              📧 <span className="font-semibold">Listed by:</span> {adDetails.created_by.name} ({adDetails.created_by.email})
            </p>
          )}
        </div>

        {/* Additional Details */}
        <div className="mt-6">
          <p className="text-gray-500">🔎 Reason: {adDetails?.reason}</p>
          {adDetails?.kuwait_finder_link && (
            <p className="text-gray-500">
              📍 <a href={adDetails?.kuwait_finder_link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                View on Kuwait Finder
              </a>
            </p>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 justify-between mt-6">
          {/* <button className="bg-green-300 hover:bg-green-900 min-w-fit hover:text-white p-2 rounded-md w-full md:w-auto">
            📞 Contact Owner
          </button> */}
          <ShareAdsModal selectedAds={[adDetails]} />
        </div>
      </div>
    </div>
  );
};

export default AdDetailPage;
