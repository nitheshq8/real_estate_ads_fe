"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import MYLayout from "@/components/PropertyPage/MYLayout";
import PropertyListing from "@/components/PropertyPage/PropertyListing";
import AdDetailPage from "@/components/AdDetailPage/AdDetailPage";

export default function Home() {
  const [filters, setFilters] = useState({
    property_type: "",
    city: "",
    reason: "",
    price_min: "",
    price_max: "",
  });

  const [properties, setProperties] = useState([]);
  const [trendingProperties1, setTrendingProperties] = useState([]);
  const [cities, setCities] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Fetch Properties */
  const fetchProperties = async () => {
    try {
      const response = await axios.post("http://localhost:8069/api/real-estate/ads/search", {
        jsonrpc: "2.0",
        method: "call",
        params: { limit: 10, offset: 0, ...filters },
      });

      if (response.data?.result?.result?.ads) {
        setProperties(response.data.result.result.ads);
        setTrendingProperties(response.data.result.result.ads);
      } else {
        throw new Error(response.data?.error?.message || "Failed to fetch properties");
      }
    } catch (error) {
      setError("Error fetching properties.");
      console.error("API Error (Properties):", error);
    }
  };

  /** Fetch Cities */
  const fetchCities = async () => {
    try {
      const response = await axios.post("http://localhost:8069/api/real-estate/cities", {
        jsonrpc: "2.0",
        method: "call",
        params: {},
      });

      if (response.data?.result?.result?.success) {
        setCities(response.data.result.result.data);
      } else {
        throw new Error(response.data?.error?.message || "Failed to fetch cities.");
      }
    } catch (error) {
      setError("Error fetching cities.");
      console.error("API Error (Cities):", error);
    }
  };

 

  /** Fetch All Data in Parallel using `Promise.all` */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchProperties(), fetchCities()]);
    } catch (error) {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  }, []);

  /** Run Fetch Once on Mount & when Filters Change */
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  useEffect( ()=>{
    setLoading(true);
    setError(null);
    try {
      fetchProperties()
    } catch (error) {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  },[filters])
let selectedAds=''
  return (
    <div>
      <MYLayout properties={trendingProperties1} cities={cities} selectedAds={selectedAds}>
        {loading && <p className="text-center text-blue-500 mt-4">Loading...</p>}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
    <AdDetailPage cities={cities}/>
      </MYLayout>
    </div>
  );
}
