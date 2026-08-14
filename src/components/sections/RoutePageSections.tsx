import type { LucideIcon } from "lucide-react";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { snapshotOffer } from "../../content/offers";
import { fiveGates } from "../../content/methodology";
import { PrimaryCta } from "../ui/PrimaryCta";
import { RouteLink } from "../ui/RouteLink";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  compact?: boolean;
};

export function PageHero({ eyebrow, title, description, children, compact = false }: PageHeroProps) {
  return (
    <section className={`lt-route-hero${compact ? ' lt-route-hero-compact' : ''}`}>
      <div className="lt-shell lt-route-hero-inner">
        <p className="lt-kicker">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lt-route-hero-copy">{description}</p>
        {children ? <div className="lt-route-actions">{children}</div> : null}
      </div>
    </section>
  );
}

type RouteSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "default" | "soft" | "navy";
};

export function RouteSection({
  children,
  className = "",
  id,
  tone = "default",
}: RouteSectionProps) {
  return (
    <section id={id} className={`lt-route-section lt-route-section-${tone} ${className}`.trim()}>
      <div className="lt-shell">{children}</div>
    </section>
  );
}

type RouteHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function RouteHeading({ eyebrow, title, description }: RouteHeadingProps) {
  return (
    <div className="lt-route-heading">
      {eyebrow ? <p className="lt-kicker">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

type FeatureCardProps = {
  title: string;
  children: ReactNode;
  icon?: LucideIcon;
  className?: string;
};

export function FeatureCard({ title, children, icon: Icon, className = "" }: FeatureCardProps) {
  return (
    <article className={`lt-standard-card lt-route-card ${className}`.trim()}>
      {Icon ? (
        <span className="lt-route-card-icon" aria-hidden="true">
          <Icon size={21} strokeWidth={1.8} />
        </span>
      ) : null}
      <h3>{title}</h3>
      <div className="lt-route-card-copy">{children}</div>
    </article>
  );
}

type OfferCardProps = {
  eyebrow?: string;
  title: string;
  description: string;
  price?: string;
  href: string;
  ctaLabel: string;
  featured?: boolean;
  summaryRows?: readonly string[];
};

export function OfferCard({
  eyebrow,
  title,
  description,
  price,
  href,
  ctaLabel,
  featured = false,
  summaryRows = [],
}: OfferCardProps) {
  return (
    <article className={`lt-commercial-card lt-route-offer-card${featured ? " is-featured" : ""}`}>
      <div className="lt-route-offer-card-copy">
        {eyebrow ? <p className="lt-route-card-label">{eyebrow}</p> : null}
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {price ? <strong className="lt-route-offer-price">{price}</strong> : null}
      {summaryRows.length > 0 ? (
        <ul className="lt-route-offer-summary">
          {summaryRows.map((row) => (
            <li key={row}>
              <Check size={14} aria-hidden="true" />
              <span>{row}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="lt-route-offer-card-action">
        <RouteLink href={href} className="lt-button lt-button-primary lt-route-offer-cta">
          {ctaLabel}
          <ArrowRight size={16} aria-hidden="true" />
        </RouteLink>
      </div>
    </article>
  );
}

export function FiveGatesGrid() {
  return (
    <div className="lt-route-gates-grid">
      {fiveGates.map((gate, index) => (
        <article className="lt-standard-card lt-route-gate" key={gate.name}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <h3>{gate.name}</h3>
          <p>{gate.question}</p>
        </article>
      ))}
    </div>
  );
}

type RouteCtaProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function RouteCta({
  eyebrow = "Start with evidence",
  title,
  description,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: RouteCtaProps) {
  return (
    <section className="lt-route-cta-section">
      <div className="lt-shell">
        <div className="lt-large-panel lt-route-cta">
          <div>
            <p className="lt-kicker">{eyebrow}</p>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <div className="lt-route-actions">
            <PrimaryCta label={primaryLabel} />
            {secondaryHref && secondaryLabel ? (
              <RouteLink href={secondaryHref} className="lt-button lt-button-secondary">
                {secondaryLabel}
              </RouteLink>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SnapshotPricingCard() {
  return (
    <article className="lt-commercial-card lt-route-pricing-card">
      <div className="lt-route-pricing-card-main">
        <p className="lt-route-card-label">Founding offer</p>
        <h3>{snapshotOffer.name}</h3>
        <div className="lt-route-pricing-line">
          <strong>{snapshotOffer.foundingPrice}</strong>
          <span>{snapshotOffer.standardPrice} standard price {snapshotOffer.standardPriceTiming}</span>
        </div>
        <p>{snapshotOffer.shortScope}</p>
        <ul className="lt-route-check-list">
          {snapshotOffer.inclusions.map((item) => (
            <li key={item}>
              <Check size={17} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="lt-route-pricing-card-aside">
        <span className="lt-route-card-icon" aria-hidden="true">
          <ShieldCheck size={24} strokeWidth={1.8} />
        </span>
        <h4>Minimum-5 Guarantee</h4>
        <p>{snapshotOffer.guarantee}</p>
        <PrimaryCta label="Request a Founding Snapshot" />
      </div>
    </article>
  );
}
