"use client";
import { useState, useEffect } from "react";

interface Filters {
  property_type?: string;
  city?: string;
  reason?: string;
}

interface PropertyFiltersProps {
  filters: Filters;
  setFilters: any;
  cities:any
}
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

const PropertyFilters=({ filters, setFilters,cities ,handleAdChange,fetchPropertiesWithFilter}:any) => {
  
  const [propertyType, setPropertyType] = useState("");
  const [propertyCategory, setPropertyCategory] = useState("");
  const [city, setCity] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // NEW: state for price range
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  
  const handleApplyFilter = () => {
    setFilters((prev: any) => ({
      ...prev,
      property_type: propertyType,
      reason: propertyCategory,
      city,
      price_min: priceMin,
      price_max: priceMax,
    }));
    // fetchPropertiesWithFilter();
  };

  const handleClear = () => {
    setFilters({
      property_type: "",
      reason: "",
      city: "",
    });
    setPropertyType("");
    setPropertyCategory("");
    setCity("");
    setPriceMin("");
    setPriceMax("");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Property Type */}
        <div>
          <label className="block text-sm font-semibold">Property Type</label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Any</option>
            {propertyTypes.map((type: any) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold">City</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Any</option>
            {cities&&cities?.map((city: any) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-semibold">Reason</label>
          <select
            value={propertyCategory}
            onChange={(e) => setPropertyCategory(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Any</option>
            <option value="sell">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-semibold">Price Min</label>
          <input
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="Enter min price"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Price Max</label>
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="Enter max price"
          />
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <button
          type="button"
          className="flex w-full justify-center m-1 bg-blue-700 hover:bg-blue-950 text-white py-2 rounded-lg"
          onClick={handleApplyFilter}
        >
          Apply Filters
        </button>
        <button
          type="button"
          className="flex w-full justify-center m-1 bg-gray-400 hover:bg-black text-white py-2 rounded-lg"
          onClick={handleClear}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default PropertyFilters;
