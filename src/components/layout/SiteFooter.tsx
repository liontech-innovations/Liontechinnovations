import { ChevronDown, ExternalLink, Mail, MapPin } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { company } from '../../content/company';
import { RouteLink } from '../ui/RouteLink';
import { zimbabwe } from '../../content/zimbabwe';
import { tenderHubVisible } from '../../content/tenders';
import '../../styles/dev-fix.css';

function FooterGroup({ title, label, compact, open, companyGroup = false, children }: { title: string; label: string; compact: boolean; open: boolean; companyGroup?: boolean; children: ReactNode }) {
  if (!compact) return companyGroup ? <div className="lt-unified-footer-company"><h2>{title}</h2>{children}</div> : <nav aria-label={label}><h2>{title}</h2>{children}</nav>;
  return <nav aria-label={label} className={companyGroup ? 'lt-unified-footer-company' : undefined}><details open={open}><summary><h2>{title}</h2><ChevronDown size={14} aria-hidden="true" /></summary><div className={`lt-footer-group-body${companyGroup ? ' lt-footer-company-links' : ''}`}>{children}</div></details></nav>;
}

export function SiteFooter({ market, compact = false }: { market?: 'zimbabwe'; compact?: boolean }) {
  const isZimbabwe = market === 'zimbabwe';
  const email = isZimbabwe ? zimbabwe.email : company.email;
  const [groupsOpen, setGroupsOpen] = useState(true);
  useEffect(() => {
    if (!compact) return;
    const media = window.matchMedia('(min-width: 768px)');
    const update = () => setGroupsOpen(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [compact]);
  const devFix = !isZimbabwe && <div className="lt-shell lt-dev-fix-footer"><p>Broken website, app, form, Stripe flow, or AI-built MVP?</p><RouteLink className="lt-button lt-button-primary" href="/dev-fix">Request a Dev Fix</RouteLink></div>;
  return (
    <footer className={`lt-unified-footer${compact ? ' lt-tender-footer' : ''}`}>
      {!compact && devFix}
      <div className="lt-shell lt-unified-footer-grid">
        <div className="lt-unified-footer-brand">
          <RouteLink href="/" aria-label="LionTech Innovations home"><img src={company.logo} alt="LionTech Innovations" className="footer-logo" /></RouteLink>
          <p>AI business readiness, implementation systems, SaaS platforms and production-grade digital infrastructure.</p>
          <span>Evidence-led · Human-reviewed · UK-based</span>
          {compact && devFix}
        </div>

        <FooterGroup title="Solutions" label="Footer solutions" compact={compact} open={groupsOpen}>
          {isZimbabwe ? <RouteLink href={zimbabwe.enquiryHref}>Corporate Readiness Review</RouteLink> : <RouteLink href="/ai-visibility-snapshot">AI Visibility Snapshot</RouteLink>}
          <RouteLink href="/readiness-fix-sprint">Readiness Fix Sprint</RouteLink>
          <RouteLink href="/monitoring">Monitoring</RouteLink>
          <RouteLink href="/ai-business-readiness">Business Readiness</RouteLink>
          {!isZimbabwe && tenderHubVisible && <RouteLink href="/tenders">Tender Support</RouteLink>}
        </FooterGroup>

        <FooterGroup title="Platforms" label="Footer platforms" compact={compact} open={groupsOpen}>
          <RouteLink href="https://clearvisas.co.uk">ClearVisa UK <ExternalLink size={12} aria-hidden="true" /></RouteLink>
          <RouteLink href="https://www.calcfee.com/">CalcFee <ExternalLink size={12} aria-hidden="true" /></RouteLink>
          <RouteLink href="/lead-recovery">Lead Recovery</RouteLink>
          <RouteLink href="/careops/lost-enquiry-recovery">CareOps</RouteLink>
        </FooterGroup>

        <FooterGroup title="Company" label="Footer company" companyGroup compact={compact} open={groupsOpen}>
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
