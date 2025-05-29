/**
 * API Configuration file for Parcel Tracking System
 * Contains the base API URL for the application
 */

// Define API base URL for use throughout the app
// Always use the deployed render.com endpoint
const API_BASE_URL = "https://paracel-tracking-system.onrender.com";
    
console.log("Using API base URL:", API_BASE_URL);

// Export the API base URL for use in other files
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = { API_BASE_URL };
} else {
    // Browser environment
    window.API_BASE_URL = API_BASE_URL;
}
