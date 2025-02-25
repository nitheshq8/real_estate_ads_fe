
"use client";

import React, { useState } from "react";
import InputField from "./InputField";
import { useRouter } from "next/navigation";
import { loginUser, registerUser, forgotPassword, resetPassword } from "@/services/api";
import { Eye, EyeOff } from "lucide-react"; // Icons for password toggle

const AuthForm: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false); // Toggle for forgot password
  const [isReset, setIsReset] = useState(false); // Toggle for reset password form
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("user");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
   
  });

  const [forgotEmail, setForgotEmail] = useState(""); // Store email for forgot password
  const [resetData, setResetData] = useState({
    email: "",
    old_password: "",
    new_password: "",
  });

  const router = useRouter();

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setIsForgot(false); // Reset forgot password state
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetData({ ...resetData, [e.target.name]: e.target.value });
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      alert("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const response = await forgotPassword(forgotEmail);
      if (response.success) {
        alert(response.message);
        setIsReset(true); // Show reset password form
        setResetData({ ...resetData, email: forgotEmail }); // Pre-fill email
      } else {
        alert(response.message || "Failed to send reset password email.");
      }
    } catch (error) {
      alert("Error sending reset password request.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetData.email || !resetData.old_password || !resetData.new_password) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response :any= await resetPassword(resetData.email, resetData.old_password, resetData.new_password);
      if (response.success) {
        alert("Password reset successfully! Please login.");
        setIsForgot(false);
        setIsReset(false);
      } else {
        alert(response.message || "Failed to reset password.");
      }
    } catch (error) {
      alert("Error resetting password.");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response:any= isRegister
        ? await registerUser({...formData, 'role':role})
        : await loginUser(formData);
      if (response?.success) {
        alert(isRegister ? "Account created! successful " : "Login successful!");
        router.push("/");
      } else {
        console.log("-response",response);
        
        alert(response?.error ||response.error?.message|| "Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Error: Could not complete the request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-300 to-blue-400">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          {isForgot ? "Forgot Password" : isRegister ? "Create an Account" : "Welcome Back"}
        </h2>

        {isForgot ? (
          isReset ? (
            // **Reset Password Form**
            <form className="space-y-4">
              <InputField
              
                label="Email"
                type="email"
                name="email"
                value={resetData.email}
                onChange={handleResetChange}
                placeholder="Enter your email"
                // disabled
              />
              <InputField
                label="Old Password"
                type="password"
                name="old_password"
                value={resetData.old_password}
                onChange={handleResetChange}
                placeholder="Enter old password"
              />
              <InputField
                label="New Password"
                type="password"
                name="new_password"
                value={resetData.new_password}
                onChange={handleResetChange}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={handleResetPassword}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                {loading ? "Processing..." : "Reset Password"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsForgot(false);
                  setIsReset(false);
                }}
                className="text-blue-500 underline block mt-4 text-center"
              >
                Back to Login
              </button>
            </form>
          ) : (
            // **Forgot Password Form**
            <form className="space-y-4">
              <InputField
                label="Email"
                type="email"
                name="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <button
                type="button"
                onClick={handleForgotPassword}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                {loading ? "Processing..." : "Send Reset Link"}
              </button>
              <button
                type="button"
                onClick={() => setIsForgot(false)}
                className="text-blue-500 underline block mt-4 text-center"
              >
                Back to Login
              </button>
            </form>
          )
        ) : (
          // **Login/Register Form**
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
              
              <InputField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
              
              
              
              <div>
          <label className="block font-semibold mb-1" htmlFor="role">
            Register as:
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div></>
            
              
            )}
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            <div className="relative">
              <InputField
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-[42px] text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition font-semibold"
            >
              {loading ? "Processing..." : isRegister ? "Register" : "Login"}
            </button>
          </form>
        )}

        {!isForgot && (
          <div className="text-center mt-4">
            <button type="button" onClick={() => setIsForgot(true)} className="text-red-500 underline">
              Forgot Password?
            </button>
          </div>
        )}

        {!isForgot && (
          <p className="text-center mt-4 text-gray-600">
            {isRegister ? "Already have an account?" : "New user?"}{" "}
            <button onClick={toggleForm} className="text-blue-500 underline">
              {isRegister ? "Login here" : "Register here"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
