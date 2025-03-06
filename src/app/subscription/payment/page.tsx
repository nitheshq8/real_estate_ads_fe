"use client";
import PaymentPage from "@/components/Subscription/PaymentPage";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="h-full mt-24">
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentPage />
      </Suspense>

      {/* Payment form goes here */}
    </div>
  );
}
