import type { ReactNode } from 'react';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

export function MarketingLayout({ children, market }: { children: ReactNode; market?: 'zimbabwe' }) {
  return (
    <div className="marketing-site">
      <a className="lt-skip-link" href="#main-content">Skip to content</a>
      <SiteHeader market={market} />
      <main id="main-content">{children}</main>
      <SiteFooter market={market} />
    </div>
  );
}
