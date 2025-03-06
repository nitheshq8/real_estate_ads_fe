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
import TrendingProperties from "./TrendingProperties";
import PropertyTypeModal from "../PropertyType/PropertyTypeModal";
import CreateAdModal from "./CreateAdModal";
import { useRouter } from "next/navigation";
import SharedLinksTable from "./SharedLinksTable";
import Footer from "../Footer";
import UserMenu from "@/hooks/UserMenu";
import { getCompanydetails } from "@/services/api";
import SubscritionModal from "../Subscription/SubscritionModal";
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
  mysubscriptionPlan
}: {
  children: ReactNode;
  properties?: any;
  cities?: any;
  selectedAds?: any;
  isdetailpage?: boolean;
  handleAdChange: any;
  mysubscriptionPlan?:any
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [companydata, setCompanyData] = useState({ name: "A",logo:'' });
  const [userData,setUserData]= useState<any>('')
  // const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
  
 
  useEffect(() => {
    if (typeof window !== 'undefined') {
     const userData1:any = JSON.parse(localStorage.getItem("aiduser") || "{}");
      setUserData(userData1)
    }
  }, []);
  const fetchcompanydetails = useCallback(async () => {
    const response:any = await getCompanydetails("");
setCompanyData(response?.result);
  
  }, []);

  useEffect(() => {
    // if (!isFetched.current) {
    fetchcompanydetails();
    //   isFetched.current = true;
    // }
  }, [fetchcompanydetails]);

  return (
    <div className="relative flex flex-col h-screen ">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-around items-center fixed top-0 w-full z-50">
        {/* <div className="flex items-center">
        <div
      className="flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden"
      style={{ width: '50px', height: '50px' }}
    >
      
        <img
          src={`data:image/png;base64,${companydata?.logo}`}
          // src={companydata?.logo}
          alt={companydata?.name}
          className="object-cover w-full h-full"
        />
     
    </div>
          <h1 className="text-xl font-bold ml-2">{companydata?.name}</h1>
        </div> */}
        <div className=" m-1 ">

<UserMenu userData={userData} companydata={companydata} />
</div>
        {/* Desktop View (Hidden on Mobile) */}
        <div className="hidden md:flex items-center  min-w-fit justify-between">
         
          <PropertyTypeModal />
          <div className="ml-1 flex">
            <SharedLinksTable />
          </div>
          <div className="ml-1 flex">
            {userData?.is_admin && (
              <CreateAdModal cities={cities} handleAdChange={handleAdChange} 
              
              mysubscriptionPlan={mysubscriptionPlan}
              />
            )}
          
          </div>
        
              <div className=" m-1 ">

              <SubscritionModal/>
              </div>
            
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
        <main className="flex-1 p-6  ml-[20%] mr-[25%] overflow-y-auto">
          {children}
        </main>

        {/* Sidebar (Trending Properties) */}
        {isdetailpage ? (
          ""
        ) : (
          <aside className="w-1/4 bg-gray-100 p-4 fixed right-0 top-24 h-screen overflow-y-auto">
            {/* <h2 className="text-lg font-bold">Trending Properties</h2> */}
            <div className="space-y-4 overflow-y-auto">
              <TrendingProperties properties={properties} />
            </div>
          </aside>
        )}
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {isdetailpage ? (
          ""
        ) : (
          <div className=" mt-24">
            <TrendingProperties properties={properties} />
          </div>
        )}{" "}
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
                <UserMenu userData={userData} companydata={companydata}  />
                {navItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    className="block p-2 rounded-lg hover:bg-gray-200"
                  >
                    {item.name}
                  </a>
                ))}
  <SubscritionModal/>
                <CreateAdModal
                  cities={cities}
                  handleAdChange={handleAdChange}
                  mysubscriptionPlan={mysubscriptionPlan}
                />
                <SharedLinksTable />
                <PropertyTypeModal />
              </nav>
            </div>
          </div>
        )}
      </div>
    
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
