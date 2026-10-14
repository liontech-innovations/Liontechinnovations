import type { ReactNode } from 'react';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

export function MarketingLayout({ children, market, compactFooter = false }: { children: ReactNode; market?: 'zimbabwe'; compactFooter?: boolean }) {
  return (
    <div className="marketing-site" data-market={market}>
      <a className="lt-skip-link" href="#main-content">Skip to content</a>
      <SiteHeader market={market} />
      <main id="main-content">{children}</main>
      <SiteFooter market={market} compact={compactFooter} />
    </div>
  );
}
