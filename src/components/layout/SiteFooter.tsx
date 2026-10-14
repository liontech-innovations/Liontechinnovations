import { ChevronDown, ExternalLink, Mail, MapPin } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { company } from '../../content/company';
import { RouteLink } from '../ui/RouteLink';
import { zimbabwe } from '../../content/zimbabwe';
import { tenderHubVisible } from '../../content/tenders';
import '../../styles/site-footer.css';

function FooterGroup({ title, label, open, companyGroup = false, children }: { title: string; label: string; open: boolean; companyGroup?: boolean; children: ReactNode }) {
  return <nav aria-label={label} className={companyGroup ? 'lt-unified-footer-company' : undefined}><details open={open}><summary><h2>{title}</h2><ChevronDown size={14} aria-hidden="true" /></summary><div className={`lt-footer-group-body${companyGroup ? ' lt-footer-company-links' : ''}`}>{children}</div></details></nav>;
}

export function SiteFooter({ market }: { market?: 'zimbabwe' }) {
  const isZimbabwe = market === 'zimbabwe';
  const email = isZimbabwe ? zimbabwe.email : company.email;
  const [groupsOpen, setGroupsOpen] = useState(true);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const update = () => setGroupsOpen(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const devFix = !isZimbabwe && <div className="lt-shell lt-dev-fix-footer"><p>Broken website, app, form, Stripe flow, or AI-built MVP?</p><RouteLink className="lt-button lt-button-primary" href="/dev-fix">Request a Dev Fix</RouteLink></div>;
  return (
    <footer className="lt-unified-footer lt-compact-footer">
      <div className="lt-shell lt-unified-footer-grid">
        <div className="lt-unified-footer-brand">
          <RouteLink href="/" aria-label="LionTech Innovations home"><img src={company.logo} alt="LionTech Innovations" className="footer-logo" /></RouteLink>
          <p>AI business readiness, implementation systems, SaaS platforms and production-grade digital infrastructure.</p>
          <span>Evidence-led · Human-reviewed · UK-based</span>
          {devFix}
        </div>

        <FooterGroup title="Solutions" label="Footer solutions" open={groupsOpen}>
          {!isZimbabwe && tenderHubVisible && <RouteLink href="/tenders">Tender Support</RouteLink>}
          {isZimbabwe ? <RouteLink href={zimbabwe.enquiryHref}>Corporate Readiness Review</RouteLink> : <RouteLink href="/ai-visibility-snapshot">AI Visibility Snapshot</RouteLink>}
          <RouteLink href="/readiness-fix-sprint">Readiness Fix Sprint</RouteLink>
          <RouteLink href="/monitoring">Monitoring</RouteLink>
          <RouteLink href="/ai-business-readiness">Business Readiness</RouteLink>
        </FooterGroup>

        <FooterGroup title="Platforms" label="Footer platforms" open={groupsOpen}>
          <RouteLink href="https://clearvisas.co.uk">ClearVisa UK <ExternalLink size={12} aria-hidden="true" /></RouteLink>
          <RouteLink href="https://www.calcfee.com/">CalcFee <ExternalLink size={12} aria-hidden="true" /></RouteLink>
          <RouteLink href="/lead-recovery">Lead Recovery</RouteLink>
          <RouteLink href="/careops/lost-enquiry-recovery">CareOps</RouteLink>
        </FooterGroup>

        <FooterGroup title="Company" label="Footer company" companyGroup open={groupsOpen}>
          <RouteLink href="/methodology">Methodology</RouteLink>
          <RouteLink href="/industries">Industry Guides</RouteLink>
          <RouteLink href="/zimbabwe">Zimbabwe → Corporate AI &amp; Digital Modernisation</RouteLink>
          <RouteLink href="/company-brain">Company Brain</RouteLink>
          <RouteLink href="/about">About</RouteLink>
          <RouteLink href={isZimbabwe ? zimbabwe.enquiryHref : '/contact'}>Contact</RouteLink>
          <a href={`mailto:${email}`}><Mail size={15} aria-hidden="true" /> <span>{email}</span></a>
          <p><MapPin size={15} aria-hidden="true" /> {isZimbabwe ? 'United Kingdom · Zimbabwe engagements' : company.location}</p>
        </FooterGroup>
      </div>

      <div className="lt-shell lt-unified-footer-bottom">
        <p>© {new Date().getFullYear()} {company.legalName}. All rights reserved.</p>
        <div><RouteLink href="/privacy-policy">Privacy Policy</RouteLink><RouteLink href="/terms-and-conditions">Terms and Conditions</RouteLink></div>
        <p><RouteLink href={company.companiesHouseUrl}>{company.legalName} · Registered in England and Wales · Company no. {company.companiesHouseNumber}</RouteLink></p>
      </div>
    </footer>
  );
}
