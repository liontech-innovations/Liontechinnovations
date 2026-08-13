import { ArrowRight, Check, Search, ShieldCheck, Waypoints } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FinalCta } from '../components/sections/FinalCta';
import { StackStrip } from '../components/sections/StackStrip';
import { PrimaryCta } from '../components/ui/PrimaryCta';
import { RouteLink } from '../components/ui/RouteLink';
import { company } from '../content/company';
import { homepage } from '../content/homepage';
import { fiveGates } from '../content/methodology';
import { companyBrainOffer, fixSprintOffer, monitoringOffer, snapshotOffer } from '../content/offers';
import { platforms } from '../content/platforms';
import { organizationSchema, snapshotServiceSchema } from '../lib/schema';
import { useSeo } from '../lib/seo';

function CinematicHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduceMotion, setReduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduceMotion) {
      video.pause();
      video.currentTime = 0;
    } else {
      void video.play().catch(() => undefined);
    }
  }, [reduceMotion]);

  return (
    <section className="lt-hero">
      <video
        ref={videoRef}
        className="lt-hero-video"
        autoPlay={!reduceMotion}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/assets/liontech-hero-poster.jpg"
        aria-hidden="true"
      >
        <source src="/assets/liontech-hero.webm" type="video/webm" />
        <source src="/assets/liontech-hero.mp4" type="video/mp4" />
      </video>
      <div className="lt-hero-scrim" aria-hidden="true" />
      <div className="lt-shell lt-hero-inner">
        <p className="lt-eyebrow">{homepage.hero.eyebrow}</p>
        <h1>{homepage.hero.title}</h1>
        <p className="lt-hero-copy">{homepage.hero.description}</p>
        <div className="lt-hero-actions">
          <PrimaryCta />
          <RouteLink className="lt-button lt-button-secondary" href="/methodology">
            {homepage.hero.secondaryCta}
          </RouteLink>
        </div>
        <div className="lt-hero-proof">
          <span>{homepage.hero.trust}</span>
          <span>{homepage.hero.foundingNote}</span>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  useSeo({
    title: 'LionTech AI Business Readiness | See What AI Says About Your Business',
    description: company.description,
    path: '/',
    schema: [organizationSchema, snapshotServiceSchema],
  });

  return (
    <>
      <CinematicHero />
      <StackStrip />

      <section className="lt-section lt-market-shift">
        <div className="lt-shell lt-shift-layout">
          <div>
            <h2>{homepage.shift.title}</h2>
            <p>{homepage.shift.description}</p>
          </div>
          <div className="lt-buyer-path" aria-label="How buyers use AI">
            {['Discover', 'Compare', 'Verify', 'Contact'].map((step, index) => (
              <div key={step}>
                <span>{step}</span>
                {index < 3 && <ArrowRight aria-hidden="true" size={18} strokeWidth={1.5} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lt-section lt-method-section" id="how-it-works">
        <div className="lt-shell">
          <h2>{homepage.methodologyTitle}</h2>
          <p className="lt-section-lede">
            The Five Gates Method turns inconsistent AI output into a practical readiness profile.
          </p>
          <ol className="lt-gates-flow">
            {fiveGates.map((gate) => (
              <li key={gate.name}>
                <span>{gate.name}</span>
                <p>{gate.question}</p>
              </li>
            ))}
          </ol>
          <RouteLink className="lt-text-link" href="/methodology">
            Read the methodology <ArrowRight aria-hidden="true" size={16} />
          </RouteLink>
        </div>
      </section>

      <section className="lt-section lt-snapshot-section" id="services">
        <div className="lt-shell lt-offer-layout">
          <div className="lt-offer-price">
            <p>Founding price</p>
            <strong>{snapshotOffer.foundingPrice}</strong>
            <span>{snapshotOffer.standardPrice} standard after the first 10 clients</span>
          </div>
          <div className="lt-offer-content">
            <p className="lt-eyebrow">AI VISIBILITY SNAPSHOT</p>
            <h2>Evidence first. Priority fixes next.</h2>
            <p>{snapshotOffer.shortScope}</p>
            <ul className="lt-check-list">
              {snapshotOffer.inclusions.map((item) => (
                <li key={item}><Check aria-hidden="true" size={17} />{item}</li>
              ))}
            </ul>
            <p className="lt-guarantee">Minimum-5 Guarantee: {snapshotOffer.guarantee}</p>
            <PrimaryCta />
          </div>
        </div>
      </section>

      <section className="lt-section lt-evidence-section">
        <div className="lt-shell">
          <div className="lt-evidence-heading">
            <p>Illustrative finding types</p>
            <h2>Evidence, not theory.</h2>
            <span>These are examples of the categories LionTech reviews. They are not claimed client outcomes.</span>
          </div>
          <div className="lt-evidence-list">
            {homepage.evidenceTypes.map((item, index) => (
              <div key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lt-section lt-fix-section">
        <div className="lt-shell lt-fix-layout">
          <div className="lt-fix-statement">
            <h2>Finding the gap is useful. Fixing it is where the value begins.</h2>
          </div>
          <div className="lt-fix-details">
            <strong>{fixSprintOffer.price}</strong>
            <p>{fixSprintOffer.scope} Work can cover websites, source-of-truth content, structured data, trust evidence and action paths.</p>
            <p>{fixSprintOffer.duration}. {fixSprintOffer.credit}</p>
            <RouteLink className="lt-button lt-button-secondary" href="/readiness-fix-sprint">Explore the Fix Sprint</RouteLink>
          </div>
        </div>
      </section>

      <section className="lt-section lt-continuity-section">
        <div className="lt-shell">
          <h2>Stay accurate. Become actionable.</h2>
          <div className="lt-continuity-grid">
            <article>
              <ShieldCheck aria-hidden="true" size={27} strokeWidth={1.5} />
              <h3>Stay accurate</h3>
              <p>{monitoringOffer.scope}</p>
              <strong>{monitoringOffer.price}</strong>
              <RouteLink className="lt-text-link" href="/monitoring">Explore monitoring</RouteLink>
            </article>
            <article>
              <Waypoints aria-hidden="true" size={27} strokeWidth={1.5} />
              <h3>Become actionable</h3>
              <p>Agent Action Sprints improve quote, booking, enquiry, availability or information paths when a documented business case exists.</p>
              <span>£1,500-£3,500 per workflow</span>
              <RouteLink className="lt-text-link" href="/ai-business-readiness">See the readiness path</RouteLink>
            </article>
          </div>
        </div>
      </section>

      <section className="lt-section lt-platforms-section" id="platforms">
        <div className="lt-shell">
          <h2>Built and operated by LionTech</h2>
          <p className="lt-section-lede">LionTech does not merely produce strategy reports. LionTech ships production systems.</p>
          <div className="lt-platform-grid">
            {platforms.map((platform) => (
              <article key={platform.name}>
                <img src={platform.image} alt={`${platform.name} platform preview`} loading="lazy" />
                <div>
                  <h3>{platform.name}</h3>
                  <p>{platform.description}</p>
                  <RouteLink className="lt-text-link" href={platform.href}>View platform <ArrowRight aria-hidden="true" size={15} /></RouteLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lt-section lt-brain-section">
        <div className="lt-shell lt-brain-layout">
          <div className="lt-brain-symbol" aria-hidden="true"><Search size={52} strokeWidth={1} /></div>
          <div>
            <p>{companyBrainOffer.stage}</p>
            <h2>When your business is ready to bring AI inside.</h2>
            <p>{companyBrainOffer.scope}</p>
            <RouteLink className="lt-button lt-button-secondary" href="/company-brain">Explore Company Brain</RouteLink>
          </div>
        </div>
      </section>

      <section className="lt-section lt-why-section" id="company">
        <div className="lt-shell">
          <h2>Why LionTech</h2>
          <div className="lt-principles-grid">
            {[
              ['Evidence before hype', 'Observed outputs, sources and factual checks come before recommendations.'],
              ['Real implementation capability', 'The team that identifies a gap can also ship the approved fix.'],
              ['Model-independent thinking', 'The method focuses on business readiness across changing AI systems.'],
              ['Human-reviewed findings', 'Material findings are reviewed before they reach the client.'],
              ['Privacy and access discipline', 'Testing and implementation use approved access methods and scoped data.'],
              ['Ready for what comes next', 'AI discovery today, clear agent action paths when the business case is proven.'],
            ].map(([title, description]) => (
              <article key={title}><h3>{title}</h3><p>{description}</p></article>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
