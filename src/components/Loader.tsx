import React, { useEffect } from "react";

const Loader: React.FC = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 pointer-events-none z-50">
      <div
        className={`h-44 w-44 rounded-full border-4 border-t-transparent border-solid gradient-border animate-spin`}
        
      ></div>
    </div>
  );
};

export default Loader;
