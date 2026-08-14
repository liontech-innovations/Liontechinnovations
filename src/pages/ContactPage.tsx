import { Mail, MapPin, ShieldCheck } from 'lucide-react';
import { SnapshotEnquiryForm } from '../components/SnapshotEnquiryForm';
import { PageHero, RouteHeading, RouteSection } from '../components/sections/RoutePageSections';
import { company } from '../content/company';
import { snapshotOffer } from '../content/offers';
import { breadcrumbSchema } from '../lib/schema';
import { useSeo } from '../lib/seo';

export function ContactPage() {
  useSeo({ title: 'Request an AI Visibility Snapshot | LionTech', description: 'Send LionTech the minimum business details needed to review a founding AI Visibility Snapshot request.', path: '/contact', schema: breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }]) });

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
            <div className="lt-route-contact-card">
              <Mail size={20} aria-hidden="true" />
              <div><span>Email</span><a href={`mailto:${company.email}`}>{company.email}</a></div>
            </div>
            <div className="lt-route-contact-card">
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
