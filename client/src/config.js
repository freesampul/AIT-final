// API configuration
// In production, set VITE_API_URL environment variable to your API server URL
// For local development, it defaults to http://localhost:3001
// Example: VITE_API_URL=https://api.yourapp.com
export const API_URL = import.meta.env.VITE_API_URL || "ait-final-server.onrender.com";

// Helper function to build API endpoints
// Ensures proper URL construction regardless of trailing slashes
export const apiEndpoint = (path) => {
  const baseUrl = API_URL.replace(/\/+$/, ""); // Remove trailing slashes
  const cleanPath = path.replace(/^\/+/, ""); // Remove leading slashes
  return `${baseUrl}/${cleanPath}`;
};

