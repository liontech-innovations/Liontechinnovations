import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { company } from './content/company';
import { routeSeo, type MarketingRoutePath } from './content/routeSeo';
import { routeMeta } from './legacy/LegacySite';
import { industriesDirectorySeo, industryRouteSeo } from './content/industries/seo';
import { programmaticRoutes } from './content/industries';

type RuntimeWithWindow = typeof globalThis & { window?: Window & typeof globalThis };

const runtime = globalThis as RuntimeWithWindow;

const legacyPrerenderRoutes = [
  '/privacy-policy',
  '/terms-and-conditions',
  '/careops/lost-enquiry-recovery',
  '/careops/command-centre',
] as const;

type PrerenderRoutePath = MarketingRoutePath | (typeof legacyPrerenderRoutes)[number] | '/industries' | (typeof programmaticRoutes)[number];

export const prerenderRoutes: PrerenderRoutePath[] = [
  ...(Object.keys(routeSeo) as MarketingRoutePath[]),
  ...legacyPrerenderRoutes,
  '/industries',
  ...programmaticRoutes,
];

function createPrerenderWindow(pathname: string) {
  return {
    location: {
      hash: '',
      hostname: 'liontechinnovations.co.uk',
      href: `${company.website}${pathname === '/' ? '/' : pathname}`,
      origin: company.website,
      pathname,
      port: '',
      protocol: 'https:',
      search: '',
    } as Location,
    matchMedia: () => ({ matches: false }) as MediaQueryList,
  } as unknown as Window & typeof globalThis;
}

export function renderMarketingRoute(pathname: PrerenderRoutePath) {
  const seo = pathname in routeSeo
    ? routeSeo[pathname as MarketingRoutePath]
    : pathname === '/industries'
      ? industriesDirectorySeo
      : industryRouteSeo.get(pathname)
        ?? { ...routeMeta[pathname as keyof typeof routeMeta], path: pathname };
  if (!seo) throw new Error(`Missing SEO configuration for ${pathname}`);

  const previousWindow = runtime.window;
  runtime.window = createPrerenderWindow(pathname);

  try {
    return {
      markup: renderToString(
        <StrictMode>
          <App />
        </StrictMode>,
      ),
      seo,
    };
  } finally {
    if (previousWindow) runtime.window = previousWindow;
    else delete runtime.window;
  }
}
