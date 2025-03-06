// // // /** @type {import('next').NextConfig} */
// // // const nextConfig = {
// // //     async headers() {
// // //       return [
// // //         {
// // //           source: "/api/:path*",
// // //           headers: [
// // //             {
// // //               key: "Access-Control-Allow-Origin",
// // //               value: "*", // Change this to restrict specific domains
// // //             },
// // //             {
// // //               key: "Access-Control-Allow-Methods",
// // //               value: "GET,POST,PUT,DELETE,OPTIONS",
// // //             },
// // //             {
// // //               key: "Access-Control-Allow-Headers",
// // //               value: "Content-Type, Authorization",
// // //             },
// // //           ],
// // //         },
// // //       ];
// // //     },
// // //   };
  
// // //   module.exports = nextConfig;
// // export async function rewrites() {
// //     return [
// //         {
// //             source: "/api/:path*",
// //             destination: "http://localhost:8069/:path*",
// //             // destination: "http://16.24.17.78/:path*",
// //             // http://16.24.17.78/odoo/users/10 // Proxy API calls to Odoo
// //         },
        
// //     ];
// // }
  

// import withPWA from 'next-pwa';

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     remotePatterns: [
//     //   {
//     //     protocol: "https",
//     //     hostname: "",
//     //     pathname: "/**", // Correct path for images from Odoo
//     //   },
//     //   {
//     //     protocol: "https",
//     //     hostname: ".com",
//     //     pathname: "/**", // Correct path for images from Odoo
//     //   },
//     //   {
//     //     protocol: "https",
//     //     hostname: "",
//     //     pathname: "/**", // General path for the domain
//     //   },
//       {
//         protocol: "http",
//         hostname: "16.24.17.78",
//         // hostname: "http://16.24.17.78/odoo/discuss",
//         pathname: "/**", // General path for the IP address
//       },
//       {
//         protocol: "https",
//         hostname: "placehold.co",
//         pathname: "/**", // General path for the placeholder service
//       },
//     ],
//   },
// };

// export default withPWA({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
//   fallbacks: {
//     document: "/offline", // Specify a fallback document for offline use
//   },
// })(nextConfig);



// next.config.js or next.config.mjs
import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://16.24.17.78:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "16.24.17.78",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/offline",
  },
})(nextConfig);
