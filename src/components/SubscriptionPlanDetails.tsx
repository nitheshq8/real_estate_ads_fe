// pages/subscription_plan_details.js
"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SubscriptionPlanDetails() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace with your actual Odoo endpoint URL if needed
    axios
      .post('http://localhost:8069/api/subscription_plan_details',{})
      .then((response) => {
        setPlans(response.data.result);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching subscription plan details.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-16 text-lg">
        Loading subscription plans...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-16 text-lg text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className=" p-9">
      <h1 className="text-center mb-8 text-2xl font-bold">
        Choose the plan that’s right for you
      </h1>

      <div className="flex flex-wrap justify-center gap-4">
        {plans.map((plan:any) => {
          // Example: highlight the "premium" plan
          const isMostPopular = plan.subscription_plan === 'premium';

          return (
            <div
              key={plan.subscription_plan}
              className={`relative w-72 min-h-[320px] border rounded-lg p-6 bg-white shadow-md 
                transition-transform duration-200 text-gray-800  border-[#8cd3e9]
                hover:bg-gradient-to-r hover:from-[#afd5e1] hover:to-[#59636c]
                ${isMostPopular ? 'bg-gradient-to-r from-[#b88ce9] to-[#49336e] text-white border-none' : ''}`}
            >
              {isMostPopular && (
                <div className="absolute top-[-10px] right-[-10px] bg-yellow-300 text-black font-bold py-1 px-2 rounded shadow">
                  Most Popular
                </div>
              )}

<div>
                <h2 className="text-2xl font-bold mb-4">{plan.subscription_plan}</h2>
                <p className="mb-2 text-lg">
                  <span className="font-semibold">Monthly Price:</span> ₹
                  {plan.price}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Plan Type:</span>{" "}
                  {plan.subscription_plan.charAt(0).toUpperCase() +
                    plan.subscription_plan.slice(1)}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Max Users:</span>{" "}
                  {plan.max_users === 0 ? "Unlimited" : plan.max_users}
                </p>
                {/* <p className="mb-2">
                  <span className="font-semibold">Auto Renew:</span>{" "}
                  {plan.auto_renew ? "Yes" : "No"}
                </p> */}
                {/* <p className="mb-2">
                  <span className="font-semibold">Renewal Date:</span>{" "}
                  {plan.renewal_date ? plan.renewal_date : "Not set"}
                </p> */}
                {/* {plan.have_portal !== undefined && ( */}
                  <p className="mb-2">
                    <span className="font-semibold">Portal Sharing:</span>{" "}
                    {plan.have_portal ? "Enabled" : "Disabled"}
                  </p>
                {/* )} */}
              </div>
              <div className="text-center mt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
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


// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function SubscriptionPlanDetails() {
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     axios
//       .post("http://localhost:8069/api/subscription_plan_details", {})
//       .then((response) => {
//         setPlans(response.data.result);
//         setLoading(false);
//       })
//       .catch((err) => {
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
//       <div className="text-center mt-16 text-lg text-red-600">{error}</div>
//     );
//   }

//   return (
//     <div className="p-8 font-sans">
//       <h1 className="text-center mb-8 text-3xl font-bold">
//         Choose the Plan That’s Right For You
//       </h1>
//       <div className="flex flex-wrap justify-center gap-8">
//         {plans.map((plan) => {
//           // Customize card styles based on plan type
//           let cardClasses = "bg-white border border-gray-300";
//           if (plan.subscription_plan === "enterprise") {
//             cardClasses =
//               "bg-gradient-to-r from-green-600 to-green-800 text-white border-none";
//           } else if (plan.subscription_plan === "premium") {
//             cardClasses = "bg-blue-100 border-blue-500";
//           }
//           const isMostPopular = plan.subscription_plan === 'premium';

//           return (
//             <div
//               key={plan.subscription_plan}
//               className={`w-80 min-h-[320px] p-6 rounded-xl shadow-md ${cardClasses} flex flex-col justify-between
              
//                              ${isMostPopular ? 'bg-gradient-to-r from-[#b88ce9] to-[#49336e] text-white border-none' : ''}`}            
            
//             >
             
//             </div>
//           );
//         })}
//       </div>
//       <div className="mt-8 text-center">
//         <p className="text-gray-600">
//           Compare features and select the best plan for your needs.
//         </p>
//       </div>
//     </div>
//   );
// }
