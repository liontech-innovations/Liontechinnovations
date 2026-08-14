import { useEffect, useState } from 'react';
import LegacySite from '../legacy/LegacySite';
import { MarketingLayout } from '../components/layout/MarketingLayout';
import { AboutPage } from '../pages/AboutPage';
import { AIBusinessReadinessPage } from '../pages/AIBusinessReadinessPage';
import { AIVisibilitySnapshotPage } from '../pages/AIVisibilitySnapshotPage';
import { CompanyBrainPage } from '../pages/CompanyBrainPage';
import { ContactPage } from '../pages/ContactPage';
import { HomePage } from '../pages/HomePage';
import { MethodologyPage } from '../pages/MethodologyPage';
import { MonitoringPage } from '../pages/MonitoringPage';
import { ReadinessFixSprintPage } from '../pages/ReadinessFixSprintPage';
import { RouteLink } from '../components/ui/RouteLink';
import { scrollToHash } from '../lib/navigation';
import { useSeo } from '../lib/seo';

const marketingRoutes = {
  '/': HomePage,
  '/ai-visibility-snapshot': AIVisibilitySnapshotPage,
  '/ai-business-readiness': AIBusinessReadinessPage,
  '/readiness-fix-sprint': ReadinessFixSprintPage,
  '/monitoring': MonitoringPage,
  '/company-brain': CompanyBrainPage,
  '/methodology': MethodologyPage,
  '/about': AboutPage,
  '/contact': ContactPage,
} as const;

const legacyRoutes = new Set([
  '/privacy-policy',
  '/terms-and-conditions',
  '/uk-ai-infrastructure',
  '/saas-platform-development',
  '/ai-intake-systems',
  '/lead-recovery',
  '/roofing-brief',
  '/careops/lost-enquiry-recovery',
  '/careops/command-centre',
]);

function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname.replace(/\/$/, '') || '/');

  useEffect(() => {
    const update = () => setPathname(window.location.pathname.replace(/\/$/, '') || '/');
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);

  return pathname;
}

function useRouteHashScroll(pathname: string) {
  useEffect(() => {
    if (!window.location.hash) return;

    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => scrollToHash(window.location.hash));
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [pathname]);
}

function NotFoundPage() {
  useSeo({ title: 'Page Not Found | LionTech Innovations', description: 'The requested LionTech page could not be found.', path: window.location.pathname });
  return (
    <MarketingLayout>
      <section className="lt-page-intro">
        <div className="lt-shell lt-page-intro-inner">
          <p className="lt-eyebrow">404</p>
          <h1>That page is not available.</h1>
          <p className="lt-page-lede">Return to LionTech AI Business Readiness.</p>
          <RouteLink className="lt-button lt-button-primary" href="/">Back to home</RouteLink>
        </div>
      </section>
    </MarketingLayout>
  );
}

export function AppRoutes() {
  const pathname = usePathname();
  useRouteHashScroll(pathname);

  if (legacyRoutes.has(pathname)) return <LegacySite />;

  const Page = marketingRoutes[pathname as keyof typeof marketingRoutes];
  if (!Page) return <NotFoundPage />;

  return (
    <MarketingLayout>
      <Page />
    </MarketingLayout>
  );
}

export const routeInventory = {
  marketing: Object.keys(marketingRoutes),
  legacy: Array.from(legacyRoutes),
  static: ['/careops/free-check', '/careops/free-check/thanks.html'],
} as const;
