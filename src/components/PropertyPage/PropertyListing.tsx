// // "use client";
// // import { useEffect, useState } from "react";
// // import PropertyFilters from "./PropertyFilters";
// // import PropertyCard from "./PropertyCard";

// // const PropertiesPage = () => {
// //   const [filters, setFilters] = useState({
// //     property_type: "",
// //     city: "",
// //     reason: "",
// //     price_min: "",
// //     price_max: "",
// //   });

// //   const [properties, setProperties] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);

// //   useEffect(() => {
// //     const fetchProperties = async () => {
// //        setLoading(true);
// //       setError(null);

// //       try {
// //         const response = await fetch("http://localhost:8069/api/real-estate/ads/search", {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //           },
// //           body: JSON.stringify({ data: { limit: 10, offset: 0, ...filters } }),
// //         });

// //         const result = await response.json();
// //         if (response.ok) {
// //           setProperties(result.result.ads);
// //         } else {
// //           setError(result.error.message || "Failed to fetch properties");
// //         }
// //       } catch (error) {
// //         setError("Network error");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchProperties();
// //   }, [filters]);

// //   return (
// //     <div className="p-6">
// //       <h1 className="text-2xl font-bold mb-4">Real Estate Listings</h1>

// //       {/* Filters Component */}
// //       <PropertyFilters filters={filters} setFilters={setFilters} />

// //       {/* Loading State */}
// //       {loading && <p className="text-center text-blue-500 mt-4">Loading...</p>}

// //       {/* Error State */}
// //       {error && <p className="text-center text-red-500 mt-4">{error}</p>}

// //       {/* Properties Grid */}
// //       <div 
// //     //   className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
// //       >
// //         {properties&&properties?.map((property:any) => (
// //           <div key={property.id} >
// //           <PropertyCard key={property.id} property={property} />
// //            </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default PropertiesPage;

         
       
// "use client";
// import { useEffect, useState } from "react";
// import PropertyFilters from "./PropertyFilters";
// import PropertyCard from "./PropertyCard";
// import axios from "axios";

// const PropertiesPage = () => {
//   const [filters, setFilters] = useState({
//     property_type: "",
//     city: "",
//     reason: "",
//     price_min: "",
//     price_max: "",
//   });

//   const [properties, setProperties] = useState([]);
//   const [selectedAds, setSelectedAds] = useState<number[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);

//   // Fetch properties based on filters
//   useEffect(() => {
//     const fetchProperties = async () => {
//       setLoading(true);
//       setError(null);
//       setMessage(null);

//       try {
//         const response = await fetch("http://localhost:8069/api/real-estate/ads/search", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             jsonrpc: "2.0",
//             method: "call",
//             params: { limit: 10, offset: 0, ...filters },
//           }),
//         });

//         const result = await response.json();
//         console.log("reeeee=",result?.result?.result?.ads);
        
//         setProperties(result?.result?.result?.ads);
//         if (response.ok) {
//           // setProperties(result.result.ads);
//         } else {
//           setError(result.error.message || "Failed to fetch properties");
//         }
//       } catch (error) {
//         setError("Network error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProperties();
//   }, [filters]);

//   // Handle property selection
//   const handleSelectProperty = (adId: number) => {
//     setSelectedAds((prev) =>
//       prev.includes(adId) ? prev.filter((id) => id !== adId) : [...prev, adId]
//     );
//   };
//   // Handle sharing selected ads
//   const handleShareAds = async () => {
//     if (selectedAds.length === 0) {
//       alert("Please select at least one ad to share.");
//       return;
//     }
  
//     setLoading(true);
//     setMessage(null);
  
//     try {
//       // Retrieve the stored API key from localStorage
//       const apiKey = localStorage.getItem("accessToken"); 
//       const user:any = localStorage.getItem("aiduser"); // ✅ E
//       const userId=JSON.parse(user)?.user_id
//       console.log("user_id--");
      
//       if (!apiKey) {
//         setError("User not authenticated. Please login again.");
//         setLoading(false);
//         return;
//       }
  
