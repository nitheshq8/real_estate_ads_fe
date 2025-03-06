import axios from "axios";
import { LocalStorageData, User } from "./types";
import { error } from "console";
const isProduction = true; // Change to false for development
const API_BASE_URL = isProduction?"http://16.24.17.78/api/user":"http://localhost:8069/api/user"
// const API_BASE_URL = "http://localhost:8069/api/user";

export const apiBaseURL = isProduction
  ? "http://16.24.17.78/api"
  : "http://localhost:80/api";

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
    })

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
  
 return response?.data?.result?.result;
  } catch (error) {
    throw error;
  }
};





export const searchSharedLinkById = async (params:any) => {
 
  try {
    const accessToken = localStorage.getItem("accessToken");
    const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");

    const response = await    axios.post(
        `${apiBaseURL}/real-estate/share/search`,
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
    
 return response?.data?.result?.result;
  } catch (error) {
    throw error;
  }
};

export const searchSharedLink = async (params:any) => {
  
  
  try {
    const accessToken = localStorage.getItem("accessToken");
    const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");

    const response = await    axios.post(
        `${apiBaseURL}/real-estate/share/search`,
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
  
 return response?.data?.result?.result;
  } catch (error) {
    throw error;
  }
};



export const fetchAllCities = async () => {
  try {
    const response = await axios.post(`${apiBaseURL}/real-estate/cities`, {
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
    const response = await axios.post(`${apiBaseURL}/subscriptions/user_subscription_plans`, {
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
    const response = await axios.post(`${apiBaseURL}/real-estate/ads/search`, {
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



  try {
    const response = await axios.post(`${apiBaseURL}/real-estate/ads/trendingByUserID`, {
      jsonrpc: "2.0",
      method: "call",
      params: { user_id:userData.user_id  },
    });

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
    const response = await axios.post(`${apiBaseURL}/real-estate/ads/searchallads`, {
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
    const response = await axios.post(`${apiBaseURL}/real-estate/ads/search`, {
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
      axios.post(`${apiBaseURL}/real-estate/ads/detail`, {
        jsonrpc: "2.0",
        method: "call",
        params: { ad_id: adId, user_id: userData?.user_id },
      }),
      axios.post(`${apiBaseURL}/real-estate/ads/update-visits`, {
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
      axios.post(`${apiBaseURL}/real-estate/ads/detail `, {
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
    const response = await axios.post(`${apiBaseURL}/get_user_data`, {
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
    const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
    if (!userData.user_id) return;
    const response = await axios.post(`${apiBaseURL}/update_user_data`, {
      jsonrpc: "2.0",
      params: updatedData,
    });
    // Adjust this if your API response structure differs.
    return response;
   
  } catch (error) {
    console.error("API Error (Get Profile):", error);
  }
};
export const updateCompanyDetails = async ({updatedData}:any) => {
  try {
    const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
    if (!userData.user_id) return;
    const response = await axios.post(`${apiBaseURL}/company/update`, {
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
    
    const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
    if (!userData.user_id) return;
    const response = await axios.post(`${apiBaseURL}/real-estate/ads/delete`, {
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

    
    if (!userData.user_id) return;
    const response = await axios.post(`${apiBaseURL}/company_detail_ByUserId`, {
      jsonrpc: "2.0",
      params:{user_id: userData.user_id}
    },  );
    // Adjust this if your API response structure differs.
    return response.data;
   
  } catch (error) {
    console.error("API Error (Get Profile):", error);
  }
};



export const getCompanydetailsBytoken = async (params:any) => {
  try {
   const response = await axios.post(`${apiBaseURL}/company/get-details-by-token`, {
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


export const fetchSharedAdsByToken = async (params:any) => {
  try {
    const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");

    
    const response = await axios.post(`${apiBaseURL}/real-estate/shared-linksBytoken`, params);
    return response;
   
  } catch (error) {
    console.error("API Error (Get Profile):", error);
  }
};

export const subscription_plan_details = async () => {
  try {const response = await  axios
    .post(`${apiBaseURL}/subscription_plan_details`,{})
    return response;
   
  } catch (error) {
    console.error("API Error (Get Profile):", error);
  }
};


export const adsdelete = async (params:any) => {
  try {
    const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");

    
    const response = await axios.post(
      `${apiBaseURL}/real-estate/ads/delete`,
      params,
    );return response;
   
  } catch (error) {
    console.error("API Error (Get Profile):", error);
  }
};

export const deleteadsImage = async (params:any) => {
  try {
    const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
    const accessToken = localStorage.getItem("accessToken");
   
    
    const response = await axios.post(
      `${apiBaseURL}/real-estate/ads/delete-image`,
      params,  {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );return response;
   
  } catch (error) {
    console.error("API Error (Get Profile):", error);
  }
};


export const adsaddMultiImage = async (params:any) => {
  try {
    const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");

    
    const response = await axios.post(
      `${apiBaseURL}/real-estate/ads/add-image`,
      params
    );return response;
   
  } catch (error) {
    console.error("API Error (Get Profile):", error);
  }
};
export const adsUpdate = async (params:any) => {
  try {
    const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");

    
    const accessToken = localStorage.getItem("accessToken");
    // For editing, the endpoint might be an update endpoint
    const response = await axios.post(
     `${apiBaseURL}/real-estate/ads/update`,
      params,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    
    return response;
   
  } catch (error) {
    console.error("API Error (Get Profile):", error);
  }
};




export const fetchMyPaymentHistory = async (params:any) => {
  try {
    const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");

    
    const accessToken = localStorage.getItem("accessToken");
    // For editing, the endpoint might be an update endpoint
    const response = await axios.post(
      `${apiBaseURL}/payment/getPaymentByUserId`,
      params,
     
    );
    
    
    return response;
   
  } catch (error) {
    console.error("API Error (Get Profile):", error);
  }
};



export const createandUpdatesAds = async (params:any,isEditMode:boolean) => {
  const url = isEditMode
  ? `${apiBaseURL}/real-estate/ads/update`
  : `${apiBaseURL}/real-estate/ads/create`;
  const accessToken = localStorage.getItem("accessToken");
  const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
 
  try {
    const response = await axios.post(
      url,
      params,
      
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Send access token
        },
      }
    );

    
    
    return response;
   
  } catch (error) {
    console.error("API Error (Get Profile):", error);
  }
};
export const createPayment = async (params:any) => {
  try {
    const response = await axios.post(
      `${apiBaseURL}/payment/doPayment`,
      params,
    );
    
    return response;
   
  } catch (error) {
    console.error("API Error (Get Profile):", error);
  }
};