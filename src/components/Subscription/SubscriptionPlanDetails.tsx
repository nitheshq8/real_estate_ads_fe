// "use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { subscription_plan_details } from "@/services/api";
// import PlanCards from "./PlanCards";

// export default function SubscriptionPlanDetails() {
//   const router = useRouter(); // For client-side navigation
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     subscription_plan_details()
//       .then((response: any) => {
//         setPlans(response.data.result);
//         setLoading(false);
//       })
//       .catch((err: any) => {
//         console.error(err);
//         setError("Error fetching subscription plan details.");
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return (
//       <div className="text-center mt-16 text-lg">
//         Loading subscription plans...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center mt-16 text-lg text-red-600">
//         {error}
//       </div>
//     );
//   }

//   const handleChoosePlan = (plan: any) => {
//     // Example: navigate to /payment and pass the plan as a query param
//     // or store in localStorage or pass a route param, etc.
//     router.push(`/subscription/payment?plan=${plan.subscription_plan}&price=${plan.price}`);
//     // In your /payment page, you can retrieve these query params
//     // and display the plan/price for the user to fill in other details.
//   };

//   return (
//     <div className="p-2 ">
//       <h1 className="text-center mb-8 text-2xl font-bold">
//         Choose the plan that’s right for you
//       </h1>

//       <div className="flex flex-wrap justify-center gap-4">
//         {plans.map((plan: any) => {
//           const isMostPopular = plan.subscription_plan === "premium";
// <PlanCards
//           // return (
//           //   <div
//           //     key={plan.subscription_plan}
//           //     className={`relative w-72 min-h-[320px] border rounded-lg p-6 bg-white shadow-md 
//           //       transition-transform duration-200 text-gray-800  border-[#8cd3e9]
//           //       hover:bg-gradient-to-r hover:from-[#afd5e1] hover:to-[#59636c]
//           //       ${
//           //         isMostPopular
//           //           ? "bg-gradient-to-r from-[#b88ce9] to-[#49336e] text-white border-none"
//           //           : ""
//           //       }`}
//           //   >
//           //     {isMostPopular && (
//           //       <div className="absolute top-[-10px] right-[-10px] bg-yellow-300 text-black font-bold py-1 px-2 rounded shadow">
//           //         Most Popular
//           //       </div>
//           //     )}

//           //     <div>
//           //       <h2 className="text-2xl font-bold mb-4">
//           //         {plan.subscription_plan}
//           //       </h2>
//           //       <p className="mb-2 text-lg">
//           //         <span className="font-semibold">Monthly Price:</span> ₹
//           //         {plan.price}
//           //       </p>
//           //       <p className="mb-2">
//           //         <span className="font-semibold">Plan Type:</span>{" "}
//           //         {plan.subscription_plan.charAt(0).toUpperCase() +
//           //           plan.subscription_plan.slice(1)}
//           //       </p>
//           //       <p className="mb-2">
//           //         <span className="font-semibold">Max Users:</span>{" "}
//           //         {plan.max_users === 0 ? "Unlimited" : plan.max_users}
//           //       </p>
//           //       <p className="mb-2">
//           //         <span className="font-semibold">Portal Sharing:</span>{" "}
//           //         {plan.have_portal ? "Enabled" : "Disabled"}
//           //       </p>
//           //     </div>

//           //     <div className="text-center mt-4">
//           //       <button
//           //         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//           //         onClick={() => handleChoosePlan(plan)}
//           //       >
//           //         Choose Plan
//           //       </button>
//           //     </div>
//           //   </div>
//           // );
//         })}
//       </div>
//     </div>
//   );
// }








"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CurrentSubscriptionPlan from "./CurrentSubscriptionPlan";
import PaymentHistory from "./PaymentHistory";

interface Plan {
  subscription_plan: string;
  name: string;
  price: number;        // Interpreted as monthly price
  max_users: number;
  have_portal?: boolean;
  renewal_date?: boolean | string;
  auto_renew?: boolean;
}

interface PlanCardsProps {
  plans: Plan[];
}

// Example discount for yearly
const YEARLY_DISCOUNT_PERCENT = 20;

export default function SubscriptionPlanDetails({setIsPopupOpen}:any) {
  // Toggle for monthly/yearly
  const router = useRouter(); 
  const plans = [
    {
      subscription_plan: "basic",
      name: "Test Subscription",
      price: 100,
      max_users: 1,
      have_portal: false
    },
    {
      subscription_plan: "advance",
      name: "Advance Plan",
      price: 300,
      max_users: 5,
      have_portal: false
    },
    {
      subscription_plan: "premium",
      name: "Premium Plan",
      price: 300,
      max_users: 5,
      have_portal: true
    }
  ];
  const [isYearly, setIsYearly] = useState(false);
  [
    {
      "subscription_plan": "basic",
      "name": "Test Subscription",
      "price": 100,       // monthly price
      "max_users": 1,
      "have_portal": false
    },
    {
      "subscription_plan": "advance",
      "name": "Advance Plan",
      "price": 300,       // monthly price
      "max_users": 5,
      "have_portal": false
    },
    {
      "subscription_plan": "premium",
      "name": "Premium Plan",
      "price": 300,       // monthly price
      "max_users": 5,
      "have_portal": true
    }
  ];
  
  const handleToggle = () => {
    setIsYearly(!isYearly);
  };

  // Helper function to compute displayed price
  // If monthly => just plan.price
  // If yearly => plan.price * 12 * (1 - YEARLY_DISCOUNT_PERCENT/100)
  const getDisplayedPrice = (plan: Plan): number => {
    if (!isYearly) {
      // Monthly
      return plan.price;
    } else {
      // Yearly
      const monthlyPrice = plan.price;
      const discountMultiplier = 1 - YEARLY_DISCOUNT_PERCENT / 100;
      return monthlyPrice * 12 * discountMultiplier;
    }
  };
  const handleChoosePlan = (plan: any) => {
    // Example: navigate to /payment and pass the plan as a query param
    // or store in localStorage or pass a route param, etc.
    setIsPopupOpen()
    router.push(`/subscription/payment?plan=${plan.subscription_plan}&price=${plan.price}`);
    // In your /payment page, you can retrieve these query params
    // and display the plan/price for the user to fill in other details.
  };
  return (
    <div className="p-2 m-2">
      {/* Toggle monthly/yearly */}
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
          <div
            className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full
              peer peer-checked:after:translate-x-full peer-checked:after:border-white
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

      {/* Cards */}
      <div className="flex flex-wrap justify-center gap-6 h-96 p-4 overflow-scroll">
        {plans.map((plan) => {
          const displayedPrice = getDisplayedPrice(plan);

          // Example highlight if plan.subscription_plan === "premium"
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

              <h2 className="text-xl font-bold mb-2 capitalize">
                {plan.subscription_plan}
              </h2>

              <p className="mb-2 font-semibold">
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

              {/* Show discount note if yearly & discount > 0 */}
              {isYearly && YEARLY_DISCOUNT_PERCENT > 0 && (
                <p className="text-sm text-green-600 font-medium mb-2">
                  {YEARLY_DISCOUNT_PERCENT}% off vs monthly!
                </p>
              )}

              <div className="text-center mt-4">
                <button
                  className={`px-4 py-2 rounded 
                    ${isMostPopular ? "bg-white text-purple-700" : "bg-blue-600 text-white"}
                    hover:opacity-80 transition`}
               
                       onClick={() => handleChoosePlan(plan)}
                
               >
                  Choose Plan
                </button>
              </div>
            </div>
          );
        })}
         
        <CurrentSubscriptionPlan/>
        {/* <PaymentHistory/> */}
      </div>
    </div>
  );
}

 



