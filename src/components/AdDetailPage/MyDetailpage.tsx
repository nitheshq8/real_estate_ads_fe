"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Loader from "../Loader"; // Adjust to your actual Loader import
import { ArrowLeft, Trash2 } from "lucide-react";
import { fetchPropertiesDetailsByIdandUpdateView } from "@/services/api";
// import ShareAdsModal from "../PropertyPage/ShareAdsModal"; // If you want to include share functionality

// Example property types
const propertyTypes = [
  { id: "apartment", name: "Apartment" },
  { id: "house", name: "House" },
  { id: "land", name: "Land" },
  { id: "building", name: "Building" },
  { id: "farms", name: "Farms" },
  { id: "commercial", name: "Commercial" },
  { id: "chalet", name: "Chalet" },
  { id: "shops", name: "Shops" },
];

// Example reasons
const reasons = [
  { id: "sell", name: "For Sale" },
  { id: "rent", name: "For Rent" },
];

/**
 * Combined detail + edit modal
 */
export default function AdDetailWithEdit({ cities, setFilters }: any) {
  const params = useParams();
  const router = useRouter();
  const adId = useMemo(() => params.id, [params.id]); 
  const [adDetails, setAdDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For the image slider
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // For the "edit" modal
  const [showEditModal, setShowEditModal] = useState(false);

  // Form data (mirroring what you had in CreateAdModal)
  const [formData, setFormData] = useState<any>({
    id: "",
    property_type: "",
    reason: "",
    city: "",
    price: "",
    owner_name: "",
    owner_phone: "",
    description: "",
    kuwait_finder_link: "",
    currency_id: 1,
    main_image: "",
  });
  const [additionalImages, setAdditionalImages] = useState<
    { id?: number; name: string; image_url: string }[]
  >([]);

  // Refs to guard repeated fetching
  const isFetchedDetail = useRef(false);

  // --- Fetch & Show Ad Details ---
  const fetchAdDetails = useCallback(async () => {
    if (!adId) return;
    setLoading(true);
    setError(null);

    try {
      // Example user data from localStorage
      const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");

      if (!isFetchedDetail.current) {
        // Example call: fetch property details
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
        // const detailsData = response.data?.result?.result;
        // setAdDetails(detailsData?.data || null);
        isFetchedDetail.current = true;
      }
    } catch (err: any) {
      console.error("Error fetching ad details:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [adId]);

  // On mount, fetch data
  useEffect(() => {
    fetchAdDetails();
  }, [fetchAdDetails]);

  // Memoize the images array for slider
  const images = useMemo(() => {
    if (!adDetails) return [];
    return [
      adDetails.image,
      ...(adDetails?.additional_images?.map((img: any) => img.image_url) || []),
    ];
  }, [adDetails]);

  // Slider controls
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Helper function to remove HTML tags
  const stripHtmlTags = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  // --- EDIT / DELETE LOGIC ---

  // 1) Delete Ad
  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this ad?");
    if (confirmed) {
      try {
        const response = await axios.post(
          "http://localhost:8069/api/real-estate/ads/delete",
          {
            jsonrpc: "2.0",
            method: "call",
            params: { ad_id: adId },
          }
        );
        if (response.data.result?.success) {
          alert("Ad deleted successfully!");
          // Possibly navigate away or refresh
          router.push("/"); 
        } else {
          alert("Failed to delete ad. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting ad:", error);
        alert("An error occurred while deleting the ad.");
      }
    }
  };

  // 2) Open the edit modal — populate form
  const openEditModal = () => {
    if (!adDetails) return;
    // Match city by name if you need ID, etc.
    const matchedCity = cities?.find((c: any) => c.name === adDetails.city);
    const matchedProp = propertyTypes.find(
      (p: any) => p.name === adDetails.property_type
    );
    const matchedReason = reasons.find((r: any) => r.id === adDetails.reason);

    setFormData({
      id: adDetails.id,
      city: matchedCity ? matchedCity.id : "",
      property_type: matchedProp ? matchedProp.id : "",
      reason: matchedReason ? matchedReason.id : "",
      price: adDetails.price,
      owner_name: adDetails.owner_name,
      owner_phone: adDetails.owner_phone,
      description: stripHtmlTags(adDetails.description),
      kuwait_finder_link: adDetails?.kuwait_finder_link || "",
      currency_id: adDetails.currency_id,
      main_image: adDetails.image, // Base64 if you stored it that way
    });

    // Additional images in local state
    setAdditionalImages(adDetails?.additional_images || []);
    setShowEditModal(true);
  };

  // 3) Close the edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setError(null);
  };

  // 4) Image Upload Handler (same as in CreateAdModal)
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "main" | "additional"
  ) => {
    const files = event.target.files;
    if (!files || !files[0]) return;

    setLoading(true);
    const reader: any = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const base64 = reader.result.split(",")[1];
        if (type === "main") {
          setFormData((prev: any) => ({
            ...prev,
            main_image: base64,
          }));
        } else {
          setAdditionalImages((prev) => [
            ...prev,
            { name: "", image_url: base64 },
          ]);
        }
      }
      setLoading(false);
    };
  };

  // 5) Handle input changes in form
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "city") {
      setFormData((prev: any) => ({ ...prev, city: Number(value) }));
    } else if (name === "description") {
      setFormData((prev: any) => ({ ...prev, description: stripHtmlTags(value) }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  // 6) Delete an additional image from local state
  const deletedImage = async (index: number, imageId?: number) => {
    // If it’s an existing image (meaning it has an ID in DB), call the API
    if (imageId) {
      try {
        setLoading(true);
        // Example call to remove an image
        const response = await axios.post(
          "http://localhost:8069/api/real-estate/ads/delete-image",
          {
            jsonrpc: "2.0",
            method: "call",
            params: {
              image_id: imageId,
              ad_id: adDetails?.id,
            },
          }
        );

        if (response.data?.result?.result?.success) {
          setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
        } else {
          setError("Failed to delete image.");
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        setError("Network error while deleting image.");
      } finally {
        setLoading(false);
      }
    } else {
      // If it's new (no ID), just remove from state
      setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // 7) Validate data before submit
  const validateFormData = (data: any) => {
    const errors: string[] = [];
    if (!data.property_type) errors.push("Property Type is required.");
    if (!data.reason) errors.push("Reason is required.");
    if (!data.city) errors.push("City is required.");
    if (!data.price) errors.push("Price is required.");
    if (!data.owner_name) errors.push("Owner Name is required.");
    if (!data.owner_phone) errors.push("Owner Phone is required.");
    if (!data.description) errors.push("Description is required.");
    return errors;
  };

  // 8) Submit form for updating ad
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const errors = validateFormData(formData);
    if (errors.length > 0) {
      setError(errors[0]);
      setLoading(false);
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      // For editing, the endpoint might be an update endpoint
      const response = await axios.post(
        "http://localhost:8069/api/real-estate/ads/update",
        {
          jsonrpc: "2.0",
          method: "call",
          params: {
            ...formData,
            additional_images: [], 
            // or handle new images as needed 
            // if you want to upload them separately or pass them all at once
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response?.data?.result?.result?.success) {
        alert("Ad updated successfully!");
        setShowEditModal(false);
        // Re-fetch details to reflect updates
        fetchAdDetails();
      } else {
        setError(
          response?.data?.result?.result?.message || "Failed to update the ad."
        );
      }
    } catch (error) {
      console.error(error);
      setError("Error updating ad. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ---

  // Loading & error states
  if (loading && !showEditModal && !adDetails) {
    return <p className="text-blue-500 text-center text-xl">Loading...</p>;
  }
  if (error && !showEditModal && !adDetails) {
    return <p className="text-red-500 text-center text-lg">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-2 mt-3 bg-white shadow-2xl rounded-lg">
      {/* Detail Section */}
      {adDetails && (
        <>
          <div className="relative w-full h-[300px] rounded-lg overflow-hidden bg-gray-200">
            {images.length > 0 ? (
              <>
                <img
                  src={`data:image/jpeg;base64,${images[currentImageIndex]}`}
                  alt={adDetails.name}
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
                      alt="Additional"
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {adDetails?.name}
            </h1>
            <p className="text-gray-600 text-lg mt-2">
              {stripHtmlTags(adDetails?.description)}
            </p>
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
                <span className="font-semibold">
                  {adDetails?.total_visits}
                </span>
              </p>
            </div>
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

            {/* If the user is allowed to edit this ad (isOwner) */}
            {adDetails?.isOwner && (
              <div className="mt-6 flex flex-col gap-2">
                <button
                  onClick={openEditModal}
                  className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-950 transition"
                >
                  Edit This Ad
                </button>

                <button
                  className="text-red-700 bg-transparent hover:bg-red-100 rounded-md border border-red-400 px-4 py-2 flex items-center justify-center gap-2 transition-all"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-5 h-5" /> Delete
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* --- EDIT MODAL (conditionally shown) --- */}
      {showEditModal && (
        <div className="fixed w-full mt-12 inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="relative m-2 w-full max-w-2xl h-auto overflow-auto bg-white p-8 rounded-3xl shadow-lg transition-all duration-500">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-red-100 text-red-600 p-2 rounded-full shadow-sm hover:bg-red-200 hover:shadow-md transition"
              onClick={closeEditModal}
              aria-label="Close"
            >
              ✕
            </button>

            {loading && <Loader />}

            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Edit Real Estate Ad
            </h2>
            {error && <p className="text-center text-lg text-red-500">{error}</p>}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Property Type */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block">
                    Property Type:
                    <select
                      name="property_type"
                      required
                      value={formData.property_type}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Property Type</option>
                      {propertyTypes.map((pt) => (
                        <option key={pt.id} value={pt.id}>
                          {pt.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold">City</label>
                  <select
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="">Select City</option>
                    {cities?.map((city: any) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block">
                    Reason:
                    <select
                      name="reason"
                      required
                      value={formData.reason}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Reason</option>
                      {reasons.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div>
                  <label className="block">
                    Price (in currency):
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </label>
                </div>
                <div>
                  <label className="block">
                    Owner Name:
                    <input
                      type="text"
                      name="owner_name"
                      value={formData.owner_name}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </label>
                </div>
                <div>
                  <label className="block">
                    Owner Phone:
                    <input
                      type="text"
                      name="owner_phone"
                      value={formData.owner_phone}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </label>
                </div>
              </div>

              <label className="block">
                Description:
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </label>

              <label className="block">
                Kuwait Finder Link:
                <input
                  type="text"
                  name="kuwait_finder_link"
                  value={formData.kuwait_finder_link}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </label>

              {/* Main Image */}
              <label className="block">
                Main Image:
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "main")}
                  className="w-full p-2 border rounded"
                />
              </label>

              {/* If there's a main image in the form data, show preview */}
              {formData?.main_image && (
                <img
                  src={`data:image/png;base64,${formData.main_image}`}
                  alt="Main Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}

              {/* Additional Images */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Additional Images</h3>
                {additionalImages?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {additionalImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={`data:image/png;base64,${img.image_url}`}
                          alt="Preview"
                          className="w-28 h-28 object-cover rounded"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            deletedImage(index, img.id);
                          }}
                          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Button to add more additional images */}
                {additionalImages?.length < 4 ? (
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e, "additional")}
                    className="mt-2"
                  />
                ) : (
                  <p className="text-red-500 text-sm mt-2">
                    You can upload a maximum of 4 additional images.
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-green-700 transition mt-4"
              >
                {loading ? "Updating..." : "Update Ad"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