//       const response = await axios.post(
//         "http://localhost:8069/api/real-estate/share",
//         {
//           "jsonrpc": "2.0",
//           "method": "call",
//           "params": {
//               "ad_ids": [1, 2, 3],
//               "shared_with": "John Doe",
//               "expiry_duration": 3,
//               "expiry_unit": "days",
//               "show_kuwait_finder": true,
//               user_id: parseInt(userId)
//           }
//         },


        
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${apiKey}`,  // ✅ Include API Key in headers
//           },
//         }
//       );
  
//       if (response.data.result.success) {
//         setMessage(`Share Link: ${response.data.result.data.share_url}`);
//       } else {
//         setError(response.data.result.message);
//       }
//     } catch (error) {
//       setError("Error sharing ads.");
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Real Estate Listings</h1>

//       {/* Filters Component */}
//       <PropertyFilters filters={filters} setFilters={setFilters} />

//       {/* Loading State */}
//       {loading && <p className="text-center text-blue-500 mt-4">Loading...</p>}

//       {/* Error State */}
//       {error && <p className="text-center text-red-500 mt-4">{error}</p>}

//       {/* Success Message */}
//       {message && (
//         <p className="text-center text-green-600 mt-4">
//           <a href={message} target="_blank" rel="noopener noreferrer">
//             {message}
//           </a>
//         </p>
//       )}

//       {/* Properties Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//         {properties?.map((property: any) => (
//           <div key={property.id} className="border p-4 rounded-lg shadow-md relative">
//             {/* Select Checkbox */}
//             <input
//               type="checkbox"
//               className="absolute top-2 left-2 w-5 h-5"
//               checked={selectedAds.includes(property.id)}
//               onChange={() => handleSelectProperty(property.id)}
//             />

//             <PropertyCard key={property.id} property={property} />
//           </div>
//         ))}
//       </div>

//       {/* Share Button */}
//       <div className="mt-6 text-center">
//         <button
//           onClick={handleShareAds}
//           className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-950"
//           disabled={loading || selectedAds.length === 0}
//         >
//           {loading ? "Sharing..." : "Share Selected Ads"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PropertiesPage;

"use client"
import { Key, useEffect, useState } from "react";
import PropertyFilters from "./PropertyFilters";
import PropertyCard from "./PropertyCard";
import ShareAdsModal from "./ShareAdsModal";

// filters,setFilters,properties,
const PropertiesPage = ({cities,filters, setFilters, toggleSelectAd, selectedAds,properties,handleAdChange,fetchPropertiesWithFilter,mysubscriptionPlan}:any) => {
  // const [filters, setFilters] = useState({
  //   property_type: "",
  //   city: "",
  //   reason: "",
  //   price_min: "",
  //   price_max: "",
  // });

  // const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);


  // const toggleSelectAd = (adId) => {
  //   setSelectedAds((prev) =>
  //     prev.includes(adId) ? prev.filter((id) => id !== adId) : [...prev, adId]
  //   );
  // };
 
  const [selectAll, setSelectAll] = useState(false);
  
 
  const handleSelectAll = () => {
    if (selectedAds.length === properties.length) {
      toggleSelectAd([]); // Deselect all ads
      setSelectAll(false);
    } else {
      toggleSelectAd(properties); // Select all ads
      setSelectAll(true);
    }
  };
  
 

  return (
    <div className="p-6 ">
      <h1 className="text-2xl font-bold mb-4">Real Estate Listings</h1>

      <PropertyFilters filters={filters} setFilters={setFilters} cities={cities} handleAdChange={handleAdChange} fetchPropertiesWithFilter={fetchPropertiesWithFilter}/>
<div className="m-2">
  

<div className="flex justify-around mb-2">
<ShareAdsModal selectedAds={selectedAds} mysubscriptionPlan={mysubscriptionPlan} />
        <button
          className="bg-gray-400 w-full ml-2 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
          onClick={handleSelectAll}
        >
          {selectAll ? "Deselect All" : "Select All"}
        </button>
      </div>

</div>
      <div className="">
        {properties&&properties?.map((property: { id: Key | null | undefined; }) => (
          <div key={property.id} className="border p-4 m-1 rounded  hover:shadow-2xl ">
            <input
              type="checkbox"
             
      // checked={selectedAds.some((ad: { id: Key | null | undefined; }) => ad.id === property.id)}
      checked={selectedAds.some((ad: any) => ad.id === property.id)}
      onChange={() => toggleSelectAd(property)}
              className="mr-2"
            />
            <PropertyCard property={property} cities={cities} handleAdChange={handleAdChange} />
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default PropertiesPage;

