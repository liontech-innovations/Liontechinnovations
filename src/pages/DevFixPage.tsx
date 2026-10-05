import { ArrowRight, Mail } from 'lucide-react';
import { DevRequestForm } from '../components/DevRequestForm';
import { DevFixPackages } from '../components/sections/DevFixPackages';
import { FeatureCard, PageHero, RouteHeading, RouteSection } from '../components/sections/RoutePageSections';
import { RouteLink } from '../components/ui/RouteLink';
import { DEV_FIX_PAYMENT_LINKS, devFixBoundaries, devFixPrinciples, devFixServices, devFixSteps } from '../content/devFix';
import { routeSeo } from '../content/routeSeo';
import { useSeo } from '../lib/seo';
import '../styles/dev-fix.css';
import '../styles/dev-request.css';

export function DevFixPage() {
  useSeo(routeSeo['/dev-fix']);

  return (
    <div className="lt-dev-fix-page">
      <PageHero eyebrow="LIONTECH DEV FIX DESK" title="Broken website, app, form, payment flow, or AI-built MVP?" description="I fix broken digital revenue points in 48–72 hours for founders, SMEs, and AI builders.">
        <RouteLink className="lt-button lt-button-primary" href="/dev-fix#request">Request a Dev Fix<ArrowRight size={17} aria-hidden="true" /></RouteLink>
        <RouteLink className="lt-button lt-button-secondary" href={DEV_FIX_PAYMENT_LINKS.faultFindCall}>Book Fault-Find Call — £150</RouteLink>
      </PageHero>
      <RouteSection className="lt-dev-fix-opening">
        <p>If your website is losing enquiries, your Stripe checkout is failing, your Vercel deployment is broken, your Supabase setup is throwing errors, your contact form is not sending, or your AI-built app is stuck before launch, LionTech can help.</p>
      </RouteSection>
      <RouteSection>
        <RouteHeading eyebrow="WHAT I FIX" title="Fast fixes. Clear scope. No long agency process." />
        <div className="lt-route-feature-grid">{devFixServices.map((item) => <FeatureCard title={item.title} key={item.title}><p>{item.description}</p></FeatureCard>)}</div>
      </RouteSection>
      <DevFixPackages />
      <RouteSection>
        <RouteHeading title="How it works" />
        <ol className="lt-dev-fix-steps">{devFixSteps.map((step, index) => <li key={step}><span className="lt-kicker">{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol>
        <p className="lt-dev-fix-note">For urgent work, include as much detail as possible: website/app URL, screenshot, error message, stack/tools, and what should happen instead.</p>
      </RouteSection>
      <RouteSection>
        <RouteHeading title="Built for fast fixes, not endless projects." />
        <ul className="lt-dev-fix-list">{devFixBoundaries.map((line) => <li key={line}>{line}</li>)}</ul>
        <p className="lt-dev-fix-note">If it can be scoped, fixed, tested, and handed over quickly, it fits. If it needs months of product development, it does not fit this desk.</p>
      </RouteSection>
      <RouteSection>
        <RouteHeading title="What LionTech focuses on" />
        <ul className="lt-dev-fix-list">{devFixPrinciples.map((line) => <li key={line}>{line}</li>)}</ul>
      </RouteSection>
      <RouteSection id="request" className="lt-route-contact-section">
        <RouteHeading title="Request a Dev Fix" />
        <div className="lt-route-contact-layout">
          <DevRequestForm variant="dev-fix" />
          <aside className="lt-route-contact-aside lt-dev-aside">
            <RouteHeading eyebrow="CLEAR SCOPE. PRACTICAL IMPLEMENTATION." title="Start with the problem" />
            <p>Work starts after payment, access, and scope confirmation.</p>
            <div className="lt-standard-card lt-route-contact-card"><Mail size={20} aria-hidden="true" /><div><span>Prefer email?</span><a href="mailto:admin@liontechinnovations.co.uk">admin@liontechinnovations.co.uk</a></div></div>
            <p>Looking for an AI Visibility Snapshot? <RouteLink href="/contact#snapshot-enquiry">Request a Founding Snapshot</RouteLink>.</p>
          </aside>
        </div>
      </RouteSection>
    </div>
  );
}
