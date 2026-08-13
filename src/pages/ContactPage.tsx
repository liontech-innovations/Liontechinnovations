import { SnapshotEnquiryForm } from '../components/SnapshotEnquiryForm';
import { PageIntro } from '../components/sections/PageIntro';
import { company } from '../content/company';
import { breadcrumbSchema } from '../lib/schema';
import { useSeo } from '../lib/seo';

export function ContactPage() {
  useSeo({ title: 'Request an AI Visibility Snapshot | LionTech', description: 'Send LionTech the minimum business details needed to review a founding AI Visibility Snapshot request.', path: '/contact', schema: breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }]) });
  return <><PageIntro eyebrow="REQUEST A FOUNDING SNAPSHOT" title="Tell us which business AI should understand." description="A short enquiry first. Full onboarding only begins after the Snapshot scope is agreed." /><section className="lt-section lt-contact-section" id="snapshot-enquiry"><div className="lt-shell lt-contact-layout"><div><h2>AI Visibility Snapshot</h2><p>Founding price: £395. Delivery within 48 hours after completed onboarding and business verification.</p><p>Prefer email? <a href={`mailto:${company.email}`}>{company.email}</a></p></div><SnapshotEnquiryForm /></div></section></>;
}
