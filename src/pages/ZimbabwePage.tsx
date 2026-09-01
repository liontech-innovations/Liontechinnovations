import { ArrowDown, ArrowRight, Building2, Check, Hotel, Landmark, LockKeyhole, Plus, ShieldCheck, Truck } from 'lucide-react';
import { ZimbabweEnquiryForm } from '../components/ZimbabweEnquiryForm';
import { FeatureCard, RouteHeading, RouteSection } from '../components/sections/RoutePageSections';
import { RouteLink } from '../components/ui/RouteLink';
import { company } from '../content/company';
import { platforms } from '../content/platforms';
import { routeSeo } from '../content/routeSeo';
import { zimbabwe, zimbabweArchitecture, zimbabweControls, zimbabweDelivery, zimbabweEstateFlow, zimbabweFaq, zimbabweNodes, zimbabweOffers, zimbabweReviewAreas, zimbabweSectors, zimbabweSecurity, zimbabweSupport } from '../content/zimbabwe';
import { useSeo } from '../lib/seo';
import '../styles/zimbabwe.css';

const sectorIcons = [Landmark, ShieldCheck, Hotel, Building2, Truck, Building2];

function HarareImage({ name, alt, hero = false, fullBleed = false }: { name: string; alt: string; hero?: boolean; fullBleed?: boolean }) {
  const base = `/assets/zimbabwe/${name}`;
  const sizes = hero || fullBleed ? '100vw' : '(min-width: 900px) 50vw, 100vw';
  return <picture className="lt-zimbabwe-picture">
    <source type="image/avif" srcSet={`${base}-480.avif 480w, ${base}-960.avif 960w`} sizes={sizes} />
    <source type="image/webp" srcSet={`${base}-480.webp 480w, ${base}-960.webp 960w`} sizes={sizes} />
    <img src={`${base}.jpg`} srcSet={`${base}-480.jpg 480w, ${base}.jpg 960w`} sizes={sizes} alt={alt} width={960} height={1280} loading={hero ? 'eager' : 'lazy'} fetchPriority={hero ? 'high' : 'auto'} decoding="async" />
  </picture>;
}

function MarketMark() {
  return <img className="lt-zimbabwe-map" src="/assets/zimbabwe/zimbabwe-map-flag.jpg" alt="Map of Zimbabwe filled with the national flag" width={128} height={108} decoding="async" />;
}

function ReviewLink({ children = 'Request an Executive Review', secondary = false }: { children?: React.ReactNode; secondary?: boolean }) {
  return <RouteLink href={zimbabwe.enquiryHref} className={`lt-button lt-button-${secondary ? 'secondary' : 'primary'}`}>{children}<ArrowRight size={16} aria-hidden="true" /></RouteLink>;
}

