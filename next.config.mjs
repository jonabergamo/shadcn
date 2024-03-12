/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.dog.ceo", "lh3.googleusercontent.com"],
  },

  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }]; // required to make Konva & react-konva work
    return config;
  },
};

export default nextConfig;
