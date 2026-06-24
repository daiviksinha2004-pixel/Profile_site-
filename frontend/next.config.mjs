/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow Next.js dev assets to be requested from LAN / WSL hosts (e.g. accessing
  // the dev server via your machine's network IP). Harmless in production builds.
  allowedDevOrigins: ["172.28.208.1", "localhost", "127.0.0.1"],
};

export default nextConfig;
