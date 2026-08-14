export const navigation = [
  { label: 'AI Visibility', href: '/ai-visibility-snapshot' },
  { label: 'How It Works', href: '/methodology' },
  { label: 'Services', href: '/ai-business-readiness' },
  { label: 'Platforms', href: '/#platforms' },
  { label: 'Company Brain', href: '/company-brain' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

export type NavigationHref = (typeof navigation)[number]['href'];

const serviceRoutes = new Set([
  '/ai-business-readiness',
  '/readiness-fix-sprint',
  '/monitoring',
  '/uk-ai-infrastructure',
  '/saas-platform-development',
  '/ai-intake-systems',
]);

const platformRoutes = new Set([
  '/lead-recovery',
  '/careops/lost-enquiry-recovery',
  '/careops/command-centre',
]);

export function getActiveNavigationHref(pathname: string, hash = ''): NavigationHref | null {
  const path = pathname.replace(/\/$/, '') || '/';

  if (path === '/' && hash === '#platforms') return '/#platforms';
  if (path === '/ai-visibility-snapshot') return '/ai-visibility-snapshot';
  if (path === '/methodology') return '/methodology';
  if (serviceRoutes.has(path)) return '/ai-business-readiness';
  if (platformRoutes.has(path)) return '/#platforms';
  if (path === '/company-brain') return '/company-brain';
  if (path === '/about') return '/about';
  if (path === '/contact' || path === '/roofing-brief') return '/contact';

  return null;
}
