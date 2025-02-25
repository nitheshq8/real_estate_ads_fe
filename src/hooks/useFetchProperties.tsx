"use client";
import { useState, useEffect } from "react";

interface Filters {
  property_type?: string;
  city?: string;
  reason?: string;
  price_min?: string;
  price_max?: string;
}

const useFetchProperties = (filters: Filters) => {
    console.log("----hooks");
    
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

  return { properties, loading, error };
};

export default useFetchProperties;
