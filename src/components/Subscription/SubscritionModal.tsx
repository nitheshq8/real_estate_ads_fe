"use client";
import { useState } from "react";
import SubscriptionPlanDetails from "./SubscriptionPlanDetails";
import PaymentHistory from "./PaymentHistory";

const SubscritionModal = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  

  return (
    <>
      {/* ✅ Trigger Button to Open Modal */}
      <button
        onClick={() => setIsPopupOpen(true)}
        className="md:p-2  md:bg-blue-700 hover:bg-blue-900 bg-white min-w-fit  md:text-white   rounded-md"
        >
       Subscrition
      </button>

      {/* ✅ Modal */}
      {isPopupOpen && (
        <div className="fixed m-2  overflow-scroll inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg ">
            <h2 className="text-lg font-bold mb-4">Select Property Type</h2>

            {/* ✅ Display Property Types */}
            <SubscriptionPlanDetails/>
            {/* <PaymentHistory/> */}

            {/* ✅ Close Button */}
            <button
              onClick={() => setIsPopupOpen(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscritionModal;
