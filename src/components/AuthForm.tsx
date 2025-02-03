"use client";

import React, { useState } from "react";
import InputField from "./InputField";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/services/api";
import { Eye, EyeOff } from "lucide-react"; // Icon for password toggle

const AuthForm: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const toggleForm = () => setIsRegister(!isRegister);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response:any= isRegister
        ? await registerUser(formData)
        : await loginUser(formData);
      if (response?.success) {
        alert(isRegister ? "Account created! successful " : "Login successful!");
        // router.push("/");
      } else {
        alert(response || "Something went wrong. Please try again.");
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
          {isRegister ? "Create an Account" : "Welcome Back"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
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
        <p className="text-center mt-4 text-gray-600">
          {isRegister ? "Already have an account?" : "New user?"}{" "}
          <button onClick={toggleForm} className="text-blue-500 underline">
            {isRegister ? "Login here" : "Register here"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
