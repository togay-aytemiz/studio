const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1']);
const RESERVED_SUBDOMAINS = new Set(['www', 'validate']);

export const getDemoSlugFromHost = (hostname: string): string | null => {
  const normalized = hostname.trim().toLowerCase();
  if (LOCAL_HOSTNAMES.has(normalized)) {
    return null;
  }

  const parts = normalized.split('.').filter(Boolean);
  if (parts.length < 3) {
    return null;
  }

  const subdomain = parts[0];
  if (RESERVED_SUBDOMAINS.has(subdomain)) {
    return null;
  }

  return subdomain || null;
};
