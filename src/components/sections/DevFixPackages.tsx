import { ArrowUpRight, Check } from 'lucide-react';
import { devFixPackages } from '../../content/devFix';
import { RouteLink } from '../ui/RouteLink';
import { RouteHeading, RouteSection } from './RoutePageSections';

export function DevFixPackages() {
  return (
    <RouteSection id="packages" className="lt-dev-fix-packages">
      <RouteHeading eyebrow="LIONTECH DEV FIX DESK" title="Fixed-price repair packages" description="Choose the smallest package that matches the problem. For unclear issues, start with the Fault-Find Call." />
      <div className="lt-dev-fix-package-grid">
        {devFixPackages.map((item) => (
          <article className="lt-standard-card lt-dev-fix-package" key={item.name}>
            <h3>{item.name}</h3>
            <strong className="lt-dev-fix-price">{item.price}</strong>
            <p className="lt-dev-fix-turnaround">{item.turnaround}</p>
            <p>{item.bestFor}</p>
            <ul>{item.includes.map((line) => <li key={line}><Check size={16} aria-hidden="true" /><span>{line}</span></li>)}</ul>
            <RouteLink className="lt-button lt-button-primary" href={item.href}>{item.cta}<ArrowUpRight size={16} aria-hidden="true" /></RouteLink>
          </article>
        ))}
      </div>
      <p className="lt-dev-fix-note">Prices are fixed-scope starting packages. Work starts after payment, access, and scope confirmation. If the issue is larger than the package, LionTech will confirm options before extra work is done.</p>
    </RouteSection>
  );
}
