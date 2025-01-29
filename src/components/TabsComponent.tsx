"use client";
import React, { useState } from "react";

const TabsComponent = () => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Tab Navigation */}
      <div className="border-b flex">
        {["description", "images", "shareHistory"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-6 font-semibold text-lg transition ${
              activeTab === tab
                ? "border-b-4 border-purple-600 text-purple-600"
                : "text-gray-600"
            }`}
          >
            {tab === "description" ? "Description" : tab === "images" ? "Images" : "Share History"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "description" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Property Description</h2>
            <p className="text-gray-600 mt-2">Provide a detailed description of the property.</p>
          </div>
        )}

        {activeTab === "images" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Upload Images</h2>
            <input type="file" className="mt-2 p-2 border rounded-lg w-full" />
          </div>
        )}

        {activeTab === "shareHistory" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Share History</h2>
            <table className="w-full border-collapse border mt-2">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Shared With</th>
                  <th className="border px-4 py-2">Created On</th>
                  <th className="border px-4 py-2">Expires On</th>
                  <th className="border px-4 py-2">Visit Count</th>
                  <th className="border px-4 py-2">Share URL</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border">
                  <td className="border px-4 py-2">John Doe</td>
                  <td className="border px-4 py-2">2024-02-01</td>
                  <td className="border px-4 py-2">2024-05-01</td>
                  <td className="border px-4 py-2">10</td>
                  <td className="border px-4 py-2 text-blue-500 underline cursor-pointer">Copy Link</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabsComponent;
