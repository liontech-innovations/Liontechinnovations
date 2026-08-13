import { useEffect, useRef, useState } from 'react';
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
import { PrimaryCta } from '../components/ui/PrimaryCta';
import { RouteLink } from '../components/ui/RouteLink';
import { company } from '../content/company';
import { homepage } from '../content/homepage';
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
