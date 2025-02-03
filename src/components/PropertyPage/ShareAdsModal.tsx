

"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { createShrareLink } from "@/services/api";
import SharedLinksTable from "./SharedLinksTable";

const ShareAdsModal = ({ selectedAds }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [duration, setDuration] = useState(1);
  const [expiryUnit, setExpiryUnit] = useState("days");
  const [showKuwaitFinder, setShowKuwaitFinder] = useState(true);
  const [createdOn, setCreatedOn] = useState("");
  const [expiresOn, setExpiresOn] = useState("");
  const [visitCount, setVisitCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  console.log("selectedAds", selectedAds);

  // Set created & expiry date
  useEffect(() => {
    const currentDate = new Date();
    setCreatedOn(currentDate.toLocaleString());

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + duration);
    setExpiresOn(expiryDate.toLocaleString());
  }, [duration]);

  // Function to Handle Share API Call
  const handleShare = async () => {
    if (selectedAds.length === 0) {
      setError("Please select at least one ad to share.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const accessToken = localStorage.getItem("accessToken");
      const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");

      const response = await createShrareLink({
        ad_ids: selectedAds.map((ad: { id: any }) => ad.id),
        shared_with: recipient,
        expiry_duration: duration,
        expiry_unit: expiryUnit,
        show_kuwait_finder: showKuwaitFinder,
      });

      if (response.result.success) {
        setMessage(`Share Link: ${response.result.message}
            ${response.result?.data?.share_url}
            `);
      } else {
        setError(response.result.message);
      }
    } catch (err) {
      setError("Error sharing ads.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Share Button to Open Modal */}
      <div className="w-full">
        <button
          className="w-fit p-2 bg-green-500 hover:bg-green-700 text-white rounded-md transition-all"
          onClick={() => setIsModalOpen(true)}
          disabled={selectedAds.length === 0}
        >
       { selectedAds.length > 0 ? " 🔗 Share Selected Ads" :"Please select ads to share."}
    
        </button>
       
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
   
{selectedAds.length === 0 ? (
    <div className="bg-white h-full overflow-auto p-4 md:p-6 rounded-lg shadow-lg w-full max-w-2xl">
    <p className="text-red-500 text-sm mt-2">Please select ads to share.</p>
    </div>

       ):
        <div className="bg-white h-full overflow-auto p-4 md:p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-lg font-bold mb-4">Share Ads</h2>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Shared With</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter recipient name"
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="block text-sm font-medium">Duration</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="border p-2 rounded w-16"
              />
              <select
                value={expiryUnit}
                onChange={(e) => setExpiryUnit(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="days">Days</option>
                <option value="hours">Hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expiry Details */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
          <div>
            <label className="block text-sm font-medium">Created On</label>
            <p className="text-sm">{createdOn}</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Expires On</label>
            <p className="text-sm">{expiresOn}</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Visit Count</label>
            <p className="text-sm">{visitCount}</p>
          </div>
        </div>

        {/* Toggle Kuwait Finder Location */}
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            checked={showKuwaitFinder}
            onChange={() => setShowKuwaitFinder(!showKuwaitFinder)}
          />
          <label className="text-sm font-medium">Show Kuwait Finder Location Link</label>
        </div>

        {/* Selected Ads List */}
        <div className="mt-4 border rounded-lg p-3 max-h-64 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-2">Selected Ads</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2">Image</th>
                <th className="p-2">Title</th>
                <th className="p-2">City</th>
                <th className="p-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {selectedAds.map((ad:any) => (
                <tr key={ad.id} className="border-b">
                  <td className="p-2">
                    <img
                      // src={ad.image || "/placeholder.png"}
                      src= { ad?.image?`data:image/png;base64,${ad?.image}`:"/placeholder.png"}
   
                      alt={ad.title}
                      
                      className="w-12 h-12 rounded"
                    />
                  </td>
                  <td className="p-2">{ad.title}</td>
                  <td className="p-2">{ad.city}</td>
                  <td className="p-2">${ad?.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Success & Error Messages */}
        {message && <p className="text-green-600 mt-2">{message}</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}

        {/* Action Buttons */}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-400 text-white rounded">
            Cancel
          </button>
          <button onClick={handleShare} className="px-4 py-2 bg-purple-600 text-white rounded" disabled={loading}>
            {loading ? "Sharing..." : "Share"}
          </button>
        </div>

        <SharedLinksTable />
      </div>
      
      }
         
        </div>
      )}
    </>
  );
};

export default ShareAdsModal;
