"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import ShareAdsModal from "../PropertyPage/ShareAdsModal";
import CreateAdModal from "../PropertyPage/CreateAdModal";
import {
  deleteAds,
  fetchPropertiesDetailsById,
  fetchPropertiesDetailsByIdandUpdateView,
} from "@/services/api";
import { ArrowLeft, Trash2 } from "lucide-react";

const AdDetailPage = ({ cities, setFilters ,mysubscriptionPlan}: any) => {
  const params = useParams();
  const router = useRouter();
  const adId = useMemo(() => params.id, [params.id]); // Memoize adId to prevent unnecessary re-renders

  const [adDetails, setAdDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to strip HTML tags
  const stripHtmlTags = useCallback(
    (html: string) => html?.replace(/<[^>]*>/g, ""),
    []
  );

  // Memoized API call
  const isFetchedDetail = useRef(false);
  const fetchAdDetails = useMemo(() => {
    return async () => {
      if (!adId) return;

      setLoading(true);
      setError(null);

      try {
        const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
        if (!isFetchedDetail.current) {
          fetchPropertiesDetailsByIdandUpdateView(adId, userData)
            .then(({ details, visits }) => {
              console.log("Ad Details:", details);
              console.log("Visits Update Response:", visits);
              const detailsData = details.result?.result;
              console.log("detailsData", detailsData);

              setAdDetails(detailsData?.data || null);
              const myf = {
                property_type: detailsData?.property_type,
                reason: detailsData?.reason,
                city: detailsData?.city,
              };
            })
            .catch((error) => {
              console.error("Error fetching property by id:", error);
            });
          isFetchedDetail.current = true;
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  }, []); // Runs only when adId changes

  const isFetched = useRef(false);
  // const fetchAdDetailsMemoized = useMemo(() => fetchAdDetails, []);

  useEffect(() => {
    if (!isFetched.current) {
      fetchAdDetails();
      isFetched.current = true;
    }
  }, []);
  // Executes the memoized function

  // Memoized images array
  const images = useMemo(() => {
    if (!adDetails) return [];
    return [
      adDetails.image,
      ...(adDetails?.additional_images?.map((img: any) => img.image_url) || []),
    ];
  }, [adDetails]);

  // Image navigation handlers (memoized)
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  if (loading)
    return (
      <p className="text-blue-500 text-center text-xl">
        🔄 Loading ad details...
      </p>
    );
  if (error)
    return <p className="text-red-500 text-center text-lg">❌ {error}</p>;
  const handleAdChange = () => {
    fetchAdDetails();
  };
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );
    if (confirmed) {
      try {
        const response: any = await deleteAds({ ad_id: adId });

        if (response.data.result.success) {
          alert("Ad deleted successfully!");
          handleAdChange();
          // Optionally, you can trigger a state change to remove the ad from the UI
        } else {
          alert("Failed to delete ad. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting ad:", error);
        alert("An error occurred while deleting the ad.");
      }
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-2 mt-3 bg-white shadow-2xl rounded-lg">
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
                  className="absolute top-1/2 left-2 bg-gray-700 hover:bg-slate-400 text-white p-2 rounded-full transform -translate-y-1/2"
                >
                  ◀
                </button>
                <button
                  onClick={nextImage}
                  className="absolute top-1/2 right-2 bg-gray-700 hover:bg-slate-400 text-white p-2 rounded-full transform -translate-y-1/2"
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

      {/* Additional Images */}
      {adDetails?.additional_images?.length > 0 && (
        <div className="mt-4">
          <label className="block text-gray-700 font-semibold">
            Additional Images
          </label>
          <div className="flex overflow-x-auto mt-2 space-x-4 p-2 border border-gray-300 rounded-lg">
            {adDetails.additional_images.map((img: any, index: number) => (
              <div key={index} className="relative">
                <img
                  src={`data:image/jpeg;base64,${img.image_url}`}
                  alt="Additional Image"
                  className="w-24 h-24 object-cover rounded-md"
                />
                {/* <p className="text-gray-500">
                  📧 <span className="font-semibold">{img.name}</span>
                </p> */}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ad Information */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold text-gray-900">{adDetails?.name}</h1>
        <p className="text-gray-600 text-lg mt-2">
          {stripHtmlTags(adDetails?.description)}
        </p>

        {/* Pricing & Location */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4">
          <p className="text-lg font-semibold text-gray-800">
            💰 Price:{" "}
            <span className="text-green-600">
              {adDetails?.price} {adDetails?.currency}
            </span>
          </p>
          <p className="text-gray-500">
            📍 Location:{" "}
            <span className="font-semibold">{adDetails?.city}</span>
          </p>
          <p className="text-gray-500">
            👀 Views:{" "}
            <span className="font-semibold">{adDetails?.total_visits}</span>
          </p>
        </div>

        {/* Owner Info */}
        <div className="bg-gray-100 p-4 mt-6 rounded-lg shadow">
          <p className="text-gray-700">
            🏡 <span className="font-semibold">Owner:</span>{" "}
            {adDetails?.owner_name}
          </p>
          <p className="text-gray-500">
            📞 <span className="font-semibold">Phone:</span>{" "}
            {adDetails?.owner_phone}
          </p>
          {adDetails?.created_by && (
            <p className="text-gray-500">
              📧 <span className="font-semibold">Listed by:</span>{" "}
              {adDetails.created_by.name} ({adDetails.created_by.email})
            </p>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="mt-6">
          <ShareAdsModal selectedAds={[adDetails]} mysubscriptionPlan={mysubscriptionPlan} />
        </div>
        {adDetails?.isOwner && (
          <>
            <button
              className="text-red-700 w-full bg-transparent mt-2 mb-2 hover:bg-red-100 rounded-md border border-red-400 px-4 py-2 flex items-center justify-center gap-2 transition-all"
              onClick={handleDelete}
            >
              <Trash2 className="w-5 h-5" /> Delete
            </button>
            <div className="bg-green-400 flex rounded-md ">
              <CreateAdModal
                cities={cities}
                ad={adDetails}
                isEditMode={true}
                handleAdChange={ ()=>router.refresh()}
                mysubscriptionPlan={mysubscriptionPlan}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdDetailPage;
