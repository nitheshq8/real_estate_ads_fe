import axios from "axios";
import { LocalStorageData, User } from "./types";
import { error } from "console";
const isProduction = false; // Change to false for development
const API_BASE_URL = "http://localhost:8069/api/user";

export const apiBaseURL = isProduction
  ? "http://localhost:8069/api"
  : "http://localhost:8069/api";

export const imgBaseURL = isProduction
  ? "https://portal.abwabalkhair.com"
  : "https://sobel.flatah.com";

const apiInstance = axios.create({
  baseURL: apiBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // Add this line to enable sending cookies with requests
});

// Interceptor to add access token to request headers
apiInstance.interceptors.request.use(
  (config) => {
    const localStorageData = getLocalStorageData();
    if (localStorageData && localStorageData.accessToken) {
      config.headers[
        "Authorization"
      ] = `Bearer ${localStorageData.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to get data from local storage
export const getLocalStorageData = (): LocalStorageData | null => {
  const accessToken = localStorage.getItem("accessToken");
  const userString = localStorage.getItem("aiduser");

  if (accessToken && userString) {
    try {
      const user: User = JSON.parse(userString);
      return { accessToken, user };
    } catch (error) {
      console.error("Error parsing user data from local storage", error);
      removeLocalStorageData();
      return null;
    }
  }

  return null;
};

// Function to set data in local storage
export const setLocalStorageData = (data: LocalStorageData): void => {
  console.log("++++++++locl", data);
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("aiduser", JSON.stringify(data.user));
};

// Function to remove data from local storage
export const removeLocalStorageData = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("aiduser");
};

export const registerUser = async (data: {
  email?: string;
  password?: string;
  name?: string;
  role?:string
}) => {
  try {
    const response = await apiInstance.post("/user/register", {
      jsonrpc: "2.0",
      method: "call",
      params: data,
    });
console.log("response.data.result.success",response.data.result);

    if (response.data.result.success) {
      const userData: any = response?.data?.result?.data;

      setLocalStorageData({
        accessToken: response.data.result.data?.api_key,
        user: userData,
      });
    }

    return response?.data?.result;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const response = await apiInstance.post("/user/login", {
      jsonrpc: "2.0",
      method: "call",
      params: data,
    });
console.log("--------",response.data.result?.error);

    if (response.data.result.success) {
      const userData: User = response?.data?.result?.data;
      setLocalStorageData({
        accessToken: response?.data?.result?.data?.api_key,
        user: userData,
      });

      return { success: true, user: response?.data };
    } else {
      return { success: false, error: response.data.result.error };
    }

    // Return user data for setting context
  } catch (error) {
    throw error;
  }
};
export const forgotPassword = async (email: string) => {
  const response= await axios.post(`${API_BASE_URL}/forgot-password`, {
    jsonrpc: "2.0",
    method: "call",
    params: { email },
  });
  
  if (response.data.result.success) {
    console.log("_____________",response);
    return response.data.result
  } else {
    return { success: false, error: response.data.result.error };
  }
};

export const resetPassword = async (email: string, old_password:string,new_password: string,) => {
  const response= await axios.post(`${API_BASE_URL}/reset-password`, {
    jsonrpc: "2.0",
    method: "call",
    params: { email,old_password, new_password },
  });
  
  console.log("========0",response.data?.result?.result);
  if (response.data?.result?.result.success) {
    return response.data?.result?.result
  } else {
    return { success: false, error: response.data.result.error };
  }
};
export const fetchUserProfile = async () => {
  return apiInstance.post("/user/profile");
};

export const changeUserPassword = async (data: {
  old_password: string;
  new_password: string;
  confirm_password: string;
}) => {
  try {
    const response = await apiInstance.post("/user/change_password", {
      jsonrpc: "2.0",
      method: "call",
      params: data,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

// http://localhost:8069/api/real-estate/ads/search
export const fetchRealEstateAds = async (data: any) => {
  return apiInstance.post("/real-estate/ads/search", {
    limit: 10,
    offset: 0,
    property_type: "",
    city: "",
    reason: "",
    price_min: "",
    price_max: "",
  });
};


export const createShrareLink = async (params: any) => {
  console.log("params",params);
  
  const accessToken = localStorage.getItem("accessToken");
    const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");

    const response = await apiInstance.post("/real-estate/createshareLink", {
      jsonrpc: "2.0",
      method: "call",
      params: {...params,
        user_id: userData.user_id,
      },
    },
      {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Send access token
          },
        }
  );
 return response;
 
};


export const getAllSharedLink = async () => {
  console.log("params");
  
  try {
    const accessToken = localStorage.getItem("accessToken");
    const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");

    const response = await apiInstance.post("/real-estate/shared-links", {
      jsonrpc: "2.0",
      method: "call",
      
    },
      {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Send access token
          },
        }
  );
  console.log("response?.data?.result++",response?.data?.result?.result);
  
 return response?.data?.result?.result;
  } catch (error) {
    throw error;
  }
};





export const searchSharedLinkById = async (params:any) => {
  console.log("params");
  
  try {
    const accessToken = localStorage.getItem("accessToken");
    const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");

    const response = await    axios.post(
        "http://localhost:8069/api/real-estate/share/search",
        {
          jsonrpc: "2.0",
          method: "call",
          params:{...params,userId:userData.user_id,}
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response?.data?.result++",response?.data?.result?.result);
  
 return response?.data?.result?.result;
  } catch (error) {
    throw error;
  }
};

export const searchSharedLink = async (params:any) => {
  console.log("params");
  
  try {
    const accessToken = localStorage.getItem("accessToken");
    const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");

    const response = await    axios.post(
        "http://localhost:8069/api/real-estate/share/search",
        {
          jsonrpc: "2.0",
          method: "call",
          params:{...params}
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    
    
  //   apiInstance.post("/api/real-estate/share/search", {
  //     jsonrpc: "2.0",
  //     method: "call",
  //     params:{...params}
      
  //   },
      
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${accessToken}`, // Send access token
  //         }
  //       }
  // );


//   const response = await apiInstance.post("/real-estate/createshareLink", {
//     jsonrpc: "2.0",
//     method: "call",
//     params: {...params,
//       user_id: userData.user_id,
//     },
//   },
//     {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`, // Send access token
//         },
//       }
// );
  console.log("response?.data?.result++",response?.data?.result?.result);
  
 return response?.data?.result?.result;
  } catch (error) {
    throw error;
  }
};



export const fetchAllCities = async () => {
  try {
    const response = await axios.post("http://localhost:8069/api/real-estate/cities", {
      jsonrpc: "2.0",
      method: "call",
      params: {},
    });

    if (response.data?.result?.result?.success) {
      return response.data.result.result
    } else {
      throw new Error(response.data?.error?.message || "Failed to fetch cities.");
    }
  } catch (error) {
   return error
  }
};

export const fetchSubscriptionPlanByUserId = async () => {
  const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
  try {
    const response = await axios.post("http://localhost:8069/api/subscriptions/user_subscription_plans", {
      jsonrpc: "2.0",
      method: "call",
      params:{user_id:userData.user_id}
      
    });
    return response
  } catch (error) {
   return error
  }
};

export  const fetchadminProperties = async (page: any, pageSize: number, filters: { property_type: string; city: string; reason: string; price_min: string; price_max: string; }) => {
 
  const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");


  try {
    const response = await axios.post("http://localhost:8069/api/real-estate/ads/search", {
      jsonrpc: "2.0",
      method: "call",
      params: { limit: 10, offset: (page - 1) * pageSize , ...filters,user_id:userData.user_id  },
    });

    if (response.data?.result?.result?.ads) {
      // setProperties(response.data.result.result.ads);
      // setTrendingProperties(response.data.result.result.ads);
      // setTotalItems(response.data.result.result?.total || 0);
      return response.data?.result?.result
    } else {
      throw new Error(response.data?.error?.message || "Failed to fetch properties");
    }
  } catch (error) {
    // setError("Error fetching properties.");
    console.error("API Error (Properties):", error);
  }
};
export  const fetchadmintredningProperties = async () => {
 
  const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");


  console.log("---response--fetchadmintredningProperties00");

  try {
    const response = await axios.post("http://localhost:8069/api/real-estate/ads/trendingByUserID", {
      jsonrpc: "2.0",
      method: "call",
      params: { user_id:userData.user_id  },
    });

    console.log("---response--fetchadmintredningProperties",response);
    
    if (response.data?.result?.result?.data) {
      // setProperties(response.data.result.result.ads);
      // setTrendingProperties(response.data.result.result.ads);
      // setTotalItems(response.data.result.result?.total || 0);
      return response.data?.result?.result
    } else {
      throw new Error(response.data?.error?.message || "Failed to fetch properties");
    }
  } catch (error) {
    // setError("Error fetching properties.");
    console.error("API Error (Properties):", error);
  }
};
export  const fetchAllProperties = async (page: any, pageSize: number, filters: { property_type: string; city: string; reason: string; price_min: string; price_max: string; }) => {
 
  const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");


  try {
    const response = await axios.post("http://localhost:8069/api/real-estate/ads/searchallads", {
      jsonrpc: "2.0",
      method: "call",
      params: { limit: 10, offset: (page - 1) * pageSize , ...filters,  },
    });

    if (response.data?.result?.result?.ads) {
      // setProperties(response.data.result.result.ads);
      // setTrendingProperties(response.data.result.result.ads);
      // setTotalItems(response.data.result.result?.total || 0);
      return response.data?.result?.result
    } else {
      throw new Error(response.data?.error?.message || "Failed to fetch properties");
    }
  } catch (error) {
    // setError("Error fetching properties.");
    console.error("API Error (Properties):", error);
  }
};

export  const fetchPropertiesById = async (params: { user_id: any; property_type: string; city: string; reason: string; price_min: string; price_max: string; limit: number; offset: number; }) => {
  const accessToken = localStorage.getItem("accessToken");
      const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
  
  try {
    const response = await axios.post("http://localhost:8069/api/real-estate/ads/search", {
      jsonrpc: "2.0",
      method: "call",
      params:params,
    });

    if (response.data?.result?.result?.ads) {
      return response.data?.result?.result
    } else {
      throw new Error(response.data?.error?.message || "Failed to fetch properties");
    }
  } catch (error) {
    console.error("API Error (Properties):", error);
  }
};


export const fetchPropertiesDetailsByIdandUpdateView = async (adId: string | string[], userData?: { user_id: any; }) => {
  try {
    const [detailsResponse, visitsResponse] = await Promise.all([
      axios.post("http://localhost:8069/api/real-estate/ads/detail", {
        jsonrpc: "2.0",
        method: "call",
        params: { ad_id: adId, user_id: userData?.user_id },
      }),
      axios.post("http://localhost:8069/api/real-estate/ads/update-visits", {
        jsonrpc: "2.0",
        method: "call",
        params: { ad_id: Number(adId) },
      }),
    ]);

    return {
      details: detailsResponse.data,
      visits: visitsResponse.data,
    };
  } catch (error) {
    console.error("Error in fetchPropertiesById:", error);
    throw error;
  }
};

export const fetchPropertiesDetailsById = async (adId: string | string[], userData?: { user_id: any; }) => {
  try {
    const [detailsResponse, ] = await Promise.all([
      axios.post("http://localhost:8069/api/real-estate/ads/detail", {
        jsonrpc: "2.0",
        method: "call",
        params: { ad_id: adId, user_id: userData?.user_id },
      })
    ]);

    return {
      details: detailsResponse.data,
    };
  } catch (error) {
    console.error("Error in fetchPropertiesById:", error);
    throw error;
  }
};

export const fetchMyProfile = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
    if (!userData.user_id) return;
    const response = await axios.post("http://localhost:8069/api/get_user_data", {
      jsonrpc: "2.0",
      method: "call",
      params: { user_id: userData.user_id },
    });
    // Adjust this if your API response structure differs.
    return response?.data?.result?.result;
   
  } catch (error) {
    console.error("API Error (Get Profile):", error);
  }
};


