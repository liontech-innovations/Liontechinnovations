import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { company } from './content/company';
import { routeSeo, type MarketingRoutePath } from './content/routeSeo';

type RuntimeWithWindow = typeof globalThis & { window?: Window & typeof globalThis };

const runtime = globalThis as RuntimeWithWindow;

export const prerenderRoutes = Object.keys(routeSeo) as MarketingRoutePath[];

function createPrerenderWindow(pathname: MarketingRoutePath) {
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

export function renderMarketingRoute(pathname: MarketingRoutePath) {
  const seo = routeSeo[pathname];
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
