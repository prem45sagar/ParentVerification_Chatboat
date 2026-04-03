/**
 * API configuration for the frontend.
 * Automatically switches between localhost for development and 
 * relative paths for production deployment on Vercel.
 */

// If we are in production, we use relative paths so Vercel can proxy
// otherwise we use the standard localhost for development.
const BASE_URL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:5001/api';

export default BASE_URL;
