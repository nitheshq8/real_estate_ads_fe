"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { searchSharedLink } from "@/services/api";

const SharedLinksTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sharedLinks, setSharedLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search Filters
  const [sharedWith, setSharedWith] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  // Function to Fetch Shared Links
  const fetchSharedLinks = async () => {
    setLoading(true);
    setError(null);

    try {
      
      const response = await axios.post(
        "http://localhost:8069/api/real-estate/share/search",
        {
          jsonrpc: "2.0",
          method: "call",
          params: {
            shared_with: sharedWith,
            expiry_date: expiryDate,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  setSharedLinks(response?.data?.result?.result?.data);
        if (response?.data?.result?.result.success) {
          setSharedLinks(response?.data?.result?.result?.data);
        } else {
          setError(response?.data?.result?.result.message);
        }

      if (response.data.result.success) {
        setSharedLinks(response.data.result.data);
      } else {
        setError(response.data.result.message);
      }
    } catch (err) {
      // setError("Error fetching shared links.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedLinks();
  }, []);

  return (
    <>
      {/* Button to Open Modal */}
      <div className="container mx-auto ">
        <button
        className=" p-2  md:bg-green-300 hover:bg-green-900 bg-white min-w-fit  hover:text-white   rounded-md"
        onClick={() => setIsModalOpen(true)}
        >
          View Shared Ads
        </button>
      </div>

      {/* Modal */}
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
              <div className="mb-4 flex space-x-2">
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

              {/* Shared Links Table */}
              {!loading && !error && (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="px-4 py-2 border">#</th>
                        <th className="px-4 py-2 border">Shared With</th>
                        <th className="px-4 py-2 border">Expiry Date</th>
                        <th className="px-4 py-2 border">Visit Count</th>
                        <th className="px-4 py-2 border">Share Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sharedLinks?.length > 0 ? (
                        sharedLinks?.map((link: any, index: number) => (
                          <tr key={link.id} className="border">
                            <td className="px-4 py-2 border">{index + 1}</td>
                            <td className="px-4 py-2 border">{link.shared_with || "N/A"}</td>
                            <td className="px-4 py-2 border">{link.expiry_date || "N/A"}</td>
                            <td className="px-4 py-2 border">{link.visit_count}</td>
                            <td className="px-4 py-2 border">
                              <a
                                href={link.share_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                Open Link
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-4 text-gray-500">
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
    </>
  );
};

export default SharedLinksTable;

