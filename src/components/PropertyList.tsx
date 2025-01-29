"use client";

import React, { useState } from "react";

interface PropertyAd {
  id: number;
  image: string;
  title: string;
  propertyType: string;
  city: string;
  price: number;
  ownerName: string;
  ownerPhone: string;
  reason: string;
  totalVisits: number;
  createdAt: string;
}

const propertyAds: PropertyAd[] = [
  {
    id: 1,
    image: "/property1.jpg",
    title: "Apartment For Rent in Hadiya for 450.00 د.ك",
    propertyType: "Apartment",
    city: "Ahmadi -> Hadiya",
    price: 450,
    ownerName: "Dina",
    ownerPhone: "55555555",
    reason: "For Rent",
    totalVisits: 0,
    createdAt: "2025-01-28 15:45:48",
  },
  {
    id: 2,
    image: "/property2.jpg",
    title: "Apartment For Sale in Hadiya for 10,000.00 د.ك",
    propertyType: "Apartment",
    city: "Ahmadi -> Hadiya",
    price: 10000,
    ownerName: "Meshal",
    ownerPhone: "55555555",
    reason: "For Sale",
    totalVisits: 2,
    createdAt: "2025-01-28 15:45:48",
  },
];

const PropertyAdsList = () => {
  const [selectedAds, setSelectedAds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareData, setShareData] = useState({
    recipient: "",
    duration: 1,
    showLocation: true,
  });

  const toggleSelection = (id: number) => {
    setSelectedAds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((adId) => adId !== id)
        : [...prevSelected, id]
    );
  };

  const openModal = () => {
    if (selectedAds.length === 0) {
      alert("Please select at least one ad to share.");
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setShareData({
      ...shareData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={openModal}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700"
        >
          Share Selected Ads
        </button>
      </div>

      {/* Property List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {propertyAds.map((ad) => (
          <div
            key={ad.id}
            className={`p-4 border rounded-lg shadow-lg flex items-center space-x-4 ${
              selectedAds.includes(ad.id) ? "bg-blue-100 border-blue-500" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={selectedAds.includes(ad.id)}
              onChange={() => toggleSelection(ad.id)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <img
              src={ad.image}
              alt={ad.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold">{ad.title}</h3>
              <p className="text-gray-600">
                {ad.propertyType} - {ad.city}
              </p>
              <p className="text-gray-800 font-semibold">
                Price: د.ك {ad.price}
              </p>
              <p className="text-gray-600">
                Owner: {ad.ownerName} ({ad.ownerPhone})
              </p>
              <p className="text-gray-600">Visits: {ad.totalVisits}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Share Ads</h2>
            {/* Share Input Fields */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Shared With:
              </label>
              <input
                type="text"
                name="recipient"
                value={shareData.recipient}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                placeholder="Enter recipient name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Duration (Days) */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Duration (Days):
                </label>
                <input
                  type="number"
                  name="duration"
                  value={shareData.duration}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                  min="1"
                />
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Expiration Date:
                </label>
                <input
                  type="text"
                  value={
                    new Date(
                      new Date().setDate(
                        new Date().getDate() + Number(shareData.duration)
                      )
                    )
                      .toISOString()
                      .split("T")[0]
                  }
                  readOnly
                  className="w-full border p-2 rounded-lg bg-gray-100"
                />
              </div>
            </div>

            {/* Created Date */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Created On:
              </label>
              <input
                type="text"
                value={new Date().toISOString().split("T")[0]}
                readOnly
                className="w-full border p-2 rounded-lg bg-gray-100"
              />
            </div>

            {/* Visit Count */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Visit Count:
              </label>
              <input
                type="text"
                value={
                  selectedAds.length > 0
                    ? selectedAds.reduce((total, id) => {
                        const ad = propertyAds.find((ad) => ad.id === id);
                        return total + (ad?.totalVisits || 0);
                      }, 0)
                    : 0
                }
                readOnly
                className="w-full border p-2 rounded-lg bg-gray-100"
              />
            </div>

            {/* Show Kuwait Finder Location Link */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="kuwait-finder"
                name="showLocation"
                checked={shareData.showLocation}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="kuwait-finder" className="text-gray-700">
                Show Kuwait Finder Location Link?
              </label>
            </div>

            {/* Selected Ads */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2">Selected Ads</h3>
              {propertyAds
                .filter((ad) => selectedAds.includes(ad.id))
                .map((ad) => {
                  const expirationDate = new Date(ad.createdAt);
                  expirationDate.setDate(
                    expirationDate.getDate() + Number(shareData.duration)
                  );

                  return (
                    <div
                      key={ad.id}
                      className="flex items-center space-x-4 border-b py-2 last:border-none"
                    >
                      <img
                        src={ad.image}
                        alt={ad.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-bold">{ad.title}</p>
                        <p className="text-sm text-gray-600">
                          {ad.propertyType} - {ad.city}
                        </p>
                        <p className="text-sm font-semibold">
                          Price: د.ك {ad.price}
                        </p>
                        <p className="text-sm">Visits: {ad.totalVisits}</p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Created At:</span>{" "}
                          {ad.createdAt}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Expires On:</span>{" "}
                          {expirationDate.toISOString().split("T")[0]}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700">
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyAdsList;
