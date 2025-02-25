"use client";
import SharedLinksTable from "@/components/PropertyPage/SharedLinksTable";
import { useRouter } from "next/navigation";

export default function SharedAdsPage() {
  const router = useRouter();
  return (
    <div>
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded"
        onClick={() => router.push("/")} // ✅ Redirects on click
      >
        View Shared Ads
      </button>
      <SharedLinksTable />
    </div>
  );
}
