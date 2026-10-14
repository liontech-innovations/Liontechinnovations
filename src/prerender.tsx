import { StrictMode } from 'react';
import { SiteFooter } from './components/layout/SiteFooter';
import { renderToString } from 'react-dom/server';
import App from './App';
import { company } from './content/company';
import { routeSeo, type MarketingRoutePath } from './content/routeSeo';
import { routeMeta } from './legacy/LegacySite';
import { industriesDirectorySeo, industryRouteSeo } from './content/industries/seo';
import { programmaticRoutes } from './content/industries';
import { signatureInstallSeo } from './content/emailSignature';
import { zimbabweIndustryRoutes } from './content/zimbabweIndustries';
import { zimbabweIndustrySeo } from './content/zimbabweIndustrySeo';
import { tenderPageByPath, tenderRoutes } from './content/tenders';
import { tenderHubSeo, createTenderSeo } from './content/tenders/seo';

type RuntimeWithWindow = typeof globalThis & { window?: Window & typeof globalThis };

const runtime = globalThis as RuntimeWithWindow;

export function renderSharedFooter() {
  return renderToString(<SiteFooter />);
}

const legacyPrerenderRoutes = [
  '/privacy-policy',
  '/terms-and-conditions',
  '/careops/lost-enquiry-recovery',
  '/careops/command-centre',
] as const;

type PrerenderRoutePath = MarketingRoutePath | (typeof legacyPrerenderRoutes)[number] | '/email/signature-install' | '/industries' | (typeof programmaticRoutes)[number] | `/tenders${string}`;

export const prerenderRoutes: PrerenderRoutePath[] = [
  ...(Object.keys(routeSeo) as MarketingRoutePath[]),
  ...legacyPrerenderRoutes,
  '/email/signature-install',
  '/industries',
  ...programmaticRoutes,
  ...zimbabweIndustryRoutes,
  ...tenderRoutes as PrerenderRoutePath[],
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
  const seo = pathname === '/tenders' ? tenderHubSeo
    : tenderPageByPath.has(pathname) ? createTenderSeo(tenderPageByPath.get(pathname)!)
    : pathname in routeSeo
    ? routeSeo[pathname as MarketingRoutePath]
    : pathname === '/email/signature-install'
      ? signatureInstallSeo
    : pathname === '/industries'
      ? industriesDirectorySeo
      : zimbabweIndustrySeo.get(pathname) ?? industryRouteSeo.get(pathname)
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
