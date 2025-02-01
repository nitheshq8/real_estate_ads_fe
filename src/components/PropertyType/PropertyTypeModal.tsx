"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const PropertyModal = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    

    const fetchPropertyTypes = async () => {
      
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
          console.log("--res",response?.data?.result?.result);
          
        
        if (response?.data?.result?.result?.success) {
          setPropertyTypes(response.data.result.data);
        } else {
          setError(response.data?.result?.message || "Failed to fetch property types.");
        }
      } catch (err) {
        setError("Error fetching property types. Please try again.");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyTypes();
  }, [isPopupOpen]);

//   if (!isPopupOpen) return null;

  return (
    <>
      {/* Trigger Button: Place this anywhere to open modal */}
      <button
        onClick={() => setIsPopupOpen(true)}
        className="border border-blue-600 text-blue-600 px-4 py-2 rounded-full"
      >
        List Your Property
      </button>

      {/* Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Select Property Type</h2>
            <ul className="space-y-2">
              {propertyTypes?.length > 0 ? (
                propertyTypes?.map((type: any) => (
                  <li key={type.id} className="p-2 border rounded-lg cursor-pointer hover:bg-gray-100">
                    {type.name}
                  </li>
                ))
              ) : (
                <p>No property types</p>
              )}
            </ul>
            <button onClick={() => setIsPopupOpen(false)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyModal;
