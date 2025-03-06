"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiMapPin, FiArrowRight } from "react-icons/fi";
import { fetchAllCities, fetchSharedAdsByToken, getCompanydetailsBytoken } from "@/services/api";
import PropertyFilters from "@/components/PropertyPage/PropertyFilters";
import Loader from "@/components/Loader";

const SharedView = () => {
  const { access_token } = useParams();
  const router = useRouter();

  // Main states
  const [adDetails, setAdDetails] = useState<{ ad_details: any[]; total: number }>({
    ad_details: [],
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Company data
  const [companydata, setCompanyData] = useState({
    name: "-",
    email: "-",
    phone: "-",
    website: "N/A",
    address: "-",
    logo: "",
  });

  // Filter states
  const [filters, setFilters] = useState({
    property_type: "",
    city: "",
    reason: "",
    price_min: "",
    price_max: "",
  });

  // Pagination states
  const [page, setPage] = useState(1);
  const pageSize = 6; // or 10, your choice

  // For city dropdown
  const [cities, setCities] = useState([]);
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

  // Fetch Ads with filters + pagination
  const fetchSharedAds = useCallback(async () => {
    if (!access_token) return;
    setLoading(true);
    setError(null);

    try {

      
      const response:any = await fetchSharedAdsByToken( 
  {
        jsonrpc: "2.0",
        id: null,
        params: {
          access_token,
          ...filters,
          limit: pageSize,
          offset: (page - 1) * pageSize,
        },
      }
       );

      // Suppose server returns: { result: { data: { ad_details, total } } }
      const result = response.data.result;
      if (result && result.data) {
        setAdDetails({
          ad_details: result.data.ad_details || [],
          total: result.data.total || 0,
        });
      } else {
        setAdDetails({ ad_details: [], total: 0 });
        setError("Unexpected response format.");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching shared link details.");
    } finally {
      setLoading(false);
    }
  }, [access_token, filters, page]);

  // Fetch company details
  const getCompanyDetails = useCallback(async () => {
    if (!access_token) return;
    try {
      const response: any = await getCompanydetailsBytoken({ access_token });
      if (response?.data?.result?.success) {
        setCompanyData(response.data.result.data);
      }
    } catch (err) {
      console.error("Error fetching company details:", err);
    }
  }, [access_token]);

  // On first load
  // useEffect(() => {
  //   fetchCities();
  //   getCompanyDetails();
  // }, [fetchCities, getCompanyDetails]);

  // Whenever token / page / filters changes => fetch ads
  useEffect(() => {
    fetchSharedAds();
  }, [fetchSharedAds]);

  // If user modifies filters => reset to page=1
  const handleAdChange = useCallback(() => {
    setPage(1);
  }, []);

  // Rendering
  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100 p-6">
      {/* Loader overlay (full-page) */}
      {loading && <p className="text-blue-500">
        <Loader/>
        </p>}
    

    
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Shared Property Advertisements</h1>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Filter Component
      <PropertyFilters
        filters={filters}
        setFilters={setFilters}
        cities={cities}
        handleAdChange={handleAdChange}
        fetchPropertiesWithFilter={() => {}}
      /> */}

      {/* Ads Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
        {adDetails.ad_details.map((ad: any) => (
          <div key={ad.ad_id || ad.id} className="bg-white shadow-md rounded-lg p-1 w-full mx-auto">
            <img
              src={ad.image ? `data:image/jpeg;base64,${ad.image}` : "https://via.placeholder.com/600"}
              alt={ad.name}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-1">For Sale</p>
              <h2 className="text-lg font-semibold mb-2">
                Apartment For Sale in {ad.name} for ₹{ad.price?.toFixed(2)}
              </h2>

              <p className="text-gray-700 mb-1">
                <span className="font-bold">Type:</span> Apartment
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-bold">Location:</span> {ad.location || "Not Available"}
              </p>
              <p className="text-gray-900 font-bold">
                Price: ₹ {ad.price?.toFixed(2)}
              </p>

              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => router.push(`/shared/${access_token}/ad/${ad.ad_id || ad.id}`)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-900 flex items-center"
                >
                  View Details <FiArrowRight className="ml-2" />
                </button>
             
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        {/* Previous Button */}
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page <= 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page <strong>{page}</strong>
        </span>

        {/* Next Button */}
        <button
          onClick={() => setPage((prev) => prev + 1)}
          // disable if we've reached or surpassed total
          disabled={(page - 1) * pageSize + adDetails.ad_details.length >= adDetails.total}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <footer className="text-center text-gray-500 mt-10">
        Copyright © My Company
      </footer>
    </div>
  );
};

export default SharedView;
