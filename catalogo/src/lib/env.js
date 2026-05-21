const DEFAULT_APP_URL = "http://localhost:3000";
const DEFAULT_FORMSPREE_ENDPOINT = "https://formspree.io/f/xeenyryl";

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function getAppBaseUrl() {
  const configuredUrl = process.env.NEXTAUTH_URL?.trim();

  if (configuredUrl) {
    return configuredUrl;
  }

  if (!isProduction()) {
    return DEFAULT_APP_URL;
  }

  throw new Error("NEXTAUTH_URL is required in production.");
}

export function getFormspreeEndpoint() {
  const configuredEndpoint = process.env.FORMSPREE_VENTAS_ENDPOINT?.trim();

  if (configuredEndpoint) {
    return configuredEndpoint;
  }

  if (!isProduction()) {
    return DEFAULT_FORMSPREE_ENDPOINT;
  }

  throw new Error("FORMSPREE_VENTAS_ENDPOINT is required in production.");
}

export function isAdminDebugApiEnabled() {
  return process.env.ENABLE_ADMIN_DEBUG_API === "true";
}

export function isMigrationSecretValid(request) {
  const configuredSecret = process.env.MIGRATION_SECRET?.trim();

  if (!configuredSecret) {
    return false;
  }

  const headerSecret = request.headers.get("x-migration-secret")?.trim();
  const authorization = request.headers.get("authorization")?.trim();
  const bearerSecret = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";

  return (
    headerSecret === configuredSecret || bearerSecret === configuredSecret
  );
}
