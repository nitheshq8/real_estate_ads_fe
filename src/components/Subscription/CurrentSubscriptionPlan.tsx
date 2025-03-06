
"use client";
import { fetchSubscriptionPlanByUserId } from "@/services/api";
import React, { useCallback, useEffect, useState } from "react";

interface SubscriptionPlan {
  id: number;
  name: string;
  subscription_plan: string;
  price: number;
  start_date: string;
  end_date: string;
  renewal_date: string | false;
  auto_renew: boolean;
  last_payment_date: string | false;
  next_payment_date: string | false;
  discount: number;
  notes: string;
  max_users: number;
  have_portal: boolean;
}

interface CurrentSubscriptionProps {
  userId?: number;
}

export default function CurrentSubscriptionPlan() {
  const [subscription, setSubscription] = useState<SubscriptionPlan | null>(null);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchsubscriptionPlan = useCallback(async () => {
    try {
      const response:any = await fetchSubscriptionPlanByUserId();
      console.log("--++",response?.data?.result);
      
      setSubscription(response?.data?.result?.[0])
    } catch (error) {
      setError("Error fetching cities.");
      console.error("API Error (Cities):", error);
    }
  }, []);
  useEffect(() => {
  
    fetchsubscriptionPlan();
  }, []);

  // if (loading) {
  //   return (
  //     <div className="text-center mt-4 text-lg">
  //       Loading current subscription plan...
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="text-center mt-4 text-red-500 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">Current Subscription Plan</h2>
      {subscription ? (
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Plan Name:</span> {subscription.name}
          </p>
          <p>
            <span className="font-semibold">Plan Type:</span>{" "}
            {/* {subscription.subscription_plan.charAt(0).toUpperCase() +
              subscription.subscription_plan.slice(1)} */}
          </p>
          <p>
            <span className="font-semibold">Price:</span> {subscription.price}
          </p>
          <p>
            <span className="font-semibold">Start Date:</span> {subscription.start_date}
          </p>
          <p>
            <span className="font-semibold">End Date:</span> {subscription.end_date}
          </p>
          <p>
            <span className="font-semibold">Renewal Date:</span>{" "}
            {subscription.renewal_date || "Not set"}
          </p>
          <p>
            <span className="font-semibold">Auto Renew:</span>{" "}
            {subscription.auto_renew ? "Yes" : "No"}
          </p>
          <p>
            <span className="font-semibold">Max Users:</span>{" "}
            {subscription.max_users === 0 ? "Unlimited" : subscription.max_users}
          </p>
          <p>
            <span className="font-semibold">Portal Access:</span>{" "}
            {subscription.have_portal ? "Enabled" : "Disabled"}
          </p>
        </div>
      ) : (
        <div className="text-center">No active subscription plan found.</div>
      )}
    </div>
  );
}
