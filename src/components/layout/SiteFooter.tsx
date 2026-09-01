import { ExternalLink, Mail, MapPin } from 'lucide-react';
import { company } from '../../content/company';
import { RouteLink } from '../ui/RouteLink';
import { zimbabwe } from '../../content/zimbabwe';

export function SiteFooter({ market }: { market?: 'zimbabwe' }) {
  const isZimbabwe = market === 'zimbabwe';
  const email = isZimbabwe ? zimbabwe.email : company.email;
  return (
    <footer className="lt-unified-footer">
      <div className="lt-shell lt-unified-footer-grid">
        <div className="lt-unified-footer-brand">
          <RouteLink href="/" aria-label="LionTech Innovations home"><img src={company.logo} alt="LionTech Innovations" className="footer-logo" /></RouteLink>
          <p>AI business readiness, implementation systems, SaaS platforms and production-grade digital infrastructure.</p>
          <span>Evidence-led · Human-reviewed · UK-based</span>
        </div>

        <nav aria-label="Footer solutions">
          <h2>Solutions</h2>
          {isZimbabwe ? <RouteLink href={zimbabwe.enquiryHref}>Corporate Readiness Review</RouteLink> : <RouteLink href="/ai-visibility-snapshot">AI Visibility Snapshot</RouteLink>}
          <RouteLink href="/readiness-fix-sprint">Readiness Fix Sprint</RouteLink>
          <RouteLink href="/monitoring">Monitoring</RouteLink>
          <RouteLink href="/ai-business-readiness">Business Readiness</RouteLink>
        </nav>

        <nav aria-label="Footer platforms">
          <h2>Platforms</h2>
          <RouteLink href="https://clearvisas.co.uk">ClearVisa UK <ExternalLink size={12} aria-hidden="true" /></RouteLink>
          <RouteLink href="https://www.calcfee.com/">CalcFee <ExternalLink size={12} aria-hidden="true" /></RouteLink>
          <RouteLink href="/lead-recovery">Lead Recovery</RouteLink>
          <RouteLink href="/careops/lost-enquiry-recovery">CareOps</RouteLink>
        </nav>

        <div className="lt-unified-footer-company">
          <h2>Company</h2>
          <RouteLink href="/methodology">Methodology</RouteLink>
          <RouteLink href="/industries">Industry Guides</RouteLink>
          <RouteLink href="/zimbabwe">Zimbabwe → Corporate AI &amp; Digital Modernisation</RouteLink>
          <RouteLink href="/company-brain">Company Brain</RouteLink>
          <RouteLink href="/about">About</RouteLink>
          <RouteLink href={isZimbabwe ? zimbabwe.enquiryHref : '/contact'}>Contact</RouteLink>
          <a href={`mailto:${email}`}><Mail size={15} aria-hidden="true" /> <span>{email}</span></a>
          <p><MapPin size={15} aria-hidden="true" /> {isZimbabwe ? 'United Kingdom · Zimbabwe engagements' : company.location}</p>
        </div>
      </div>

      <div className="lt-shell lt-unified-footer-bottom">
        <p>© {new Date().getFullYear()} {company.legalName}. All rights reserved.</p>
        <div><RouteLink href="/privacy-policy">Privacy Policy</RouteLink><RouteLink href="/terms-and-conditions">Terms and Conditions</RouteLink></div>
        <p><RouteLink href={company.companiesHouseUrl}>{company.legalName} · Registered in England and Wales · Company no. {company.companiesHouseNumber}</RouteLink></p>
      </div>
    </footer>
  );
}
