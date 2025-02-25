"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import MYLayout from "@/components/PropertyPage/MYLayout";
import PropertyListing from "@/components/PropertyPage/PropertyListing";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { fetchadminProperties, fetchAllCities, } from "@/services/api";
import PropertiesAdminPage from "@/components/admin/PropertyListingadmin";

export default function Home() {
  const [filters, setFilters] = useState({
    property_type: "",
    city: "",
    reason: "",
    price_min: "",
    price_max: "",
  });

  const [properties, setProperties] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAds, setSelectedAds] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalItems, setTotalItems] = useState(0);
  
  const router = useRouter();
  const isFetched = useRef(false);

  const fetchProperties = useCallback(async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await fetchadminProperties(page, pageSize, filters);
      if (response) {
        setProperties(response.ads);
        setTotalItems(response.total || 0);
      } else {
        throw new Error(response.data?.error?.message || "Failed to fetch properties");
      }
    } catch (error) {
    //   setError("Error fetching properties.");
      console.error("API Error (Properties):", error);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  const fetchCities = useCallback(async () => {
    try {
      const response = await fetchAllCities();
      if (response?.success) {
        setCities(response.data);
      } else {
        throw new Error(response.data?.error?.message || "Failed to fetch cities.");
      }
    } catch (error) {
      setError("Error fetching cities.");
      console.error("API Error (Cities):", error);
    }
  }, []);

  useEffect(() => {
    // if (!isFetched.current) {
         Promise.all([fetchProperties(), fetchCities()]);
    //   isFetched.current = true;
    // }
  }, [fetchProperties, fetchCities,filters]);

  const handleAdChange = useCallback(() => {
    fetchProperties();
  }, [fetchProperties]);

  const toggleSelectAd = (ad: { id: any; }) => {
    setSelectedAds((prev:any) => prev.some((item:any) => item.id === ad.id)
      ? prev.filter((item:any) => item.id !== ad.id)
      : [...prev, ad]
    );
  };

  return (
    <MYLayout properties={properties} cities={cities} selectedAds={selectedAds} handleAdChange={handleAdChange}>
      {loading && <p className="text-center text-blue-500 mt-4"><Loader /></p>}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      
      <PropertiesAdminPage
        filters={filters} setFilters={setFilters}
        properties={properties} cities={cities}
        handleAdChange={handleAdChange}
        toggleSelectAd={toggleSelectAd} selectedAds={selectedAds}
      />
    </MYLayout>
  );
}
