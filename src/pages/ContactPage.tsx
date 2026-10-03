import { Mail, MapPin, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DevRequestForm } from '../components/DevRequestForm';
import { RouteLink } from '../components/ui/RouteLink';
import { SnapshotEnquiryForm } from '../components/SnapshotEnquiryForm';
import { PageHero, RouteHeading, RouteSection } from '../components/sections/RoutePageSections';
import { company } from '../content/company';
import { snapshotOffer } from '../content/offers';
import { routeSeo } from '../content/routeSeo';
import { useSeo } from '../lib/seo';
import '../styles/dev-request.css';

export function ContactPage() {
  useSeo(routeSeo['/contact']);
  // Match the prerendered /contact markup before selecting the campaign anchor.
  const [snapshot, setSnapshot] = useState(false);
  useEffect(() => {
    const update = () => setSnapshot(window.location.hash === '#snapshot-enquiry');
    update();
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    return () => { window.removeEventListener('hashchange', update); window.removeEventListener('popstate', update); };
  }, []);

  if (!snapshot) return (
    <>
      <PageHero compact eyebrow="DEV & AUTOMATION" title="Need Something Built or Fixed?" description="Tell us what you need. LionTech handles focused development, app fixes, integrations, AI automation and small MVP builds." />
      <RouteSection className="lt-route-contact-section">
        <div className="lt-route-contact-layout">
          <DevRequestForm />
          <aside className="lt-route-contact-aside lt-dev-aside">
            <RouteHeading eyebrow="CLEAR SCOPE. PRACTICAL IMPLEMENTATION." title="Start with the problem" description="Existing apps and vibe-coded builds are welcome. A broken form, an unfinished feature or a workflow that needs connecting is enough to start." />
            <p>We aim to assess the scope promptly and identify the next practical step. There is no obligation to proceed, and no full technical specification is needed.</p>
            <p>Scope and cost are agreed before any development work begins.</p>
            <div className="lt-standard-card lt-route-contact-card"><Mail size={20} aria-hidden="true" /><div><span>Prefer email?</span><a href={`mailto:${company.email}`}>{company.email}</a></div></div>
            <p>Looking for an AI Visibility Snapshot? <RouteLink href="/contact#snapshot-enquiry">Request a Founding Snapshot</RouteLink>.</p>
          </aside>
        </div>
      </RouteSection>
    </>
  );

  return (
    <>
      <PageHero compact eyebrow="REQUEST A FOUNDING SNAPSHOT" title="Tell us which business AI should understand." description="A short enquiry first. Full onboarding only begins after the Snapshot scope is agreed." />
      <RouteSection className="lt-route-contact-section">
        <div className="lt-route-contact-layout">
          <div className="lt-route-form-anchor" id="snapshot-enquiry">
            <SnapshotEnquiryForm />
          </div>
          <aside className="lt-route-contact-aside">
            <RouteHeading eyebrow="AI VISIBILITY SNAPSHOT" title="Start with the minimum details" description={`${snapshotOffer.foundingPrice} founding price. ${snapshotOffer.turnaround}.`} />
            <div className="lt-standard-card lt-route-contact-card">
              <Mail size={20} aria-hidden="true" />
              <div><span>Email</span><a href={`mailto:${company.email}`}>{company.email}</a></div>
            </div>
            <div className="lt-standard-card lt-route-contact-card">
              <MapPin size={20} aria-hidden="true" />
              <div><span>Location</span><strong>{company.location}</strong></div>
            </div>
            <div className="lt-route-privacy-note">
              <ShieldCheck size={22} aria-hidden="true" />
              <div><strong>Minimum information first</strong><p>LionTech uses these details to review and respond to the request. The form includes explicit consent and a direct Privacy Policy link.</p></div>
            </div>
          </aside>
        </div>
      </RouteSection>
    </>
  );
}
