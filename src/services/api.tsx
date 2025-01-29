import axios from "axios";
import {
  LocalStorageData,
  User,
} from "./types";
import { error } from "console";
const isProduction = false; // Change to false for development

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
  const userString = localStorage.getItem("user");

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
  localStorage.setItem("user", JSON.stringify(data.user));
};

// Function to remove data from local storage
export const removeLocalStorageData = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};





export const registerUser = async (data: {
  email?: string;
  password?: string;
}) => {
  try {
    const response = await apiInstance.post("/register", {
      jsonrpc: "2.0",
      method: "call",
      data: data,
    });

    if (response.data.result.success) {
      const userData: any = response.data.result.data;
console.log("userData",response.data.result.data);

      // Store access token and user details in local storage
      setLocalStorageData({
        accessToken: response.data.result.data?.api_key,
        user: userData,
      });
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const response = await apiInstance.post("/user/login", {
      jsonrpc: "2.0",
      method: "call",
      data,
    });
    console.log("response", response);
    const userData: any = response.data.result.data;
    console.log("userData",response.data.result.data?.api_key);
    
    if (response.data.result.success) {
      const userData: User = response.data.result.data.user;

      // Store access token and user details in local storage
      setLocalStorageData({
        accessToken: response.data.result.data?.api_key,
        user: userData,
      });

      return { success: true, user: response.data }
    } else {

      return { success: false, error: response.data.result.error }
    }

    // Return user data for setting context
  } catch (error) {
    throw error;
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

