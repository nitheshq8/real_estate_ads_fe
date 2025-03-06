// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     async headers() {
//       return [
//         {
//           source: "/api/:path*",
//           headers: [
//             {
//               key: "Access-Control-Allow-Origin",
//               value: "*", // Change this to restrict specific domains
//             },
//             {
//               key: "Access-Control-Allow-Methods",
//               value: "GET,POST,PUT,DELETE,OPTIONS",
//             },
//             {
//               key: "Access-Control-Allow-Headers",
//               value: "Content-Type, Authorization",
//             },
//           ],
//         },
//       ];
//     },
//   };
  
//   module.exports = nextConfig;
export async function rewrites() {
    return [
        {
            source: "/api/:path*",
            // destination: "http://localhost:8069/:path*",
            destination: "http://16.24.17.78/:path*",
            // http://16.24.17.78/odoo/users/10 // Proxy API calls to Odoo
        },
        
    ];
}
  