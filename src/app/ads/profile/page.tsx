

"use client";

import UserAvatar from "@/hooks/UserAvatar";
import { fetchMyProfile, updateMyProfile } from "@/services/api";
import axios from "axios";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  // Profile data state (fetched from API)
  const [user, setUser] = useState<any>(null);
  // Toggle for editing mode
  const [isEditing, setIsEditing] = useState(false);
  // State to hold the preview base64 image (with Data URL format)
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // State for new password input
  const [newPassword, setNewPassword] = useState("");

  const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
 const fetchProfile = async () => {
    try {
      const response =await fetchMyProfile()
     setUser(response.user?.[0]);
    } catch (error) {
      console.error("API Error (Get Profile):", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handling changes in the text inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handling avatar image file change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // reader.result is a Data URL string like "data:image/png;base64,....."
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit the edited data to update the profile via API.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Get user_id from localStorage (or from user state)
      const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");

      // Build the updated profile data.
      // The update API expects keys: user_id, name, email, phone, address, password, and optionally image.
      const updatedData: any = {
        user_id: userData.user_id, // must be present
        name: user?.name,
        email: user?.email,
        // phone: user?.mobile, // assuming your backend uses 'phone' for mobile
        // address: user?.address || "",
      };

      // Include new password if provided
      if (newPassword) {
        updatedData["password"] = newPassword;
      }

      // If a new image was selected (previewImage is set), then remove any data URL prefix.
      if (previewImage) {
        const base64Indicator = "base64,";
        const idx = previewImage.indexOf(base64Indicator);
        if (idx !== -1) {
          updatedData["image"] = previewImage.substring(idx + base64Indicator.length);
        } else {
          updatedData["image"] = previewImage;
        }
      }

      //   params: updatedData,
      const response = await updateMyProfile({updatedData})
      
      const updatedUser = response?.data?.result;
      if (updatedUser) {
        setUser(updatedUser);
       localStorage.setItem("aiduser", JSON.stringify(updatedUser?.user));
      }setNewPassword("");
      setIsEditing(false);
      fetchProfile()
    } catch (error) {
      console.error("API Error (Update Profile):", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">
        {isEditing ? "Edit Profile" : "Profile"}
      </h1>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="avatar" className="block">
              Avatar
            </label>
            <input
              type="file"
              id="avatar"
              onChange={handleAvatarChange}
              accept="image/*"
              className="w-full p-2 border border-gray-300 rounded"
            />
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <img
                src={`data:image/png;base64,${user?.image_128}`}
                alt="Avatar"
                className="mt-2 w-32 h-32 rounded-full object-cover"
              />
            )}
          </div>

          <div>
            <label htmlFor="name" className="block">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={user?.name || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="email" className="block">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user?.email || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* <div>
            <label htmlFor="phone" className="block">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={user?.mobile || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div> */}

          {/* <div>
            <label htmlFor="address" className="block">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={user?.address || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div> */}

          {/* New Password Field */}
          <div>
            <label htmlFor="password" className="block">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Leave blank to keep current password"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={`data:image/png;base64,${user?.image_128}`}
              alt="Avatar"
              className="w-32 h-32 border-2 rounded-full object-cover"
            />
            <div className="flex">

             <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>

            </div>
              {/* <UserAvatar name={""} imageUrl={`data:image/png;base64,${user?.image_128}|| ""`} size={50} /> */}
          </div>
          <p>
            <strong>Name:</strong> {user?.name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          {/* <p>
            <strong>Phone:</strong> {user?.mobile}
          </p>
          <p>
            <strong>Address:</strong> {user?.address}
          </p> */}
         
        </div>
      )}
    
    </div>
  );
};

export default ProfilePage;
