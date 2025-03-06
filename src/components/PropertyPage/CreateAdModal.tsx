"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader";
import { FilePenLine, Trash2 } from "lucide-react";

import imageCompression from "browser-image-compression";
import { useRouter } from "next/navigation";
import SubscriptionPlanDetails from "../Subscription/SubscriptionPlanDetails";
import { adsaddMultiImage, deleteadsImage } from "@/services/api";

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
const CreateAdModal = ({ ad, isEditMode, cities, handleAdChange ,mysubscriptionPlan}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState(0);

  const [showSubErrorModal, setShowSubErrorModal] = useState(false);
  const [additionalImages, setAdditionalImages] = useState<
    { name: string; image_url: string }[]
  >([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, ""); // ✅ Removes all HTML tags
  };

  const router = useRouter();
  // mysubscriptionPlan?.[0]?.have_portal
   // Determine default for show_it_in_portal:
  // If mysubscriptionPlan?.[0]?.have_portal is explicitly false, default to false; otherwise, default to true.
  const defaultShowPortal = mysubscriptionPlan?.[0]?.have_portal !== false;

  const [formData, setFormData] = useState<any>({
    // id?:'',
    property_type: "",
    reason: "",
    city: 1,
    price: "",
    owner_name: "",
    owner_phone: "",
    description: "",
    kuwait_finder_link: "",
    currency_id: 1,
    main_image: "",
    additional_images: [],
    show_it_in_portal: false, // New field: checkbox default checked.
  });
  useEffect(() => {
    setLoading(true);
    if (isEditMode && ad && cities.length > 0) {
      // ✅ Find the matching city by name
      const matchedCity = cities.find((c: any) => c.name === ad.city);

      const matchedPropertyType = propertyTypes.find(
        (p: any) => p.name === ad.property_type
      );

      // ✅ Find the matching reason ID by name
      const reasons = [
        { id: "sell", name: "For Sale" },
        { id: "rent", name: "For Rent" },
      ];
      const matchedReason = reasons.find((r: any) => r.id === ad.reason);
     
      setFormData({
        // ...prev,
        id: ad.id,
        city: matchedCity ? matchedCity.id : ad.city,
        property_type: matchedPropertyType
          ? matchedPropertyType.id
          : ad.property_type, // ✅ Ensure correct property_type ID
        reason: matchedReason ? matchedReason.id : ad.reason, // ✅ Ensure correct reason ID
        // additional_images:[...ad.additional_images],
        // ✅ Ensure city ID is stored
        price: ad.price,
        owner_name: ad.owner_name,
        owner_phone: ad.owner_phone,
        description: stripHtmlTags(ad.description),
        kuwait_finder_link: ad.kuwait_finder_link ? ad.kuwait_finder_link : "",
        currency_id: ad.currency_id,
        main_image: ad.main_image,
        show_it_in_portal:
          ad.show_it_in_portal !== undefined ? ad.show_it_in_portal : false,
      });
      setAdditionalImages([...ad?.additional_images]);
      setCity(matchedCity.id); // ✅ Set the city state with the ID
    }
    setLoading(false);
  }, [ad, isEditMode, cities]); // ✅ Run this effect when cities are loaded

  // // ✅ Convert Image to Base64 & Show Preview
  // const handleImageUpload = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   type: "main" | "additional"
  // ) => {
  //   setLoading(true)
  //   const files = event.target.files;
  //   if (files && files[0]) {
  //     const reader: any = new FileReader();
  //     reader.readAsDataURL(files[0]);
  //     reader.onload = () => {
  //       if (typeof reader.result === "string") {
  //         if (type === "main") {
  //           setFormData((prev: any) => ({
  //             ...prev,
  //             main_image: reader.result.split(",")[1],
  //           }));
  //         } else {
  //           setAdditionalImages((prev) => [
  //             ...prev,
  //             { name: "", image_url: reader.result.split(",")[1] },
  //           ]);
  //         }
  //       }
  //     };
  //   }
  //   setLoading(false)
  // };
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "main" | "additional"
  ) => {
    setLoading(true);
    const files = event.target.files;
    if (files && files[0]) {
      try {
        // Compression Options
        const options = {
          maxSizeMB: 0.5, // Compress to max 0.5MB
          maxWidthOrHeight: 800, // Maximum width or height
          useWebWorker: true, // Enable background processing for better performance
        };

        // Compress Image
        const compressedFile = await imageCompression(files[0], options);

        // Convert Compressed File to Base64
        const reader: any = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onload = () => {
          if (typeof reader.result === "string") {
            const base64Image = reader.result.split(",")[1]; // Extract Base64

            // Store in the correct field
            if (type === "main") {
              setFormData((prev: any) => ({
                ...prev,
                main_image: base64Image,
              }));
            } else {
              setAdditionalImages((prev) => [
                ...prev,
                { name: "", image_url: base64Image },
              ]);
            }
          }
        };
      } catch (error) {
        console.error("Image compression failed:", error);
      }
    }
    setLoading(false);
  };

  // ✅ Handle Additional Image Name Change
  const handleImageNameChange = (index: number, value: string) => {
    setAdditionalImages((prev) => {
      const updatedImages = [...prev];
      updatedImages[index].name = value;
      return updatedImages;
    });
  };
  // ✅ Remove Image from List
  const removeImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement|any
    >
  ) => {
    const { name, value, type, checked } = e.target;

    // ✅ Ensure city dropdown stores the correct ID
    if (type === "checkbox") {
      setFormData((prev: any) => ({ ...prev, [name]: checked }));
    } else if (name === "city") {
      setFormData((prev: any) => ({ ...prev, city: Number(value) }));
    } else if (name == "description") {
      // [name]: name === "description" ? stripHtmlTags(value) : value, // ✅ Strip HTML if it's description
      setFormData((prev: any) => ({
        ...prev,
        description: stripHtmlTags(value),
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  // Submit form
  const validateFormData = (formData: any) => {
    const errors: string[] = [];

    // Check for missing values
    if (!formData.property_type) errors.push("Property Type is required.");
    if (!formData.reason) errors.push("Reason is required.");
    if (!formData.city) errors.push("City is required.");
    if (!formData.price) errors.push("Price is required.");
    if (!formData.owner_name) errors.push("Owner Name is required.");
    if (!formData.owner_phone) errors.push("Owner Phone is required.");
    if (!formData.description) errors.push("Description is required.");
    if (!formData.kuwait_finder_link)
      errors.push("Kuwait Finder Link is required.");
    // if (!formData.main_image) errors.push('Main Image is required.');
    // if (!formData.additional_images.length) errors.push('At least one additional image is required.');

    // If there are any errors, return them, else return true
    if (errors.length > 0) {
      setError(errors[0]);
      setLoading(false);
      return errors;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const validationResult = validateFormData(formData);

    if (validationResult === true) {
      // Form is valid, proceed with submission logic
      const accessToken = localStorage.getItem("accessToken");
      const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
      const url = isEditMode
        ? "http://localhost:8069/api/real-estate/ads/update"
        : "http://localhost:8069/api/real-estate/ads/create";

      try {
        const response = await axios.post(
          url,
          {
            jsonrpc: "2.0",
            method: "call",
            params: {
              ...formData,
              additional_images: !isEditMode ? additionalImages : [],
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`, // Send access token
            },
          }
        );

        if (response?.data?.result?.result?.success) {
         
          setMessage(`Ad ${isEditMode ? "Updated" : "created"} successfully!`);
          alert(`Ad ${isEditMode ? "Updated" : "created"} successfully!`);
          handleAdChange();
          setIsOpen(false);
         
          setMessage(""); // Close modal after submission

          setFormData({
            property_type: "",
            reason: "",
            city: city,
            price: "",
            owner_name: "",
            owner_phone: "",
            description: "",
            kuwait_finder_link: "",
            currency_id: 1,
            main_image: "",
            additional_images: [],
            show_it_in_portal: false, // Reset to default checked.
          });
        } else {
          setMessage(
            response?.data?.result?.result?.message || "Failed to create ad."
          );
        }
        router.refresh();
      } catch (error) {
        // setMessage("Error creating ad. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      // Show error messages
      setLoading(false);
    }
  };
  const deletedImage = async (index: number, imageId?: number) => {


    if ( imageId) {
      try {
        setLoading(true);
        
        const response:any = await deleteadsImage(
          {
        jsonrpc: "2.0",
        method: "call",
        params: {
          image_id: imageId,
          ad_id: ad?.id,
        },
      }
    )
        setLoading(false);
        if (response.data?.result?.result?.success) {
          setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
        } else {
          setError("Failed to delete image.");
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        setError("Network error while deleting image.");
      }
    } else {
      // Remove from local state only if it's not an existing image
      setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const addMultiImage = async () => {
    setLoading(true);
    try {
      if (additionalImages.length > 4) {
        setError("Additional Images less then 4");
      } else {
        const response:any = await adsaddMultiImage( {
          jsonrpc: "2.0",
          method: "call",
          params: {
            images: additionalImages,
            ad_id: ad?.id,
          },
        },)
        
       

        if (response.data?.result?.result?.success) {
          // setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
        } else {
          // setError("Failed to delete image.");
        }
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      setError("Network error while deleting image.");
    }
    // } else {
    //   // Remove from local state only if it's not an existing image
    //   setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    // }
    setLoading(false);
  };

  return (
    <div className="container mx-auto ">
      {/* Button to open modal */}
      <button
       onClick={(e) => {
        e.preventDefault();
        // Check for active subscription plan; if none, open the subscription error modal.
        if (!mysubscriptionPlan || mysubscriptionPlan.length <=10) {
          setShowSubErrorModal(true);
        } else {
          setIsOpen(true);
        }
        setError("");
        setMessage("");
      }}
        className="md:p-2  md:bg-blue-700 hover:bg-blue-900 bg-white min-w-fit  md:text-white   rounded-md"
      >
        {/* <FilePenLine />/ */}
        {isEditMode ? `Edit Ads` : "add new ads"}
      </button>
  {/* Subscription Error Modal */}
  {showSubErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50  flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">No Active Subscription</h2>
            <p className="mb-4">
              You don't have any active plan. Please subscribe to a plan to add new ads.
            </p>
            <div className="max-h-96 overflow-auto">
            <SubscriptionPlanDetails/>
            </div>
   
            <button
              onClick={() => setShowSubErrorModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Close
            </button>
          
          </div>
        </div>
      )}
      {/* Modal */}
      {isOpen && (
        <div className="fixed w-full mt-12 inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="relative m-2  w-full h-full overflow-auto bg-white p-8 rounded-3xl shadow-lg transition-all duration-500">
            {/* Close Button */}
            <button
              className="absolute top-4  right-4 bg-red-100 text-red-600 p-2 rounded-full shadow-sm hover:bg-red-200 hover:shadow-md transition"
              onClick={() => {
                setIsOpen(false),
                  setFormData({
                    property_type: "",
                    reason: "",
                    city: city,
                    price: "",
                    owner_name: "",
                    owner_phone: "",
                    description: "",
                    kuwait_finder_link: "",
                    currency_id: 1,
                    main_image: "",
                    additional_images: [],
                  });
                setLoading(false);
                handleAdChange();
              }}
              aria-label="Close"
            >
              ✕
            </button>
            {/* Header */}
            {loading && <Loader />}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Create Real Estate Ad
            </h2>
            {message && (
              <p className="text-center text-lg text-blue-300">{message}</p>
            )}
            {error && (
              <p className="text-center text-lg text-red-500">{error}</p>
            )}{" "}
            {/* Error message */}
            <form className="space-y-4">
              {/* Property Type */}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block">
                    Property Type: <span className="text-red-500">*</span>
                    <select
                      name="property_type"
                      required
                      value={formData?.property_type}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Property Type</option>
                      <option value="apartment">apartment</option>
                      <option value="villa">villa</option>
                      <option value="office">Office</option>
                    </select>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold">City: <span className="text-red-500">*</span></label>
                  <select
                    name="city"
                    required
                    value={formData?.city} // ✅ Ensure value is the correct ID
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="">Select City</option>
                    {cities.map((city: any) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  {/* Reason */}
                  <label className="block">
                    Reason: <span className="text-red-500">*</span>
                    <select
                      name="reason"
                      required
                      value={formData?.reason}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Reason</option>
                      <option value="sell">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </label>
                </div>
                <div>
                  {/* Price */}
                  <label className="block">
                    Price (in currency):<span className="text-red-500">*</span>
                    <input
                      type="number"
                      name="price"
                      value={formData?.price}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </label>
                </div>
                <div>
                  {/* Owner Name */}
                  <label className="block">
                    Owner Name: <span className="text-red-500">*</span>
                    <input
                      type="text"
                      name="owner_name"
                      value={formData?.owner_name}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </label>
                </div>
                <div>
                  {/* Owner Phone */}
                  <label className="block">
                    Owner Phone:<span className="text-red-500">*</span>
                    <input
                      type="text"
                      name="owner_phone"
                      value={formData?.owner_phone}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </label>
                </div>
              </div>

              {/* Description */}
              <label className="block">
                Description:
                <textarea
                  name="description"
                  value={formData?.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </label>

              {/* Kuwait Finder Link */}
              <label className="block">
                Kuwait Finder Link: <span className="text-red-500">*</span>
                <input
                  type="text"
                  name="kuwait_finder_link"
                  value={formData?.kuwait_finder_link}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </label>
              <div className="mt-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="show_it_in_portal"
                    checked={formData.show_it_in_portal}
                    onChange={handleChange}
                    disabled={mysubscriptionPlan?.[0]?.have_portal === false}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-700">Show it in the portal</span>
                </label>
                {mysubscriptionPlan?.[0]?.have_portal === false && (
                  <p className="text-red-500 text-sm">
                    Upgrade your plan to "premium" to enable portal sharing.
                  </p>
                )}
              </div>
              <label className="block">
                Main Image:
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "main")}
                  className="w-full p-2 border rounded"
                />
              </label>

              {formData?.main_image ? (
                <img
                  src={`data:image/png;base64,${formData?.main_image}`}
                  alt="Main Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              ) : ad?.image ? (
                <img
                  src={`data:image/jpeg;base64,${ad?.image}`}
                  alt={ad?.name}
                  className="w-32 h-32 object-cover"
                />
              ) : (
                ""
              )}
              {/* Additional Images Drawer */}
              {isEditMode && (
                <div className="">
                  <div className="bg-white  p-6 rounded-l-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">
                      Uploaded Additional Images
                    </h2>

                    {/* Image Upload */}
                    {/* <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageUpload(e, "additional")}
                          className="w-full p-2 border rounded"
                        /> */}

                    {/* Image Previews & Names */}
                    {additionalImages?.length > 0 && (
                      <>
                        {/* Desktop / Laptop view: grid layout (visible on md and up) */}
                        <div className="hidden md:grid grid-cols-4 gap-4">
                          {additionalImages?.map((img: any, index) => (
                            <div key={index} className="relative">
                              <img
                                src={`data:image/png;base64,${img.image_url}`}
                                alt="Preview"
                                className="w-full h-28 object-cover rounded"
                              />
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  deletedImage(index, img?.id);
                                }}
                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Mobile view: horizontal scroll (visible on sm screens) */}
                        <div className="md:hidden overflow-x-auto whitespace-nowrap py-2">
                          {additionalImages.map((img: any, index) => (
                            <div
                              key={index}
                              className="relative inline-block mr-4"
                            >
                              <img
                                src={`data:image/png;base64,${img.image_url}`}
                                alt="Preview"
                                className="w-28 h-28 object-cover rounded"
                              />
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  deletedImage(index, img?.id);
                                }}
                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Close Drawer Button */}
                    {/* <button
                    onClick={() =>{addMultiImage(), setIsDrawerOpen(false)}}
                    className="w-full bg-gray-500 text-white py-2 rounded-lg mt-4"
                  >
                    Done
                  </button> */}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="w-full bg-blue-700 hover:bg-blue-950 text-white py-2 rounded-lg"
              >
                Add Additional Images
              </button>

              {isDrawerOpen && (
                <div className="">
                  <div className="bg-white w-full p-6 rounded-l-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">
                      Upload Additional Images
                    </h2>

                    {/* Image Upload */}
                    {additionalImages?.length < 4 ? (
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e, "additional")}
                        className="w-full h-full p-2 border rounded"
                        placeholder="select imag"
                        // className="hidden"
                      />
                    ) : (
                      " you can upload up to 4 images"
                    )}

                    {/* Image Previews & Names */}
                    {additionalImages?.length > 0 && (
                      <>
                        {/* Desktop / Laptop view: grid layout (visible on md and up) */}
                        <div className="hidden md:grid grid-cols-4 gap-4">
                          {additionalImages.map((img: any, index) => (
                            <div key={index} className="relative">
                              <img
                                src={`data:image/png;base64,${img.image_url}`}
                                alt="Preview"
                                className="w-full h-28 object-cover rounded"
                              />
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  deletedImage(index, img?.id);
                                }}
                                className="absolute top-1 right-1 bg-red-300 hover:bg-red-900 rounded-full p-1 shadow"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Mobile view: horizontal scroll (visible on sm screens) */}
                        <div className="md:hidden overflow-x-auto whitespace-nowrap py-2">
                          {additionalImages.map((img: any, index) => (
                            <div
                              key={index}
                              className="relative inline-block mr-4"
                            >
                              <img
                                src={`data:image/png;base64,${img.image_url}`}
                                alt="Preview"
                                className="w-28 h-28 object-cover rounded"
                              />
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  deletedImage(index, img?.id);
                                }}
                                className="absolute bg-red-300 hover:bg-red-900 top-1 right-1 rounded-full p-1 shadow"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Close Drawer Button */}
                    {isEditMode ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addMultiImage();
                          setIsDrawerOpen(false);
                        }}
                        className="w-full  bg-blue-700 hover:bg-blue-950 text-white py-2 rounded-lg mt-4"
                      >
                        {loading ? "Uploading..." : "upload additional images"}
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              )}
                <p className="text-sm text-gray-600 mt-2">
                Fields marked with <span className="text-red-500">*</span> are required.
              </p>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700  text-white py-2 rounded-lg hover:bg-blue-950 transition"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSubmit(e);
                }}
              >
                {loading ? "Creating..." : isEditMode ? "Update " : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAdModal;
