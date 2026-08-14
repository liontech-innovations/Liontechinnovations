const explicitScheme = /^[a-z][a-z0-9+.-]*:/i;
const httpScheme = /^https?:\/\//i;
const domainName = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

export function normalizeWebsiteUrl(value) {
  if (typeof value !== 'string') return null;

  const input = value.trim();
  if (!input || (explicitScheme.test(input) && !httpScheme.test(input))) return null;

  try {
    const url = new URL(httpScheme.test(input) ? input : `https://${input}`);
    if (!httpScheme.test(url.href) || url.username || url.password || !domainName.test(url.hostname)) return null;

    return url.pathname === '/' && !url.search && !url.hash
      ? `${url.protocol}//${url.host}`
      : url.toString();
  } catch {
    return null;
  }
}
