const Config = {
  // Symfony API base URL (no trailing slash)
  API_BASE_URL: 'https://webproject-production-0434.up.railway.app/api',

  // Mercure Hub URL - the /.well-known/mercure endpoint
  MERCURE_HUB_URL: 'http://192.168.142.186:9090/.well-known/mercure',

  // Production Mercure Hub URL (Railway deployment)
  MERCURE_HUB_URL_PROD: 'https://mercure-production-d499.up.railway.app/.well-known/mercure',

  // Set to true to use production URLs
  USE_PRODUCTION: true,
};

export function getApiBaseUrl(): string {
  return Config.API_BASE_URL;
}

export function getMercureHubUrl(): string {
  return Config.USE_PRODUCTION ? Config.MERCURE_HUB_URL_PROD : Config.MERCURE_HUB_URL;
}

export function getApiHost(): string {
  return 'https://webproject-production-0434.up.railway.app';
}

export default Config;