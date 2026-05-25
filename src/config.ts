// Centralized configuration for the app
// Update these values based on your environment

const Config = {
  // Symfony API base URL (no trailing slash)
  API_BASE_URL: 'http://192.168.142.186:8000/api',

  // Mercure Hub URL - the /.well-known/mercure endpoint
  // Local development: Mercure runs on Docker at port 9090
  MERCURE_HUB_URL: 'http://192.168.142.186:9090/.well-known/mercure',

  // Production Mercure Hub URL (Render deployment)
  // Update this once Mercure is deployed on Render
  MERCURE_HUB_URL_PROD: 'https://your-mercure-hub.onrender.com/.well-known/mercure',

  // Set to true to use production URLs
  USE_PRODUCTION: false,
};

export function getApiBaseUrl(): string {
  return Config.API_BASE_URL;
}

export function getMercureHubUrl(): string {
  return Config.USE_PRODUCTION ? Config.MERCURE_HUB_URL_PROD : Config.MERCURE_HUB_URL;
}

export default Config;
