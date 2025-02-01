"use client";
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import TrendingProperties from "./TrendingProperties";
import PropertyTypeModal from "../PropertyType/PropertyTypeModal";
import CreateAdModal from "./CreateAdModal";
import CreateAdModalwithcity from "./CreateAdModalwithcity";

const MYLayout = ({ children }: any) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:8069/api/real-estate/ads/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: { limit: 10, offset: 0, ...{property_type :'',
            reason: '',
            city: ''} } }),
        });

        const result = await response.json();
        if (response.ok) {
          setProperties(result.result.ads);
        } else {
          setError(result.error.message || "Failed to fetch properties");
        }
      } catch (error) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="relative">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <h1 className="text-xl font-bold ml-2">Luxury Estates</h1>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 justify-center">
          <input
            type="text"
            placeholder="Search properties"
            className="border px-4 py-2 rounded-full w-1/3 outline-none"
          />
        </div>

      {/* Desktop View (Hidden on Mobile) */}
      <div className="hidden md:flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search properties"
          className="border p-2 rounded-full w-64"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-full">
          Explore
        </button>
        {/* <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-full">
          List Your Property
        </button> */}
        <PropertyTypeModal/>
        <CreateAdModal/>
        {/* <CreateAdModalwithcity/> */}
      </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(true)} className="md:hidden text-2xl">
          <FiMenu />
        </button>
      </header>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-full">
        {/* Sidebar (Menu) */}
        <aside className="w-1/4 bg-white shadow-lg p-4 border-1">
          <nav className="space-y-4">
            {["Home", "About Us", "Contact Us", "Services", "FAQ"].map((item, index) => (
              <a key={index} href="#" className="block p-2 rounded-lg hover:bg-gray-200">
                {item}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>

        {/* Sidebar (Trending Properties) */}
        <aside className="w-1/4 bg-gray-100 p-4">
          <h2 className="text-lg font-bold">Trending Properties</h2>
          <div className="space-y-4 overflow-y-auto">
           
            <TrendingProperties properties={properties}    />    
              </div>
        </aside>

        
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {/* Trending Properties (Horizontal Scroll) */}
        <div className="overflow-x-auto whitespace-nowrap p-4 bg-gray-100">
          <h2 className="text-lg font-bold mb-2">Trending Properties</h2>
          <div className="flex space-x-4">
            {properties&&properties?.map((item: { name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }, index: Key | null | undefined) => (
              <div key={index} className="inline-block min-w-[200px] p-3 bg-white shadow rounded-lg">
                <p className="font-semibold">{item?.name}</p>
                <p className="text-sm text-gray-500">$2,500,000</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="p-6">{children}</main>

        {/* Left-side Menu Drawer */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
            <div className="w-2/3 bg-white p-6 shadow-lg h-full">
              <button onClick={() => setMenuOpen(false)} className="text-2xl absolute top-4 right-4">
                <IoMdClose />
              </button>
              <nav className="mt-8 space-y-4">
                {["Home", "About Us", "Contact Us", "Services", "FAQ"].map((item, index) => (
                  <a key={index} href="#" className="block p-2 rounded-lg hover:bg-gray-200">
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MYLayout;
