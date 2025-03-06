"use client";
import PaymentPage from "@/components/Subscription/PaymentPage";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const price = searchParams.get("price");

  // Render a form or payment UI, showing the chosen plan and price
  return (
    <div className="h-full mt-24">
      {/* <h1>Payment for {plan} plan</h1>
      <p>Price: ₹{price}</p> */}
      <PaymentPage plan={plan} price={price} />

      {/* Payment form goes here */}
    </div>
  );
}
