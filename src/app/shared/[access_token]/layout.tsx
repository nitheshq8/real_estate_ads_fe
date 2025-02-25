"use client";
import {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useCallback,
  useEffect,
  useState,
} from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import UserMenu from "@/hooks/UserMenu";
import {  getCompanydetailsBytoken } from "@/services/api";
import UserAvatar from "@/hooks/UserAvatar";
// import Footer from "../Footer";
const navItems = [
  { name: "Home", url: "/" },
  { name: "About Us", url: "/ads/about-us" },
  { name: "Contact Us", url: "/ads/contact-us" },
  { name: "Services", url: "/ads/services" },
];

const MYLayout = ({
  children,
  properties,
  cities,

  selectedAds,
  isdetailpage,
  handleAdChange,
}: {
  children: ReactNode;
  properties?: any;
  cities?: any;
  selectedAds?: any;
  isdetailpage?: boolean;
  handleAdChange: any;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [companydata, setCompanyData] = useState({ name: "A" });
  const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
  const { access_token } = useParams();
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

  useEffect(() => {
    // if (!isFetched.current) {
      getCompanyDetails();
    //   isFetched.current = true;
    // }
  }, [getCompanyDetails]);

  return (
    <div className="relative flex flex-col h-screen ">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-around items-center fixed top-0 w-full z-50">
        <div className="flex items-center">
          
            <div
      className="flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden"
      style={{ width: '50px', height: '50px' }}
    >
      
        <img
          src={companydata?.logo}
          alt={companydata?.name}
          className="object-cover w-full h-full"
        />
     
    </div>
          <h1 className="text-xl font-bold ml-2">{companydata?.name}</h1>
        </div>
       
        {/* Desktop View (Hidden on Mobile) */}
        <div className="hidden md:flex items-center  min-w-fit justify-between">
         
          <UserMenu userData={userData} />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-2xl"
        >
          <FiMenu />
        </button>
      </header>

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1 mt-16">
        {/* Sidebar (Menu) */}
        <aside className="w-1/5 bg-white shadow-lg p-4 border-r fixed left-0 top-24 h-screen overflow-y-auto">
          <nav className="space-y-4">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.url}
                className="block p-2 rounded-lg hover:bg-gray-200"
              >
                {item.name}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6  ml-[20%]  overflow-y-auto">
          {children}
        </main>

      
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
       
        {/* Main Content */}
        <main className="p-6 relative">{children}</main>
        {/* Left-side Menu Drawer */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
            <div className="w-2/3 bg-white p-6 shadow-lg h-full">
              <button
                onClick={() => setMenuOpen(false)}
                className="text-2xl absolute top-4 ml-[50%]"
              >
                <IoMdClose />
              </button>
              <nav className="mt-8 space-y-4">
                <UserMenu userData={userData} />
                {navItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    className="block p-2 rounded-lg hover:bg-gray-200"
                  >
                    {item.name}
                  </a>
                ))}

              </nav>
            </div>
          </div>
        )}
      </div>
      {/* <header className="bg-white shadow-md p-4 flex justify-around items-center w-full z-50">
      {/* <Footer/> */}
      {/* </header> */}
      <footer className="bg-white  z-40">
        {/* <Footer/> */}
        <footer className="bg-gray-800 text-white py-6">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex justify-between items-center">
             

              <div className="space-y-4">
                {navItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    className="hover:underline p-1"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div>
                <p>
                  &copy; {new Date().getFullYear()} Your Company. All rights
                  reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </footer>
    </div>
  );
};

export default MYLayout;

// "use client";
// import { ReactNode, useState } from "react";
// import { FiMenu } from "react-icons/fi";
// import { IoMdClose } from "react-icons/io";
// import Image from "next/image";
// import TrendingProperties from "./TrendingProperties";
// import PropertyTypeModal from "../PropertyType/PropertyTypeModal";
// import CreateAdModal from "./CreateAdModal";
// import SharedLinksTable from "./SharedLinksTable";

// const MYLayout = ({ children, properties, cities }: { children: ReactNode; properties: any; cities: any }) => {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <div className="relative flex flex-col h-screen">
//       {/* Fixed Header */}
//       <header className="bg-white shadow-md p-4 flex justify-between items-center fixed top-0 w-full z-50">
//         <div className="flex items-center">
//           <Image src="/logo.png" alt="Logo" width={40} height={40} />
//           <h1 className="text-xl font-bold ml-2">Luxury Estates</h1>
//         </div>

//         {/* Desktop View Actions */}
//         <div className="hidden md:flex items-center space-x-4">
//           <input type="text" placeholder="Search properties" className="border p-2 rounded-full w-64" />
//           <PropertyTypeModal />
//           <SharedLinksTable />
//           <CreateAdModal cities={cities} />
//         </div>

//         {/* Mobile Menu Button */}
//         <button onClick={() => setMenuOpen(true)} className="md:hidden text-2xl">
//           <FiMenu />
//         </button>
//       </header>

//       {/* Main Layout */}
//       <div className="flex flex-1 mt-16">
//         {/* Sidebar (Menu) - Fixed Left Panel */}
//         <aside className="w-1/4 bg-white shadow-lg p-4 border-r fixed left-0 top-16 h-screen overflow-y-auto">
//           <nav className="space-y-4">
//             {["Home", "About Us", "Contact Us", "Services", "FAQ"].map((item, index) => (
//               <a key={index} href="#" className="block p-2 rounded-lg hover:bg-gray-200">
//                 {item}
//               </a>
//             ))}
//           </nav>
//         </aside>

//         {/* Main Content - Scrollable */}
//         <main className="flex-1 p-6 ml-[25%] overflow-y-auto">{children}</main>

//         {/* Right Sidebar (Trending Properties) - Scrollable */}
//         <aside className="w-1/4 bg-gray-100 p-4 fixed right-0 top-16 h-screen overflow-y-auto">
//           <h2 className="text-lg font-bold">Trending Properties</h2>
//           <TrendingProperties properties={properties} />
//         </aside>
//       </div>

//       {/* Mobile Menu Drawer */}
//       {menuOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
//           <div className="w-2/3 bg-white p-6 shadow-lg h-full">
//             <button onClick={() => setMenuOpen(false)} className="text-2xl absolute top-4 right-4">
//               <IoMdClose />
//             </button>
//             <nav className="mt-8 space-y-4">
//               {["Home", "About Us", "Contact Us", "Services", "FAQ"].map((item, index) => (
//                 <a key={index} href="#" className="block p-2 rounded-lg hover:bg-gray-200">
//                   {item}
//                 </a>
//               ))}
//               <CreateAdModal cities={cities} />
//               <SharedLinksTable />
//               <PropertyTypeModal />
//             </nav>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MYLayout;
