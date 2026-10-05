import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import {
  BuyerBehaviour,
  CompanyBrain,
  CompanyTrust,
  ContactSection,
  ContinuityOffers,
  CredibilityMetrics,
  EvidenceFindings,
  FiveGates,
  FixSprint,
  PlatformShowcase,
  SnapshotOffer,
} from '../components/sections/RestoredHomeSections';
import { StackStrip } from '../components/sections/StackStrip';
import { DevFixPackages } from '../components/sections/DevFixPackages';
import { RouteLink } from '../components/ui/RouteLink';
import { homepage } from '../content/homepage';
import { routeSeo } from '../content/routeSeo';
import { useSeo } from '../lib/seo';
import '../styles/dev-request.css';
import '../styles/dev-fix.css';

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
    <section className="lt-hero lt-dev-fix-home-hero">
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
          <RouteLink className="lt-button lt-button-primary" href="/dev-fix">{homepage.hero.primaryCta}<ArrowRight size={17} aria-hidden="true" /></RouteLink>
          <RouteLink className="lt-button lt-button-secondary" href="/#packages">
            {homepage.hero.secondaryCta}
          </RouteLink>
        </div>
        <ul className="lt-dev-fix-hero-bullets">{homepage.hero.bullets.map((line) => <li key={line}><Check size={16} aria-hidden="true" /><span>{line}</span></li>)}</ul>
        <div className="lt-hero-proof">
          <span>{homepage.hero.trust}</span>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  useSeo(routeSeo['/']);

  return (
    <>
      <CinematicHero />
      <StackStrip />
      <DevFixPackages />
      <CredibilityMetrics />
      <BuyerBehaviour />
      <FiveGates />
      <SnapshotOffer />
      <EvidenceFindings />
      <FixSprint />
      <ContinuityOffers />
      <PlatformShowcase />
      <CompanyBrain />
      <CompanyTrust />
      <ContactSection />
    </>
  );
}
