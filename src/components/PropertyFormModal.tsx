"use client";
import React, { useState } from "react";
import axios from "axios";
import TabsComponent from "./TabsComponent";

const PropertyFormModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    propertyType: "",
    city: "",
    price: "",
    ownerName: "",
    ownerPhone: "",
    videoUrl: "",
  });
  const [activeTab, setActiveTab] = useState("description");
  const [image, setImage] = useState<File | null>(null);

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  // Submit Form Data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();
      Object.keys(formData).forEach((key) => formDataObj.append(key, formData[key as keyof typeof formData]));
      if (image) formDataObj.append("image", image);

      // API Call to Add Property
      await axios.post("/api/property-ads", formDataObj);

      alert("Property added successfully!");
      setFormData({ propertyType: "", city: "", price: "", ownerName: "", ownerPhone: "", videoUrl: "" });
      setImage(null);
      onClose();
    } catch (error) {
      console.error("Error adding property:", error);
      alert("Failed to add property.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <button className="absolute top-2 right-2 text-gray-600 hover:text-red-500" onClick={onClose}>
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Property</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Property Type</label>
              <input type="text" name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-gray-700">City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Price (INR)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-gray-700">Owner Name</label>
              <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
          </div>

          <div>
            <label className="block text-gray-700">Owner Phone</label>
            <input type="text" name="ownerPhone" value={formData.ownerPhone} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-gray-700">Video URL</label>
            <input type="text" name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-gray-700">Upload Image</label>
            <input type="file" onChange={handleImageChange} className="w-full p-2 border rounded-md" />
          </div>

          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition">
            Submit
          </button>
        </form>
        <TabsComponent/>
        
      </div>
      
    </div>
  );
};

export default PropertyFormModal;
