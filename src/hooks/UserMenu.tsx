"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserAvatar from "./UserAvatar";

export default function UserMenu({ userData, companydata }: any) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
console.log("userData",userData)
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      {userData?.user_id ? (
        <>
          {/* User Avatar - Toggle Menu */}

          <div className="flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <div
                className="flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden"
                style={{ width: "50px", height: "50px" }}
              >
                <img
                  src={`data:image/png;base64,${companydata?.logo}`}
                  // src={companydata?.logo}
                  alt={companydata?.name}
                  className="object-cover w-full h-full"
                />
              </div>
            </button>
            <h1 className="text-xl font-bold ml-2">{companydata?.name}</h1>
          </div>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg"
            >
              <button
                onClick={() => router.push("/ads/profile")}
                className="block w-full text-left p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {/* <UserAvatar
                  name={userData.name}
                  imageUrl={userData.imageUrl || ""}
                  size={50}
                /> */}
               
              Profile
              </button>
            </div>
          )}
        </>
      ) : (
        // Show Login Button If Not Logged In
        <button
          onClick={() => router.push("/login")}
          className="block p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-950"
        >
          LOGIN
        </button>
      )}
    </div>
  );
}

// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import UserAvatar from "./UserAvatar";

// export default function UserMenu({ userData }: { userData: any }) {
//   const [isMobile, setIsMobile] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const router = useRouter();

//   // Detect screen size for mobile view
//   useEffect(() => {
//     const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
//     checkScreenSize();
//     window.addEventListener("resize", checkScreenSize);
//     return () => window.removeEventListener("resize", checkScreenSize);
//   }, []);

//   return (
//     <div className="relative">
//       {userData?.user_id ? (
//         <>
//           {/* Desktop View - Avatar with Dropdown */}
//           {!isMobile ? (
//             <button onClick={() => setMenuOpen(!menuOpen)}>
//               <UserAvatar name={userData.name} imageUrl={userData.imageUrl || ""} size={50} />
//             </button>
//           ) : null}

//           {/* Menu Items */}
//           {(isMobile || menuOpen) && (
//             <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg md:mt-0 md:relative md:w-auto md:bg-transparent md:shadow-none">
//               <button
//                 onClick={() => router.push("/profile")}
//                 className="block w-full text-left p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
//               >
//                 Profile
//               </button>
//               <button
//                 onClick={() => router.push("/admin")}
//                 className="block w-full text-left p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
//               >
//                 Admin Page
//               </button>
//             </div>
//           )}
//         </>
//       ) : (
//         // Show Login Button If Not Logged In
//         <button
//           onClick={() => router.push("/login")}
//           className="block p-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
//         >
//           LOGIN
//         </button>
//       )}
//     </div>
//   );
// }
