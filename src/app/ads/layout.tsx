

"use client";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import MYLayout from "@/components/PropertyPage/MYLayout";
import PropertyListing from "@/components/PropertyPage/PropertyListing";
import AdDetailPage from "@/components/AdDetailPage/AdDetailPage";
import Footer from "@/components/Footer";

export default function Home({children}:any) {
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
  const [selectedAds, setSelectedAds] = useState([]);

  /** Fetch Properties */
  const fetchProperties = async () => {
    const accessToken = localStorage.getItem("accessToken");
        const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
    
    try {
      const response = await axios.post("http://localhost:8069/api/real-estate/ads/search", {
        jsonrpc: "2.0",
        method: "call",
        params: { limit: 10, offset: 0, ...filters,user_id:userData.user_id  },
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
  const isFetched = useRef(false);
  const fetchAdDetailsMemoized = useMemo(() => fetchData, []);
  
  const fetchAdfetchPropertiessMemoized = useMemo(() => fetchProperties, []);
  

  useEffect(() => {
      if (!isFetched.current) {
        fetchAdDetailsMemoized();
          isFetched.current = true;
      }
      
  }, [filters]);
  const handleAdChange = useCallback(() => {
    fetchProperties();
  }, [fetchProperties]);

  const toggleSelectAd = (ad: { id: any; }) => {
    setSelectedAds((prev:any) => {
      const exists = prev.find((item: { id: any; }) => item.id === ad.id);
      return exists ? prev.filter((item: { id: any; }) => item.id !== ad.id) : [...prev, ad];
    });
  };
  
  return (
    <div>
      <MYLayout properties={properties} cities={cities}  selectedAds={selectedAds} isdetailpage={false} handleAdChange={handleAdChange}>
      {children}
      </MYLayout>
     
    </div>
  );
}
