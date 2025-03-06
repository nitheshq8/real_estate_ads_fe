// "use client";
// import { useCallback, useEffect, useState } from "react";
// import { fetchMyProfile, updateMyProfile, updateCompanyDetails, getCompanydetails } from "@/services/api";

// const ProfilePage = () => {
//   // State for user profile
//   const [user, setUser] = useState<any>(null);
//   // State for company details
//   const [companyData, setCompanyData] = useState<any>(null);
//   // Toggle editing mode
//   const [isEditing, setIsEditing] = useState(false);
//   // Preview image for user avatar
//   const [previewUserImage, setPreviewUserImage] = useState<string | null>(null);
//   // Preview image for company logo
//   const [previewCompanyLogo, setPreviewCompanyLogo] = useState<string | null>(null);
//   // State for new password input
//   const [newPassword, setNewPassword] = useState("");

//   // Fetch user profile data
//   const fetchProfile = async () => {
//     try {
//       const response = await fetchMyProfile();
//       const fetchedUser = response.user?.[0];
//       setUser(fetchedUser);
//     } catch (error) {
//       console.error("API Error (Get Profile):", error);
//     }
//   };

//   // Use the provided code snippet to fetch company details
//   const fetchcompanydetails = useCallback(async () => {
//     try {
//       const response = await getCompanydetails("");
//       setCompanyData(response.result);
//     } catch (error) {
//       console.error("API Error (Get Company Details):", error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchProfile();
//     fetchcompanydetails();
//   }, [fetchcompanydetails]);

//   // Handle changes for user fields
//   const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setUser((prev: any) => ({ ...prev, [name]: value }));
//   };

//   // Handle changes for company fields
//   const handleCompanyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setCompanyData((prev: any) => ({ ...prev, [name]: value }));
//   };

//   // Handle user avatar file change
//   const handleUserAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewUserImage(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle company logo file change
//   const handleCompanyLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewCompanyLogo(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle form submission to update both user and company details
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       // Get user_id from localStorage
//       const storedUser = JSON.parse(localStorage.getItem("aiduser") || "{}");

//       // Build updated data for user
//       const updatedUserData: any = {
//         user_id: storedUser.user_id,
//         name: user?.name,
//         email: user?.email,
//       };

//       if (newPassword) {
//         updatedUserData["password"] = newPassword;
//       }

//       if (previewUserImage) {
//         const base64Indicator = "base64,";
//         const idx = previewUserImage.indexOf(base64Indicator);
//         updatedUserData["image"] =
//           idx !== -1 ? previewUserImage.substring(idx + base64Indicator.length) : previewUserImage;
//       }

//       // Update user profile via API
//       const userResponse = await updateMyProfile({ updatedData: updatedUserData });
//       const updatedUser = userResponse?.data?.result;
//       if (updatedUser) {
//         setUser(updatedUser);
//         localStorage.setItem("aiduser", JSON.stringify(updatedUser.user));
//       }
//       setNewPassword("");

//       // Build updated data for company
//       if (companyData && companyData.id) {
//         const updatedCompanyData: any = {
//           company_id: companyData.id,
//           name: companyData.name,
//           phone: companyData.phone,
//           email: companyData.email,
//           website: companyData.website,
//         };

//         if (previewCompanyLogo) {
//           const base64Indicator = "base64,";
//           const idx = previewCompanyLogo.indexOf(base64Indicator);
//           updatedCompanyData["logo"] =
//             idx !== -1 ? previewCompanyLogo.substring(idx + base64Indicator.length) : previewCompanyLogo;
//         }

//         // Update company details via API
//         const companyResponse :any= await updateCompanyDetails({ updatedData: updatedCompanyData });
//         if (companyResponse.success) {
//           setCompanyData(companyResponse.data);
//         }
//       }

//       setIsEditing(false);
//       // Refresh data
//       fetchProfile();
//       fetchcompanydetails();
//     } catch (error) {
//       console.error("API Error (Update Profile & Company):", error);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-4">
//         {isEditing ? "Edit Profile & Company" : "Profile"}
//       </h1>

