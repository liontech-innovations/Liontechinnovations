import { ArrowRight, Check, ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';
import { snapshotActionPath } from '../../content/industries';
import { RouteLink } from '../ui/RouteLink';

export function IndustryCta({ placement, title, description }: { placement: 'hero' | 'contextual' | 'final'; title: string; description: string }) {
  return (
    <div className={`lt-industry-cta lt-industry-cta-${placement}`} data-cta-placement={placement}>
      <div>
        <p className="lt-kicker">Evidence-led · Human-reviewed</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <RouteLink href={snapshotActionPath} className="lt-button lt-button-primary">
        GET AI SNAPSHOT <ArrowRight size={16} aria-hidden="true" />
      </RouteLink>
    </div>
  );
}

export function IndustryList({ items, ordered = false, className = '' }: { items: string[]; ordered?: boolean; className?: string }) {
  const Element = ordered ? 'ol' : 'ul';
  return (
    <Element className={`lt-industry-list ${className}`.trim()}>
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>
          {!ordered ? <Check size={16} aria-hidden="true" /> : null}
          <span>{item}</span>
        </li>
      ))}
    </Element>
  );
}

export function IndustryPanel({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="lt-industry-panel">
      <p className="lt-kicker">{eyebrow}</p>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function SourceLink({ href, label }: { href: string; label: string }) {
  return (
    <RouteLink href={href}>
      {label} <ExternalLink size={13} aria-hidden="true" />
    </RouteLink>
  );
}
