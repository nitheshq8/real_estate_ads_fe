export const theme = {
    colors: {
      background: "#FFFFFF", // White background
      text: "#1A202C", // Dark text for readability
      primary: "#6B46C1", // Purple
      secondary: "#D69E2E", // Gold
      border: "#E2E8F0", // Light gray border
      success: "#38A169", // Green for success messages
      error: "#E53E3E", // Red for errors
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      heading: "font-bold text-gray-800",
      subHeading: "text-gray-600 text-lg",
      bodyText: "text-gray-700",
    },
    buttons: {
      primary:
        "bg-error text-red py-2 px-6 rounded-lg shadow-md hover:bg-purple-700 transition",
      secondary:
        "bg-secondary text-white py-2 px-6 rounded-lg shadow-md hover:bg-yellow-600 transition",
      outlined:
        "border border-primary text-primary py-2 px-6 rounded-lg hover:bg-primary hover:text-white transition",
    },
    card: {
      base: "p-4 rounded-lg shadow-lg bg-white border border-gray-200",
      hover: "hover:shadow-xl transition duration-300",
    },
    input: {
      base: "w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-primary focus:outline-none bg-white",
    },
  };
  