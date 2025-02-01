"use client";
import axios from "axios";
import { useState, useEffect } from "react";

interface Filters {
  property_type?: string;
  city?: string;
  reason?: string;
}

interface PropertyFiltersProps {
  filters: Filters;
  setFilters: any;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({ filters, setFilters }) => {
  const [propertyType, setPropertyType] = useState("");
  const [propertyCategory, setPropertyCategory] = useState("");
  const [city, setCity] = useState("");
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch Property Types and Cities when the component mounts
  useEffect(() => {
    fetchPropertyTypes();
    fetchCities();
  }, []);

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
        setError(response.data?.result?.message || "Failed to fetch property types.");
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

  const handleApplyFilter = () => {
    console.log("Applying Filters...");
    const myf = {
      property_type: propertyType,
      reason: propertyCategory,
      city: city,
    };
    setFilters(myf);
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
              <option key={type.id} value={type.name}>
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
            {cities.map((city: any) => (
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

      <div className="flex justify-between mt-4">
        <button
          type="button"
          className="flex w-full justify-center m-1 bg-blue-600 text-white py-2 rounded-lg"
          onClick={handleApplyFilter}
        >
          Apply Filters
        </button>
        <button
          type="button"
          className="flex w-full justify-center m-1 bg-gray-400 text-white py-2 rounded-lg"
          onClick={handleClear}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default PropertyFilters;