//       {isEditing ? (
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <h2 className="text-2xl font-semibold">User Details</h2>
//           <div>
//             <label htmlFor="avatar" className="block">
//               Avatar
//             </label>
//             <input
//               type="file"
//               id="avatar"
//               onChange={handleUserAvatarChange}
//               accept="image/*"
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//             {previewUserImage ? (
//               <img
//                 src={previewUserImage}
//                 alt="Preview"
//                 className="mt-2 w-32 h-32 rounded-full object-cover"
//               />
//             ) : (
//               <img
//                 src={`data:image/png;base64,${user?.image_128}`}
//                 alt="Avatar"
//                 className="mt-2 w-32 h-32 rounded-full object-cover"
//               />
//             )}
//           </div>
//           <div>
//             <label htmlFor="name" className="block">
//               Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={user?.name || ""}
//               onChange={handleUserInputChange}
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//           </div>
//           <div>
//             <label htmlFor="email" className="block">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={user?.email || ""}
//               onChange={handleUserInputChange}
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//           </div>
//           <div>
//             <label htmlFor="password" className="block">
//               New Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded"
//               placeholder="Leave blank to keep current password"
//             />
//           </div>

//           <hr className="my-6" />

//           <h2 className="text-2xl font-semibold">Company Details</h2>
//           <div>
//             <label htmlFor="company_logo" className="block">
//               Company Logo
//             </label>
//             <input
//               type="file"
//               id="company_logo"
//               onChange={handleCompanyLogoChange}
//               accept="image/*"
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//             {previewCompanyLogo ? (
//               <img
//                 src={previewCompanyLogo}
//                 // src={`data:image/png;base64,${previewCompanyLogo}`}
//                 alt="Company Logo Preview"
//                 className="mt-2 w-32 h-32 object-cover"
//               />
//             ) : (
//               companyData?.logo && (
//                 <img
//                   src={`data:image/png;base64,${companyData.logo}`}
//                   alt="Company Logo"
//                   className="mt-2 w-32 h-32 object-cover"
//                 />
//               )
//             )}
//           </div>
//           <div>
//             <label htmlFor="company_name" className="block">
//               Company Name
//             </label>
//             <input
//               type="text"
//               id="company_name"
//               name="name"
//               value={companyData?.name || ""}
//               onChange={handleCompanyInputChange}
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//           </div>
//           <div>
//             <label htmlFor="company_phone" className="block">
//               Company Phone
//             </label>
//             <input
//               type="text"
//               id="company_phone"
//               name="phone"
//               value={companyData?.phone || ""}
//               onChange={handleCompanyInputChange}
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//           </div>
//           <div>
//             <label htmlFor="company_email" className="block">
//               Company Email
//             </label>
//             <input
//               type="email"
//               id="company_email"
//               name="email"
//               value={companyData?.email || ""}
//               onChange={handleCompanyInputChange}
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//           </div>
//           <div>
//             <label htmlFor="company_website" className="block">
//               Company Website
//             </label>
//             <input
//               type="text"
//               id="company_website"
//               name="website"
//               value={companyData?.website || ""}
//               onChange={handleCompanyInputChange}
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//           </div>

//           <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//             Save Changes
//           </button>
//         </form>
//       ) : (
//         <div className="space-y-6">
//           <div className="flex items-center space-x-4">
//             <img
//               src={`data:image/png;base64,${user?.image_128}`}
//               alt="Avatar"
//               className="w-32 h-32 border-2 rounded-full object-cover"
//             />
//             <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
//               Edit Profile & Company
//             </button>
//           </div>
//           <div>
//             <p>
//               <strong>Name:</strong> {user?.name}
//             </p>
//             <p>
//               <strong>Email:</strong> {user?.email}
//             </p>
//           </div>
//           {companyData && (
//             <div className="mt-6">
//               <h2 className="text-2xl font-semibold">Company Details</h2>
//               <p>
//                 <strong>Name:</strong> {companyData.name}
//               </p>
//               <p>
//                 <strong>Phone:</strong> {companyData.phone}
//               </p>
//               <p>
//                 <strong>Email:</strong> {companyData.email}
//               </p>
//               <p>
//                 <strong>Website:</strong> {companyData.website}
//               </p>
//               {companyData.logo && (
//                 <img
//                   src={`data:image/png;base64,${companyData.logo}`}
//                   alt="Company Logo"
//                   className="w-32 h-32 mt-2 object-cover"
//                 />
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;

import React from 'react'

function page() {
  return (
    <div>page</div>
  )
}

export default page