"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const CreateAdModal = ({ ad, isEditMode }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [cities, setCities] = useState([]); // Store cities
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [error, setError] = useState("");
  const [city, setCity] = useState(0);
  const [additionalImages, setAdditionalImages] = useState<
    { name: string; base64: string }[]
  >([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, ""); // ✅ Removes all HTML tags
  };
  const [formData, setFormData] = useState({
    property_type: "apartment",
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
  });
  const fetchPropertyTypes = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8069/api/real-estate/property-types",
        {
          jsonrpc: "2.0",
          method: "call",
          params: {},
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.result?.result?.success) {
        setPropertyTypes(response.data.result?.result.data);
      } else {
        setError(
          response.data?.result?.message || "Failed to fetch property types."
        );
      }
    } catch (err) {
      setError("Error fetching property types. Please try again.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8069/api/real-estate/cities",
        {
          jsonrpc: "2.0",
          method: "call",
          params: {},
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.result?.result?.success) {
        setCities(response.data.result?.result.data);
      } else {
        setError(response.data?.result?.message || "Failed to fetch cities.");
      }
    } catch (err) {
      setError("Error fetching cities. Please try again.");
      console.error("API Error:", err);
    }
  };
  // useEffect(() => {
  //   if (isEditMode && ad) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       ...ad,
  //       city: ad.city?.id || ad.city, // ✅ Ensure city ID is stored
  //     }));
  //     setCity(ad.city?.id || ad.city); // ✅ Set the city state with the ID
  //   }
  // }, [ad, isEditMode]);
  useEffect(() => {
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
      console.log("matchedCity", matchedReason, "000", ad);
      setFormData((prev) => ({
        ...prev,
        ...ad,
        city: matchedCity ? matchedCity.id : ad.city,

        property_type: matchedPropertyType
          ? matchedPropertyType.id
          : ad.property_type, // ✅ Ensure correct property_type ID
        reason: matchedReason ? matchedReason.id : ad.reason, // ✅ Ensure correct reason ID

        // ✅ Ensure city ID is stored
      }));

      setCity(matchedCity.id); // ✅ Set the city state with the ID
    }
  }, [ad, isEditMode, cities]); // ✅ Run this effect when cities are loaded

  useEffect(() => {
    fetchPropertyTypes();
    fetchCities();
  }, []);

  // ✅ Convert Image to Base64 & Show Preview
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "main" | "additional"
  ) => {
    const files = event.target.files;
    if (files && files[0]) {
      const reader: any = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          if (type === "main") {
            setFormData((prev) => ({
              ...prev,
              main_image: reader.result.split(",")[1],
            }));
          } else {
            setAdditionalImages((prev) => [
              ...prev,reader.result.split(",")[1],
            ]);
            // setFormData((prev) => ({
            //   ...prev,
            //   additional_images: [...additionalImages],
            // }));
          }
        }
      };
    }
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
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // ✅ Ensure city dropdown stores the correct ID
    if (name === "city") {
      setFormData((prev) => ({ ...prev, city: Number(value) }));
    } else if (name == "description") {
      // [name]: name === "description" ? stripHtmlTags(value) : value, // ✅ Strip HTML if it's description
      setFormData((prev) => ({ ...prev, description: stripHtmlTags(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
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
          params: {...formData, additional_images: additionalImages}
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Send access token
          },
        }
      );

      if (response?.data?.result?.result?.success) {
        setMessage("Ad created successfully!");
        alert("Ad created successfully!");
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
        });
      } else {
        setMessage(
          response?.data?.result?.result?.message || "Failed to create ad."
        );
      }
    } catch (error) {
      setMessage("Error creating ad. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Button to open modal */}
      <button
        onClick={(e) => (e.preventDefault(), setIsOpen(true), setMessage(""))}
        className="bg-green-300 hover:bg-green-900 min-w-fit  hover:text-white p-2  rounded-md"
      >
        {isEditMode ? "Edit Ad" : "Add New Ads"}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="relative  h-full overflow-auto bg-white w-full max-w-lg p-8 rounded-3xl shadow-lg transition-all duration-500">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-red-100 text-red-600 p-2 rounded-full shadow-sm hover:bg-red-200 hover:shadow-md transition"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Create Real Estate Ad
            </h2>

            {message && (
              <p className="text-center text-lg text-red-500">{message}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Property Type */}
              <label className="block">
                Property Type:
                <select
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Property Type</option>
                  <option value="apartment">apartment</option>
                  <option value="villa">villa</option>
                  <option value="office">Office</option>
                </select>
              </label>
              <div>
                <label className="block text-sm font-semibold">City</label>
                <select
                  name="city"
                  value={formData.city} // ✅ Ensure value is the correct ID
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
              {/* Reason */}
              <label className="block">
                Reason: ii
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Reason</option>
                  <option value="sell">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </label>

              {/* Price */}
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

              {/* Owner Name */}
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

              {/* Owner Phone */}
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

              {/* Description */}
              <label className="block">
                Description:
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </label>

              {/* Kuwait Finder Link */}
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
              <label className="block">
                Main Image:
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "main")}
                  className="w-full p-2 border rounded"
                />
              </label>

              {formData.main_image ? (
                <img
                  src={`data:image/png;base64,${formData.main_image}`}
                  alt="Main Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
              ) : ad&&ad?.image ? (
                <img
                  src={`data:image/jpeg;base64,${ad.image}`}
                  alt={ad?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                ""
              )}
              {/* Additional Images Drawer */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg"
              >
                Add Additional Images
              </button>
              {isDrawerOpen && (
                <div className="">
                  <div className="bg-white w-96 p-6 rounded-l-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">
                      Upload Additional Images
                    </h2>

                    {/* Image Upload */}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, "additional")}
                      className="w-full p-2 border rounded"
                    />

                    {/* Image Previews & Names */}
                    {additionalImages.map((img, index) => (
                      <div key={index} className="flex items-center gap-2 mt-2">
                        <img
                          src={`data:image/png;base64,${img.base64}`}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded"
                        />
                        <input
                          type="text"
                          placeholder="Image Name"
                          value={img.name}
                          onChange={(e) =>
                            handleImageNameChange(index, e.target.value)
                          }
                          className="border p-2 rounded w-full"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="text-red-600 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {/* Close Drawer Button */}
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="w-full bg-gray-500 text-white py-2 rounded-lg mt-4"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
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