export function ZimbabwePage() {
  useSeo(routeSeo['/zimbabwe']);
  return <div className="lt-zimbabwe-page">
    <section className="lt-zimbabwe-hero" aria-labelledby="zw-title">
      <HarareImage name="harare-hero" alt="Harare central business district skyline, Zimbabwe" hero />
      <div className="lt-zimbabwe-scrim" aria-hidden="true" />
      <div className="lt-shell lt-zimbabwe-hero-inner">
        <div className="lt-zimbabwe-market"><MarketMark /><p className="lt-kicker">ZIMBABWE · CORPORATE AI &amp; DIGITAL INFRASTRUCTURE</p></div>
        <h1 id="zw-title">{zimbabwe.title}</h1>
        <p className="lt-zimbabwe-hero-copy">{zimbabwe.description}</p>
        <div className="lt-route-actions"><ReviewLink /><RouteLink href="/zimbabwe#delivery" className="lt-button lt-button-secondary">See how we work</RouteLink></div>
        <p className="lt-zimbabwe-trust">{company.legalName} · Registered in England and Wales · Company No. {company.companiesHouseNumber} · United Kingdom</p>
      </div>
    </section>

    <RouteSection>
      <RouteHeading eyebrow="ZIMBABWE CORPORATE FOCUS" title="Built for organisations where digital quality, trust and operational efficiency matter." description="LionTech focuses on established organisations with customer-facing systems, multi-team operations or information that needs to stay accurate across websites, staff and digital channels." />
      <div className="lt-zimbabwe-sector-grid">{zimbabweSectors.map((sector, index) => <FeatureCard key={sector.title} title={sector.title} icon={sectorIcons[index]}><p>{sector.description}</p></FeatureCard>)}</div>
    </RouteSection>

    <RouteSection tone="soft" id="business-today">
      <div className="lt-zimbabwe-editorial">
        <div className="lt-zimbabwe-editorial-image"><HarareImage name="harare-business-district" alt="Central Harare business district and city traffic" /></div>
        <div><RouteHeading title="Zimbabwe is building serious businesses. The digital infrastructure should match the ambition." description="A website can run for years and still carry stale information, broken customer journeys or data that is difficult to reuse safely. The answer is not always a rebuild. We first identify what is working, what is outdated and what is actually worth changing." />
          <h3>What we look at</h3><ul className="lt-zimbabwe-review-areas">{zimbabweReviewAreas.map((item) => <li key={item}><Check size={17} aria-hidden="true" /><span>{item}</span></li>)}</ul>
        </div>
      </div>
      <ol className="lt-zimbabwe-estate-flow" aria-label="Digital foundation review areas">{zimbabweEstateFlow.map((item, index) => <li key={item}><span>{item}</span>{index < zimbabweEstateFlow.length - 1 && <ArrowRight size={18} aria-hidden="true" />}</li>)}</ol>
      <p className="lt-zimbabwe-flow-note">The review determines which areas matter for your organisation. Not every engagement needs every stage.</p>
    </RouteSection>

    <RouteSection id="zimbabwe-offers">
      <RouteHeading title="A clear starting point. A separately agreed scope." description="Start with a review. Where the evidence supports further work, agree the implementation before it begins." />
      <div className="lt-zimbabwe-offers">{zimbabweOffers.map((offer, index) => <article className={`lt-commercial-card lt-zimbabwe-offer${index === 0 ? ' lt-zimbabwe-offer-entry' : ''}`} key={offer.title}>
        <h3>{offer.title}</h3><strong className="lt-zimbabwe-price">{offer.price}</strong><p>{offer.description}</p>
        {offer.inclusions.length > 0 && <ul>{offer.inclusions.map((item) => <li key={item}><Check size={16} aria-hidden="true" /><span>{item}</span></li>)}</ul>}
        {offer.qualification && <p className="lt-zimbabwe-qualification">{offer.qualification}</p>}
        <div className="lt-zimbabwe-offer-action"><ReviewLink secondary={index > 0}>{offer.cta}</ReviewLink></div>
      </article>)}</div>
    </RouteSection>

    <RouteSection tone="navy" id="digital-foundation">
      <RouteHeading title="Modernise the foundation first. Then add intelligence." description="AI works best when the information underneath it is current, controlled and easy to verify. LionTech starts with the digital foundation, then adds automation only where it has a clear job to do." />
      <div className="lt-zimbabwe-foundation">
        <div className="lt-zimbabwe-future-image"><HarareImage name="harare-digital-future" alt="Modern glass office building and palm trees in Harare" />
          <div className="lt-zimbabwe-network" aria-hidden="true"><svg viewBox="0 0 600 600" preserveAspectRatio="none"><path d="M50 100H280L410 180H560M80 290H240L410 180M240 290L360 390H540M60 500H290L360 390M280 100V55" /></svg>{zimbabweNodes.map((node, index) => <span className={`lt-zimbabwe-node lt-zimbabwe-node-${index}`} key={node}>{node}</span>)}</div>
        </div>
        <ol className="lt-zimbabwe-architecture" aria-label="From existing business to operational outcome">{zimbabweArchitecture.map((item, index) => <li key={item}><span>{item}</span>{index < zimbabweArchitecture.length - 1 && <ArrowDown size={19} aria-hidden="true" />}</li>)}</ol>
      </div>
    </RouteSection>

    <RouteSection id="delivery">
      <RouteHeading title="We do not need the keys to your entire business." description="Access is limited to what the agreed work actually requires." />
      <ol className="lt-zimbabwe-delivery">{zimbabweDelivery.map(([title, description]) => <li key={title}><h3>{title}</h3><p>{description}</p></li>)}</ol>
      <div className="lt-zimbabwe-security-layout"><div className="lt-zimbabwe-security-copy">{zimbabweSecurity.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div>
        <aside className="lt-large-panel lt-zimbabwe-controls"><LockKeyhole size={28} aria-hidden="true" /><h3>Controls agreed for the scope</h3><p>These controls are available or required depending on the work. They are not certifications.</p><ul>{zimbabweControls.map((item) => <li key={item}><Check size={16} aria-hidden="true" /><span>{item}</span></li>)}</ul></aside>
      </div>
    </RouteSection>

    <RouteSection tone="soft" id="platform-proof">
      <RouteHeading title="We build systems, not just reports." description="Before we ask an organisation to change anything, we show what we observed, where we found it and why we think it deserves attention. Implementation is then scoped separately." />
      <div className="lt-route-platform-grid">{platforms.map((platform) => <RouteLink className="lt-route-platform-card" href={platform.href} key={platform.name}><div className="lt-route-platform-image"><img src={platform.image} alt={`${platform.name} platform preview`} width={640} height={360} loading="lazy" decoding="async" /></div><div><h3>{platform.name}</h3><p>{platform.description}</p><span>View platform <ArrowRight size={15} aria-hidden="true" /></span></div></RouteLink>)}</div>
      <div className="lt-zimbabwe-company-record"><strong>{company.legalName}</strong><span>Registered in England and Wales</span><span>Company No. {company.companiesHouseNumber}</span><span>United Kingdom</span></div>
    </RouteSection>

    <RouteSection id="zimbabwe-faq">
      <RouteHeading title="Questions before we begin" description="Straight answers about the review, access and delivery." />
      <div className="lt-zimbabwe-faq">{zimbabweFaq.map((item) => <details key={item.question}><summary>{item.question}<Plus size={20} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div>
    </RouteSection>

    <RouteSection tone="soft">
      <RouteHeading eyebrow="UK COMPANY · ZIMBABWE ENGAGEMENT" title="UK delivery. Zimbabwe business context." />
      <div className="lt-zimbabwe-support">{zimbabweSupport.map(([title, description]) => <FeatureCard title={title} key={title}><p>{description}</p></FeatureCard>)}</div>
    </RouteSection>

    <section className="lt-zimbabwe-closing" id="zimbabwe-final-cta" aria-labelledby="zw-closing-title">
      <HarareImage name="harare-infrastructure-cta" alt="Harare city road, pedestrian bridge and commercial skyline" fullBleed />
      <div className="lt-zimbabwe-scrim" aria-hidden="true" />
      <div className="lt-shell lt-zimbabwe-closing-inner"><MarketMark /><h2 id="zw-closing-title">Your organisation does not need more AI hype.</h2><p>It needs to know what is worth fixing, what is worth automating and what should remain under human control.</p><strong>Start with the US$750 Corporate AI &amp; Digital Readiness Review</strong><div className="lt-route-actions"><ReviewLink /><a className="lt-button lt-button-secondary" href={`mailto:${zimbabwe.email}`}>Email LionTech</a></div></div>
    </section>

    <RouteSection id="zimbabwe-enquiry" className="lt-zimbabwe-enquiry-section">
      <RouteHeading title="Request a Zimbabwe Executive Review" description="Share the business details first. LionTech will review the enquiry and reply by email. Scope and payment arrangements are agreed after qualification." />
      <ZimbabweEnquiryForm />
    </RouteSection>
  </div>;
}