export const updateMyProfile = async ({updatedData}:any) => {
  try {
    console.log("updatedData",updatedData);
    
    const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
    if (!userData.user_id) return;
    const response = await axios.post("http://localhost:8069/api/update_user_data", {
      jsonrpc: "2.0",
      params: updatedData,
    });
    // Adjust this if your API response structure differs.
    return response;
   
  } catch (error) {
    console.error("API Error (Get Profile):", error);
  }
};



export const deleteAds = async (params:any) => {
  try {
    console.log("updatedData",params);
    
    const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
    if (!userData.user_id) return;
    const response = await axios.post("http://localhost:8069/api/real-estate/ads/delete", {
      jsonrpc: "2.0",
      params: params,
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Use valid access token if necessary
      },
    }
  
  );
    // Adjust this if your API response structure differs.
    return response;
   
  } catch (error) {
    console.error("API Error (Get Profile):", error);
  }
};




export const getCompanydetails = async (params:any) => {
  try {
    const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");

    console.log("getCompanydetails",userData);
    
    if (!userData.user_id) return;
    const response = await axios.post("http://localhost:8069/api/company_detail_ByUserId", {
      jsonrpc: "2.0",
      params:{user_id: userData.user_id}
    },  );
    console.log("getCompanydetails--res",response?.data?.result);
    // Adjust this if your API response structure differs.
    return response.data;
   
  } catch (error) {
    console.error("API Error (Get Profile):", error);
  }
};



export const getCompanydetailsBytoken = async (params:any) => {
  try {
    console.log("getCompanydetails",params);
    
    const response = await axios.post("http://localhost:8069/api/company/get-details-by-token", {
      jsonrpc: "2.0",
      params:params
    }, 
  
  );
    // Adjust this if your API response structure differs.
    return response;
   
  } catch (error) {
    console.error("API Error (Get Profile):", error);
  }
};
