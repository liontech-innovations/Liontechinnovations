import { company } from '../../content/company';
import { ExternalLink, Mail, MapPin } from 'lucide-react';
import { RouteLink } from '../ui/RouteLink';

export function SiteFooter() {
  return (
    <footer className="lt-footer-restored border-t border-[#E2D3A6] bg-white py-8">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-7 px-4 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <RouteLink href="/" className="flex items-center no-underline" aria-label="LionTech Innovations home"><img src={company.logo} alt="LionTech Innovations" className="footer-logo" /></RouteLink>
          <p className="mt-3 max-w-xs text-[13px] leading-6 text-[#455A6E]">AI business readiness, implementation systems, SaaS platforms, and production-grade digital infrastructure.</p>
        </div>
        <div>
          <h2 className="footer-heading">Solutions</h2>
          <div className="mt-4 grid gap-3">
            <RouteLink className="footer-link" href="/ai-visibility-snapshot">AI Visibility</RouteLink>
            <RouteLink className="footer-link" href="/methodology">How It Works</RouteLink>
            <RouteLink className="footer-link" href="/ai-business-readiness">Services</RouteLink>
            <RouteLink className="footer-link" href="/monitoring">Monitoring</RouteLink>
          </div>
        </div>
        <div>
          <h2 className="footer-heading">Platforms</h2>
          <div className="mt-4 grid gap-3">
            <RouteLink className="footer-link inline-flex items-center gap-1.5" href="https://clearvisas.co.uk">ClearVisa UK <ExternalLink size={12} /></RouteLink>
            <RouteLink className="footer-link inline-flex items-center gap-1.5" href="https://www.calcfee.com/">CalcFee <ExternalLink size={12} /></RouteLink>
            <RouteLink className="footer-link" href="/lead-recovery">Lead Recovery</RouteLink>
            <RouteLink className="footer-link" href="/careops/lost-enquiry-recovery">CareOps</RouteLink>
          </div>
        </div>
        <div>
          <h2 className="footer-heading">Company</h2>
          <div className="mt-4 grid gap-3 text-sm text-[#455A6E]">
            <RouteLink className="footer-link" href="/company-brain">Company Brain</RouteLink>
            <RouteLink className="footer-link" href="/about">About</RouteLink>
            <RouteLink className="footer-link" href="/contact">Contact</RouteLink>
            <a href={`mailto:${company.email}`} className="footer-link flex items-center gap-2 no-underline"><Mail size={15} /><span className="break-all">{company.email}</span></a>
            <p className="flex items-center gap-2"><MapPin size={15} className="text-[#5B76FF]" />{company.location}</p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-[1320px] flex-col gap-3 border-t border-[#E2D3A6] px-4 pt-5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#455A6E]/68 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>© {new Date().getFullYear()} {company.legalName}. All rights reserved.</p>
        <div className="flex gap-5"><RouteLink href="/privacy-policy" className="no-underline transition hover:text-[#0B1F35]">Privacy Policy</RouteLink><RouteLink href="/terms-and-conditions" className="no-underline transition hover:text-[#0B1F35]">Terms and Conditions</RouteLink></div>
        <p>Company registered in England and Wales. No. {company.companiesHouseNumber}</p>
      </div>
    </footer>
  );
}
