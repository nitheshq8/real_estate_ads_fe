"use client";
import { useState } from "react";

const PropertyModal = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // ✅ Hardcoded Property Types
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

  return (
    <>
      {/* ✅ Trigger Button to Open Modal */}
      <button
        onClick={() => setIsPopupOpen(true)}
        className=" p-2  md:bg-green-300 hover:bg-green-900 bg-white min-w-fit  hover:text-white   rounded-md"
       >
        List Your Property
      </button>

      {/* ✅ Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Select Property Type</h2>

            {/* ✅ Display Property Types */}
            <ul className="space-y-2">
              {propertyTypes.map((type) => (
                <li key={type.id} className="p-2 border rounded-lg cursor-pointer hover:bg-gray-100">
                  {type.name}
                </li>
              ))}
            </ul>

            {/* ✅ Close Button */}
            <button
              onClick={() => setIsPopupOpen(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyModal;
