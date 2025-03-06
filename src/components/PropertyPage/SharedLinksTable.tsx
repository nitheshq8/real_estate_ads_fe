// "use client";

// import { useState, useEffect, useRef, useMemo } from "react";

// import { IoMdClose } from "react-icons/io";
// import { searchSharedLink } from "@/services/api";

// const SharedLinksTable = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [sharedLinks, setSharedLinks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Search Filters
//   const [sharedWith, setSharedWith] = useState("");
//   const [expiryDate, setExpiryDate] = useState("");

//   // Function to Fetch Shared Links
//   const fetchSharedLinks = async () => {
//     setLoading(true);
//     setError(null);

//     try {
      
//       const response = 
//       await searchSharedLink({
//         shared_with: sharedWith,
//         expiry_date: expiryDate,
//       })
      
//   setSharedLinks(response?.data);
//         if (response?.success) {
//           // setSharedLinks(response?.data);
//         } else {
//           setError(response?.data?.result?.result.message);
//         }

//       if (response.data.result.success) {
//         setSharedLinks(response.data.result.data);
//       } else {
//         setError(response.data.result.message);
//       }
//     } catch (err) {
//       // setError("Error fetching shared links.");
//     } finally {
//       setLoading(false);
//     }
//   };

//  /** Run Fetch Once on Mount & when Filters Change */
//  const isFetched = useRef(false);
//  const fetchSharedLinksMemoized = useMemo(() => fetchSharedLinks, []);
 
//  useEffect(() => {
//   if(isModalOpen){
//     //  if (!isFetched.current) {
//       fetchSharedLinksMemoized();
//     //      isFetched.current = true;
//     //  }
//     }
//  }, [isModalOpen]);
//   return (
//     <>
//       {/* Button to Open Modal */}
//       <div className="container mx-auto ">
//         <button
//         className=" p-2  md:bg-blue-700 hover:bg-blue-900 bg-white min-w-fit  hover:text-white   rounded-md"
//         onClick={() => setIsModalOpen(true)}
//         >
//           View Shared Ads
//         </button>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 h-[90%] overflow-auto rounded-lg shadow-lg w-[98%] max-w-3xl">
//             {/* Close Button */}
//             <button onClick={() => setIsModalOpen(false)} className="text-2xl float-right">
//               <IoMdClose />
//             </button>

//             <div className="container mx-auto p-6">
//               <h2 className="text-2xl font-bold mb-4">Shared Ads Links</h2>

//               {/* Search Filters */}
//               <div className="mb-4 flex space-x-2">
//                 <input
//                   type="text"
//                   placeholder="Search by Name"
//                   value={sharedWith}
//                   onChange={(e) => setSharedWith(e.target.value)}
//                   className="border p-2 rounded w-full"
//                 />
//                 <input
//                   type="date"
//                   value={expiryDate}
//                   onChange={(e) => setExpiryDate(e.target.value)}
//                   className="border p-2 rounded"
//                 />
//                 <button
//                   className="bg-blue-600 text-white px-4 py-2 rounded"
//                   onClick={fetchSharedLinks}
//                 >
//                   Search
//                 </button>
//               </div>

//               {/* Loading & Error Handling */}
//               {loading && <p className="text-blue-500">Loading shared links...</p>}
//               {error && <p className="text-red-500">{error}</p>}

//               {/* Shared Links Table */}
//               {!loading && !error && (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
//                     <thead>
//                       <tr className="bg-gray-100 text-gray-700">
//                         <th className="px-4 py-2 border">#</th>
//                         <th className="px-4 py-2 border">Shared With</th>
//                         <th className="px-4 py-2 border">Expiry Date</th>
//                         <th className="px-4 py-2 border">Visit Count</th>
//                         <th className="px-4 py-2 border">Share Link</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {sharedLinks?.length > 0 ? (
//                         sharedLinks?.map((link: any, index: number) => (
//                           <tr key={link.id} className="border">
//                             <td className="px-4 py-2 border">{index + 1}</td>
//                             <td className="px-4 py-2 border">{link.shared_with || "N/A"}</td>
//                             <td className="px-4 py-2 border">{link.expiry_date || "N/A"}</td>
//                             <td className="px-4 py-2 border">{link.visit_count}</td>
//                             <td className="px-4 py-2 border">
//                               <a
//                                 href={link.share_url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-blue-600 underline"
//                               >
//                                 Open Link
//                               </a>
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan={5} className="text-center py-4 text-gray-500">
//                             No shared ads found.
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default SharedLinksTable;


"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { IoMdClose } from "react-icons/io";
import { searchSharedLink, searchSharedLinkById } from "@/services/api";
import { FiCheck, FiCopy } from "react-icons/fi";

const SharedLinksTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [sharedLinks, setSharedLinks] = useState([]);
  const [selectedSharedAds, setSelectedSharedAds] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);



  const [isMobile, setIsMobile] = useState(false);

  // Search Filters
  const [sharedWith, setSharedWith] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  // Function to Fetch Shared Links
  const fetchSharedLinks = async () => {
    setLoading(true);
    setError(null);

    try {
      // const response = await searchSharedLink({
      //   shared_with: sharedWith,
      //   expiry_date: expiryDate,
      // });
      
        const response = await searchSharedLinkById({
        shared_with: sharedWith,
        expiry_date: expiryDate,
      });
      if (response?.success) {
        setSharedLinks(response.data);
      } else {
        setError(response?.data?.result?.result.message);
      }
    } catch (err) {
      setError("Error fetching shared links.");
    } finally {
      setLoading(false);
    }
  };

  /** Run Fetch Once on Mount & when Filters Change */
  const fetchSharedLinksMemoized = useMemo(() => fetchSharedLinks, []);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    if (isModalOpen) {
      fetchSharedLinksMemoized();
    }
  }, [isModalOpen]);
  const copyToClipboard = (url:any) => {
    
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    
  };
  return (
    <>
    {/* Button to Open Modal */}
    <div className="container mx-auto">
      <button
        className="md:p-2  md:bg-blue-700 hover:bg-blue-900 bg-white min-w-fit  md:text-white   rounded-md"
        onClick={() => setIsModalOpen(true)}
      >
        View Shared Ads
      </button>
    </div>

    {/* Shared Links Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 h-[90%] overflow-auto rounded-lg shadow-lg w-[98%] max-w-3xl">
          {/* Close Button */}
          <button onClick={() => setIsModalOpen(false)} className="text-2xl float-right">
            <IoMdClose />
          </button>

          <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Shared Ads Links</h2>

            {/* Search Filters */}
            <div className="mb-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <input
                type="text"
                placeholder="Search by Name"
                value={sharedWith}
                onChange={(e) => setSharedWith(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="border p-2 rounded"
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={fetchSharedLinks}
              >
                Search
              </button>
            </div>

            {/* Loading & Error Handling */}
            {loading && <p className="text-blue-500">Loading shared links...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Shared Links List (Mobile & Desktop Friendly) */}
            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="px-4 py-2 border">Shared With</th>
                      {!isMobile && <th className="px-4 py-2 border">Expiry Date</th>}
                      {!isMobile && <th className="px-4 py-2 border">Expired</th>}
                      <th className="px-4 py-2 border">Share Link</th>
                      <th className="px-4 py-2 border">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sharedLinks?.length > 0 ? (
                      sharedLinks?.map((link: any, index: number) => (
                        <tr key={link.id} className="border">
                          <td className="px-4 py-2 border">{link.shared_with || "N/A"}</td>
                          {!isMobile && <td className="px-4 py-2 border">{link.expireddate || "N/A"}</td>}
                          {!isMobile && (
                            <td className="px-4 py-2 border">
                              {link.is_expired ? (
                                <span className="text-red-500">Yes</span>
                              ) : (
                                <span className="text-green-500">No</span>
                              )}
                            </td>
                          )}
                          <td className="px-4 py-2 border">
                            <a
                              href={link.share_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={link.is_expired ? "text-red-600 underline" : "text-green-600 underline"}
                            >
                              Open Link
                            </a>
                          </td>
                          <button
                onClick={()=>copyToClipboard(link.share_url)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-950 flex items-center"
              >
                {copied ? <FiCheck className="mr-2" /> : <FiCopy className="mr-2" />}
                {copied ? "Copied" : "Copy"}
              </button>
                          <td className="px-4 py-2 border">
                            <button
                              className="bg-gray-200 px-2 py-1 rounded text-blue-700"
                              onClick={() => {
                                setSelectedSharedAds(link.sharedData);
                                setIsDetailsModalOpen(true);
                              }}
                            >
                              View Ads
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={isMobile ? 3 : 5} className="text-center py-4 text-gray-500">
                          No shared ads found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    )}

    {/* Shared Ads Details Modal */}
    {isDetailsModalOpen && selectedSharedAds && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 h-[90%] overflow-auto rounded-lg shadow-lg w-[98%] max-w-3xl">
          {/* Close Button */}
          <button onClick={() => setIsDetailsModalOpen(false)} className="text-2xl float-right">
            <IoMdClose />
          </button>

          <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Shared Ads Details</h2>

            {/* Shared Ads List */}
            {selectedSharedAds?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedSharedAds.map((ad: any) => (
                  <div key={ad.productId} className="border p-4 rounded shadow-md">
                    <img
                      src={ad.image}
                      alt={ad.name}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <h3 className="text-lg font-semibold mt-2">{ad.name}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No shared ads available.</p>
            )}
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default SharedLinksTable;
