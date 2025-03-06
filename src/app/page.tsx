"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import MYLayout from "@/components/PropertyPage/MYLayout";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { fetchadminProperties, fetchadmintredningProperties, fetchAllCities, fetchAllProperties, fetchSubscriptionPlanByUserId, } from "@/services/api";

import PropertiesPage from "@/components/PropertyPage/PropertyListing";

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
  const [mysubscriptionPlan, setMySubscriptionPlan] = useState<any>(null);
  const [tredningProperties,setTredningProperties]= useState([])
  
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
      console.error("API Error (Properties):", error);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  const fetchAdmintredning = useCallback(async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
     const response = await  fetchadmintredningProperties();
      if (response) {
        setTredningProperties(response.data);
        setTotalItems(response.total || 0);
      } else {
        throw new Error(response.data?.error?.message || "Failed to fetch properties");
      }
    } catch (error) {
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

  const fetchsubscriptionPlan = useCallback(async () => {
    try {
      const response:any = await fetchSubscriptionPlanByUserId();
     setMySubscriptionPlan(response?.data?.result)
    } catch (error) {
      setError("Error fetching cities.");
      console.error("API Error (Cities):", error);
    }
  }, []);
  useEffect(() => {
    // if (!isFetched.current) {
         Promise.all([fetchProperties(), fetchCities(),fetchsubscriptionPlan(),fetchAdmintredning()]);
    //   isFetched.current = true;
    // }
  }, [fetchProperties, fetchCities,filters]);

  const handleAdChange = useCallback(() => {
    fetchProperties();
  }, [fetchProperties]);

  
  const toggleSelectAd = (adOrArray: { id: any, [key: string]: any } | { id: any, [key: string]: any }[]) => {
    setSelectedAds((prev: any) => {
      if (Array.isArray(adOrArray)) {
        const allSelected = properties.length === prev.length;
  
        return allSelected ? [] : properties.map((property: any) => ({ ...property }));
      }
  
      // Toggle individual selection
      return prev.some((item: any) => item.id === adOrArray.id)
        ? prev.filter((item: any) => item.id !== adOrArray.id)
        : [...prev, adOrArray];
    });
  };
  
  return (
    <MYLayout properties={tredningProperties} cities={cities} selectedAds={selectedAds} handleAdChange={handleAdChange} mysubscriptionPlan={mysubscriptionPlan}>
      {loading && <p className="text-center text-blue-500 mt-4"><Loader /></p>}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      
      <PropertiesPage
        filters={filters} setFilters={setFilters}
        properties={properties} cities={cities}
        handleAdChange={handleAdChange}
        toggleSelectAd={toggleSelectAd} selectedAds={selectedAds}
        mysubscriptionPlan={mysubscriptionPlan}
      />
    </MYLayout>
  );
}
