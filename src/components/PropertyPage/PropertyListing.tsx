"use client";
import { useEffect, useState } from "react";
import PropertyFilters from "./PropertyFilters";
import PropertyCard from "./PropertyCard";

const PropertiesPage = () => {
  const [filters, setFilters] = useState({
    property_type: "",
    city: "",
    reason: "",
    price_min: "",
    price_max: "",
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
       setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:8069/api/real-estate/ads/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: { limit: 10, offset: 0, ...filters } }),
        });

        const result = await response.json();
        if (response.ok) {
          setProperties(result.result.ads);
        } else {
          setError(result.error.message || "Failed to fetch properties");
        }
      } catch (error) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Real Estate Listings</h1>

      {/* Filters Component */}
      <PropertyFilters filters={filters} setFilters={setFilters} />

      {/* Loading State */}
      {loading && <p className="text-center text-blue-500 mt-4">Loading...</p>}

      {/* Error State */}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {/* Properties Grid */}
      <div 
    //   className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
      >
        {properties.map((property:any) => (
          <div key={property.id} >
          <PropertyCard key={property.id} property={property} />
           </div>
        ))}
      </div>
    </div>
  );
};

export default PropertiesPage;

         
       
