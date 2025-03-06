"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { createPayment } from "@/services/api";

export default function PaymentPage({plan,price}:any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const plan = searchParams.get("plan") || "custom";
  const totalParam = searchParams.get("price") || "50000";
  // const [total] = useState<number>(parseInt(price, 10) || 50000);
  const [total] = useState<number>(price);
  // Form state for additional details
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card"); // default method
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Assuming you have a way to retrieve the current user's ID.
  // For this example, we use a stored value from localStorage.
  const storedUserId = localStorage.getItem("userId") || "1"; // Default to "1" if not set

  const handlePay = async () => {
    setLoading(true);
    setError("");

  const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
    try {
      // Call the payment API endpoint
      const response:any = await createPayment({params: {
            plan: plan,
            amount: total,
            method: paymentMethod,
            user_id:userData.user_id,
            phone: phone,
            email: email,
            name: name,
          },
      });
      console.log("response----",response);
      
      if (response.data?.result?.success) {
        // Redirect to a confirmation page on successful payment
        router.push("/subscription/payment-succes");
      } else {
        setError( "Payment failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError("An error occurred during payment processing.");
    }
    setLoading(false);
  };

  const handleEmpty = () => {
    // Clear the fields or navigate back to the subscription plan page
    setPhone("");
    setName("");
    setEmail("");
    router.push("/subscription");
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded shadow-sm bg-white">
      <h1 className="text-xl font-bold mb-4">Payment Page</h1>

      {/* Display plan & total */}
      <div className="mb-4 text-lg font-semibold">
        <p>Plan: {plan}</p>
        <p>Total: KD {total.toLocaleString()}</p>
      </div>

      {/* Phone */}
      <label htmlFor="phone" className="block mb-1 font-medium">
        Phone Number (optional)
      </label>
      <input
        id="phone"
        type="text"
        placeholder="Enter phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="mb-4 w-full border border-gray-300 p-2 rounded"
      />

      {/* Name */}
      <label htmlFor="name" className="block mb-1 font-medium">
        Name (optional)
      </label>
      <input
        id="name"
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 w-full border border-gray-300 p-2 rounded"
      />

      {/* Email */}
      <label htmlFor="email" className="block mb-1 font-medium">
        Email (optional)
      </label>
      <input
        id="email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 w-full border border-gray-300 p-2 rounded"
      />

      {/* Payment Method */}
      <div className="mb-4">
        <p className="font-medium mb-2">Payment Method</p>
        <div className="flex items-center mb-2">
          <input
            id="card"
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === "card"}
            onChange={() => setPaymentMethod("card")}
            className="mr-2"
          />
          <label htmlFor="card" className="cursor-pointer">
            Card
          </label>
        </div>
        <div className="flex items-center mb-2">
          <input
            id="knet"
            type="radio"
            name="paymentMethod"
            value="knet"
            checked={paymentMethod === "knet"}
            onChange={() => setPaymentMethod("knet")}
            className="mr-2"
          />
          <label htmlFor="knet" className="cursor-pointer">
            Knet
          </label>
        </div>
        <div className="flex items-center mb-2">
          <input
            id="applePay"
            type="radio"
            name="paymentMethod"
            value="applePay"
            checked={paymentMethod === "applePay"}
            onChange={() => setPaymentMethod("applePay")}
            className="mr-2"
          />
          <label htmlFor="applePay" className="cursor-pointer">
            Apple Pay
          </label>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={handleEmpty}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Change Plan
        </button>
        <button
          type="button"
          onClick={handlePay}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Processing..." : "Proceed to Pay"}
        </button>
      </div>
    </div>
  );
}
