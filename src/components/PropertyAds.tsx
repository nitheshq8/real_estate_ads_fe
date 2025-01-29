"use client";
import React, { useState } from "react";
import PropertyFormModal from "./PropertyFormModal";
import PropertyList from "./PropertyList";

const PropertyAds = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Property Ads</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-700 transition"
        >
          + New Property Ad
        </button>
      </div>

      {/* Display Property Listings Here */}
<PropertyList/>
      {/* Modal for Adding New Property */}
      <PropertyFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default PropertyAds;
