// "use client";
// const usersData  = await axios.post("http://localhost:8069/api/allusers",{
//     headers: {
//       "Content-Type": "application/json",
//     },
//     data:{"name":''},
//   });
//   console.log("usersData.result?.data",usersData);
  
//   setUsers(usersData.data?.result?.data);

  "use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiUser, FiMail, FiPhone, FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
      const usersData  = await axios.post("http://localhost:8069/api/allusers",{
    headers: {
      "Content-Type": "application/json",
    },
    data:{"name":''},
  });
  console.log("usersData.result?.data",usersData);
  
  setUsers(usersData.data?.result?.data);
      } catch (err) {
        setError("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      {/* Back Button */}
      <button
        onClick={() => router.push("/admin")}
        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md w-fit mb-4 hover:bg-blue-950"
      >
        <FiArrowLeft className="mr-2" /> Back to Admin
      </button>

      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      {loading && <p className="text-blue-500">Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && users.length === 0 && (
        <p className="text-gray-600 text-center">No users found.</p>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user: any) => (
            <div key={user.id} className="bg-white shadow-md rounded-lg p-6 flex flex-col space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 text-white p-3 rounded-full">
                  <FiUser size={24} />
                </div>
                <h2 className="text-lg font-semibold">{user.name}</h2>
              </div>

              <div className="flex items-center space-x-2">
                <FiMail className="text-gray-500" />
                <p className="text-gray-700">{user.email}</p>
              </div>

              <div className="flex items-center space-x-2">
                <FiPhone className="text-gray-500" />
                <p className="text-gray-700">{user.phone || "N/A"}</p>
              </div>

              <div className="flex flex-wrap space-x-2">
                {user.role.map((role: string, index: number) => (
                  <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPage;
