

"use client";
import { useState, useEffect } from "react";
import { createShrareLink } from "@/services/api";
import SharedLinksTable from "./SharedLinksTable";
import { FiCheck, FiCopy } from "react-icons/fi";

const ShareAdsModal = ({ selectedAds ,mysubscriptionPlan}: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [duration, setDuration] = useState(1);
  const [expiryUnit, setExpiryUnit] = useState("days");
  const [forever, setForever] = useState(false);
  const [createdOn, setCreatedOn] = useState("");
  const [expiresOn, setExpiresOn] = useState("");
  const [visitCount, setVisitCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sharedlink, setSharedLink] = useState("");
  const [copied, setCopied] = useState(false);
console.log("selectedAds",selectedAds);

  const [showKuwaitFinder, setShowKuwaitFinder] = useState(true);
  useEffect(() => {
    const currentDate = new Date();
    setCreatedOn(currentDate.toLocaleString());

    if (!forever) {
      const expiryDate = new Date();
      if (expiryUnit === "days") {
        expiryDate.setDate(expiryDate.getDate() + duration);
      } else {
        expiryDate.setHours(expiryDate.getHours() + duration);
      }
      setExpiresOn(expiryDate.toLocaleString());
    } else {
      setExpiresOn("Never"); // Link does not expire
    }
  }, [duration, expiryUnit, forever]);

  // Function to Handle Share API Call
  const handleShare = async () => {
    if (selectedAds.length === 0) {
      setError("Please select at least one ad to share.");
      return;
    }

    if (!recipient) {
      setError("Please enter recipient name.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await createShrareLink({
        ad_ids: selectedAds.map((ad: { id: any }) => ad.id),
        shared_with: recipient,
        expiry_duration: forever ? null : duration, // If forever is checked, set expiry_duration as null
        expiry_unit: forever ? null : expiryUnit, // If forever is checked, remove expiry unit
        show_kuwait_finder: showKuwaitFinder,
      });

      if (response.data?.result?.result.success) {
        setSharedLink(response.data?.result?.result?.data?.share_url);
           // ✅ Clear form values after successful sharing
      setRecipient("");
      setDuration(1);
      setExpiryUnit("days");
      setForever(false);
      setShowKuwaitFinder(true);
      
        setMessage(`Share Link Created: ${response.data?.result?.result?.data?.share_url}`);
      } else {

console.log("----response?.data?.resultn--0",response?.data?.result?.error.message);
        setError(response?.data?.result?.error.message);
      }
    } catch (err) {
      // setError("Error sharing ads.",err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (url: any) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Share Button to Open Modal */}
      <div className="w-full">
        {selectedAds.length > 0 && (
          <button
            className="w-full p-2 bg-blue-700 hover:bg-blue-950 text-white rounded-md transition-all"
            onClick={() => setIsModalOpen(true)}
          >
            🔗 Share Selected Ads
          </button>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-2">
           
          <div className="bg-white h-full overflow-auto p-4 md:p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <button
          className="w-fit p-2 flex justify-self-end bg-red-500 hover:bg-red-700 text-white rounded-md transition-all"
          onClick={() => setIsModalOpen(false)}
          // disabled={selectedAds.length === 0}
        >
       close
    
        </button>
            <h2 className="text-lg font-bold mb-4">Share Ads</h2>
          
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            {/* Recipient Input */}
            <div>
              <label className="block text-sm font-medium">Shared With</label>
              <input
                type="text"
                value={recipient}
                required
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter recipient name"
                className="border p-2 rounded w-full"
              />
            </div>

            {/* Duration & Forever Checkbox */}
            <div className="flex flex-col mt-4">
              <label className="block text-sm font-medium">Duration</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={duration}
                  disabled={forever}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="border p-2 rounded w-16 disabled:bg-gray-200"
                />
                <select
                  value={expiryUnit}
                  disabled={forever}
                  onChange={(e) => setExpiryUnit(e.target.value)}
                  className="border p-2 rounded disabled:bg-gray-200"
                >
                  <option value="days">Days</option>
                  <option value="hours">Hours</option>
                </select>
              </div>
            </div>

            {/* Forever Checkbox */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={forever}
                onChange={() => setForever(!forever)}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">Make link forever</label>
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
                      // src= { ad?.image?`data:image/png;base64,${ad?.image}`:"/placeholder.png"}
                      src={
                        ad?.image
                          ? `data:image/png;base64,${ad?.image}`
                          : `https://placehold.co/600x400.png?text=${ad.name}`
                      }
                      alt={ad.name}
                      
                      className="w-12 h-12 rounded"
                    />
                  </td>
                  <td className="p-2">{ad.name}</td>
                  <td className="p-2">{ad.city}</td>
                  <td className="p-2">${ad?.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

            {/* Share Link Section */}
            {sharedlink && (
              <div className="mt-4 flex items-center space-x-3 bg-gray-100 p-3 rounded-lg">
                <input
                  type="text"
                  value={sharedlink}
                  readOnly
                  className="w-full bg-transparent text-gray-700 outline-none"
                />
                <button
                  onClick={() => copyToClipboard(`http://localhost:3000/${sharedlink}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-950 flex items-center"
                >
                  {copied ? <FiCheck className="mr-2" /> : <FiCopy className="mr-2" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 w-full bg-gray-400 text-white rounded">
                Cancel
              </button>
              <button onClick={handleShare}  className="px-4 py-2 w-full bg-purple-600 text-white rounded" disabled={loading}>
                {loading ? "Sharing..." : "Share"}
              </button>
            </div>

            {/* <SharedLinksTable /> */}
          </div>
        </div>
      )}
    </>
  );
};

export default ShareAdsModal;
