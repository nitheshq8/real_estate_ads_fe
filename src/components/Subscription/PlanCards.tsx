"use client";
import React, { useState } from "react";

interface Plan {
  subscription_plan: string;  // e.g. "basic", "advance", "premium"
  name: string;               // e.g. "Basic Plan"
  monthly_price: number;      // e.g. 100
  yearly_price: number;       // e.g. 1000
  yearly_discount?: number;   // e.g. 10 (10% discount)
  max_users: number;
  have_portal: boolean;
  // other fields...
}

interface PlanCardsProps {
  plans: Plan[];
}

export default function PlanCards({ plans }: PlanCardsProps) {
  // Toggle for monthly/yearly billing
  const [isYearly, setIsYearly] = useState(false);

  const handleToggle = () => {
    setIsYearly(!isYearly);
  };

  return (
    <div className="p-4">
      {/* Toggle Button */}
      <div className="flex items-center justify-center mb-6">
        <span className={`mr-3 font-medium ${!isYearly ? "text-blue-600" : "text-gray-600"}`}>
          Monthly
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isYearly}
            onChange={handleToggle}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer
              peer-checked:after:translate-x-full peer-checked:after:border-white
              after:content-[''] after:absolute after:top-0.5 after:left-[2px]
              after:bg-white after:border-gray-300 after:border
              after:rounded-full after:h-5 after:w-5 after:transition-all
              peer-checked:bg-blue-600"
          ></div>
        </label>
        <span className={`ml-3 font-medium ${isYearly ? "text-blue-600" : "text-gray-600"}`}>
          Yearly
        </span>
      </div>

      {/* Cards Container */}
      <div className="flex flex-wrap justify-center gap-6">
        {plans.map((plan) => {
          // Calculate the displayed price
          let displayedPrice = plan.monthly_price;
          if (isYearly) {
            // Apply discount if any
            const discount = plan.yearly_discount || 0;
            displayedPrice = plan.yearly_price * (1 - discount / 100);
          }

          // Determine if it's the "most popular" plan, e.g. "premium"
          const isMostPopular = plan.subscription_plan === "premium";

          return (
            <div
              key={plan.subscription_plan}
              className={`relative w-72 min-h-[320px] border rounded-lg p-6 bg-white shadow-md
                transition-transform duration-200 text-gray-800
                ${isMostPopular ? "bg-gradient-to-r from-purple-400 to-purple-700 text-white" : ""}
              `}
            >
              {isMostPopular && (
                <div className="absolute top-[-10px] right-[-10px] bg-yellow-300 text-black font-bold py-1 px-2 rounded shadow">
                  Most Popular
                </div>
              )}

              <h2 className="text-xl font-bold mb-2 capitalize">{plan.subscription_plan}</h2>
              <p className="mb-2 font-semibold">
                {/* Show monthly or yearly label, plus price */}
                {isYearly ? "Yearly Price:" : "Monthly Price:"} &nbsp;
                <span className="text-lg">
                  ₹{displayedPrice.toLocaleString()}
                </span>
              </p>
              <p className="mb-1">
                <strong>Plan Type:</strong> {plan.name}
              </p>
              <p className="mb-1">
                <strong>Max Users:</strong>{" "}
                {plan.max_users === 0 ? "Unlimited" : plan.max_users}
              </p>
              <p className="mb-2">
                <strong>Portal Sharing:</strong>{" "}
                {plan.have_portal ? "Enabled" : "Disabled"}
              </p>
              {/* If there's a yearly discount, show it when isYearly is true */}
              {isYearly && plan.yearly_discount && plan.yearly_discount > 0 && (
                <p className="text-sm text-green-600 font-medium mb-2">
                  {plan.yearly_discount}% discount applied!
                </p>
              )}

              <div className="text-center mt-4">
                <button
                  className={`px-4 py-2 rounded
                    ${isMostPopular ? "bg-white text-purple-700" : "bg-blue-600 text-white"}
                    hover:opacity-80 transition`}
                >
                  Choose Plan
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
