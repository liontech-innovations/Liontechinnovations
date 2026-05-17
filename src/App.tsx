import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Cpu,
  ExternalLink,
  FileText,
  Globe2,
  Layers,
  Mail,
  MapPin,
  Menu,
  Server,
  Shield,
  X,
  Zap,
} from 'lucide-react';
import IntakeDialog from './components/IntakeDialog';

const navLinks = [
  { label: 'Services', id: 'services' },
  { label: 'Platforms', id: 'platforms' },
  { label: 'Company', id: 'company' },
  { label: 'Contact', id: 'contact' },
];

const techStack = ['Anthropic', 'NVIDIA', 'Vercel', 'AWS', 'Supabase', 'Stripe', 'OpenAI', 'Microsoft Azure', 'Google Cloud', 'GitHub'];

const platformLinks = {
  clearVisa: 'https://clearvisas.co.uk',
  calcFee: 'https://www.calcfee.com/',
  bundleBase: 'https://bundlebase.com',
};

function useHashRoute() {
  const [route, setRoute] = useState(() => window.location.hash.replace('#', '') || '/');

  useEffect(() => {
    const handler = () => setRoute(window.location.hash.replace('#', '') || '/');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return route;
}

function scrollToSection(id: string) {
  const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (window.location.hash && window.location.hash !== '#/' && !window.location.hash.startsWith('#/#')) {
    window.location.hash = '/';
    window.setTimeout(scroll, 100);
    return;
  }

  scroll();
}

const BrandMark = ({ name }: { name: string }) => {
  const common = { 'aria-hidden': true };

  switch (name) {
    case 'Anthropic':
      return <svg viewBox="0 0 32 32" {...common}><path d="M16 5 27 27h-5.2l-2.2-4.7h-7.2L10.2 27H5L16 5Zm-1.8 13.2h3.6L16 13.7l-1.8 4.5Z" /></svg>;
    case 'NVIDIA':
      return <svg viewBox="0 0 32 32" {...common}><path d="M4 10.3c6.7-2.9 13.8-3 21.5-.2-5.9.4-10.3 2.8-13.2 7.1 2.7-1.8 5.4-2.5 8.2-2.2 2.3.2 4.6 1.1 7.1 2.6-3.2 3.2-6.8 4.8-10.7 4.7-4.8-.1-8.8-2.5-12-7.2 3.5.6 6.4.2 8.9-1.2-3.2-.9-6.4-.8-9.8.3v-3.9Zm13.8 6.3a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Z" /></svg>;
    case 'Vercel':
      return <svg viewBox="0 0 32 32" {...common}><path d="M16 6 30 27H2L16 6Z" /></svg>;
    case 'AWS':
      return <svg viewBox="0 0 42 32" {...common}><path d="M7.8 9.5 3.4 22.6h3.4l.8-2.8h4.4l.8 2.8h3.5L11.8 9.5h-4Zm.6 7.6 1.4-4.6 1.4 4.6H8.4Zm12.8 5.5-2.9-8.2h3.1l1.2 4.3 1.4-4.3h2.6l1.4 4.3 1.2-4.3h3l-2.9 8.2h-2.7l-1.4-4.1-1.4 4.1h-2.6Z" /><path d="M10 26c7 3.2 14.2 3.1 21.7-.4.8-.4 1.5.7.7 1.3-6.2 4.6-15.3 4.9-23.1.8-.9-.5-.2-2.1.7-1.7Z" /></svg>;
    case 'Supabase':
      return <svg viewBox="0 0 32 32" {...common}><path d="M17.1 2.8 5 18.1c-.9 1.2-.1 2.9 1.4 2.9h8.1l-1.6 8.1c-.3 1.5 1.6 2.4 2.5 1.1L27 14.6c.9-1.2.1-2.8-1.4-2.8h-8l1.1-7.9c.2-1.4-1.7-2.3-2.6-1.1Z" /></svg>;
    case 'Stripe':
      return <svg viewBox="0 0 44 32" {...common}><path d="M5 21.5v-4.1c2 1.1 4.3 1.7 6.2 1.7 1.3 0 2.1-.3 2.1-1.1 0-2.3-8.2-1.4-8.2-7 0-3.3 2.7-5.3 7.1-5.3 1.8 0 3.6.3 5.4 1v4c-1.7-.9-3.8-1.4-5.5-1.4-1.2 0-1.9.3-1.9 1 0 2.2 8.2 1.1 8.2 7 0 3.4-2.8 5.4-7.4 5.4-2.2 0-4.4-.4-6-1.2Zm16.5-14.9h4.9v15.7h-4.9V6.6Zm7.5 0h4.6l.2 1.5c1-1.2 2.5-1.8 4.1-1.8v4.6c-1.8-.1-3.2.3-4 1.1v10.3H29V6.6Z" /></svg>;
    case 'OpenAI':
      return <svg viewBox="0 0 32 32" {...common}><path d="M15.9 2.8a5.8 5.8 0 0 1 5.2 3.2 6 6 0 0 1 6.7 8.5 5.9 5.9 0 0 1-3.7 9.4 5.8 5.8 0 0 1-9.4 4.2 6 6 0 0 1-8.6-6.6 5.9 5.9 0 0 1 .5-10.2 5.9 5.9 0 0 1 9.3-8.5Zm3.2 5.4-7.2 4.1v8.2l2.4 1.4v-8.1l7.2-4.1-2.4-1.5Zm-5.8 16.3a3.6 3.6 0 0 0 5.9-2.7l-7.1-4.1-2.4 1.4 7 4.1-3.4 1.3Zm9-4a3.7 3.7 0 0 0 2.5-6.1l-7 4.1v2.8l7-4.1-2.5 3.3ZM8.6 13.8a3.6 3.6 0 0 0-1 6.4l7.1-4.1v-2.8l-7 4.1.9-3.6Z" /></svg>;
    case 'Microsoft Azure':
      return <svg viewBox="0 0 36 32" {...common}><path d="M15.2 3.2 5 25.7h8.9l13.6-22.5H15.2Zm3.6 12.7-5 9.8h16.1L18.8 15.9Z" /></svg>;
    case 'Google Cloud':
      return <svg viewBox="0 0 42 32" {...common}><path d="M27.9 12.2a8.8 8.8 0 0 0-16.4-2.4 7.4 7.4 0 0 0 .7 14.8h15a6.3 6.3 0 0 0 .7-12.4Zm-16 8.2a3.3 3.3 0 0 1 .3-6.6h1.7l.5-1.6a5.6 5.6 0 0 1 10.7 1.6v1.7h1.9a3.2 3.2 0 1 1 0 6.4H11.9Z" /></svg>;
    case 'GitHub':
      return <svg viewBox="0 0 32 32" {...common}><path d="M16 3.4a12.8 12.8 0 0 0-4 25c.6.1.8-.2.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 .1.7 2.6 3.3 1.9.1-.8.4-1.3.7-1.6-2.6-.3-5.4-1.3-5.4-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.8 1.2 3.1 0 4.4-2.8 5.4-5.4 5.7.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6a12.8 12.8 0 0 0-4-25Z" /></svg>;
    default:
      return null;
  }
};

const Navbar = ({ onStartIntake }: { onStartIntake: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 36);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (id: string) => {
    setMobileMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <nav className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'border-b border-[#C8A24A]/14 bg-[#020817]/90 py-2.5 shadow-[0_14px_44px_rgba(0,0,0,0.28)] backdrop-blur-xl' : 'border-b border-white/8 bg-[#020817]/30 py-3.5 backdrop-blur-[3px]'}`}>
      <div className="relative mx-auto flex max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#/" className="flex min-w-0 max-w-[calc(100%-3.5rem)] items-center no-underline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/assets/liontechlogo.png" alt="LionTech Innovations" className="nav-logo" />
        </a>
        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <button key={link.id} onClick={() => handleNav(link.id)} className="border-none bg-transparent text-[11px] font-bold uppercase tracking-[0.22em] text-white/74 transition hover:text-[#C8A24A]">{link.label}</button>
          ))}
          <button onClick={onStartIntake} className="btn-primary whitespace-nowrap rounded-md px-6 py-2.5 text-[11px] uppercase tracking-[0.16em]">Submit a Brief</button>
        </div>
        <button type="button" aria-label="Toggle navigation" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)} className="mobile-menu-button">
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="absolute left-0 top-full w-full border-t border-[#C8A24A]/12 bg-[#020817]/96 px-4 py-3 shadow-2xl backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-[1320px] space-y-1.5">
            {navLinks.map((link) => (
              <button key={link.id} onClick={() => handleNav(link.id)} className="block w-full rounded-md border-none bg-transparent px-3 py-2.5 text-left text-[12px] font-bold uppercase tracking-[0.18em] text-white/78 transition hover:bg-white/8 hover:text-[#C8A24A]">{link.label}</button>
            ))}
            <button onClick={() => { setMobileMenuOpen(false); onStartIntake(); }} className="btn-primary mt-2 w-full rounded-md px-6 py-3 text-[11px] uppercase tracking-[0.16em]">Submit a Brief</button>
          </div>
        </div>
      )}
    </nav>
  );
};

const TrustStrip = () => (
  <div className="trust-strip hero-trust mx-auto w-full min-w-0 max-w-[1320px] overflow-hidden rounded-md border border-[#C8A24A]/14 bg-[#020817]/76 px-3 py-2.5 shadow-[0_14px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-4">
    <div className="flex min-w-0 items-center gap-3 overflow-x-auto [scrollbar-width:none] md:gap-3.5 [&::-webkit-scrollbar]:hidden">
      <div className="shrink-0 border-r border-[#C8A24A]/18 pr-4 text-[8px] font-bold uppercase leading-snug tracking-[0.16em] text-white/48 sm:text-[9px]">Trusted by<br />modern businesses</div>
      {techStack.map((name) => (
        <div key={name} className="brand-logo" aria-label={name} title={name}>
          <BrandMark name={name} />
          <span className="brand-wordmark">{name}</span>
        </div>
      ))}
    </div>
  </div>
);

const Hero = ({ onStartIntake }: { onStartIntake: () => void }) => (
  <section className="relative isolate min-h-[600px] overflow-hidden bg-[#071426] pt-20 text-white lg:pt-24">
    <img src="https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=90&w=2400&auto=format&fit=crop" alt="Sunny London skyline with Big Ben and Westminster" className="hero-bg absolute inset-0 z-0 h-full w-full object-cover" style={{ objectPosition: 'center 42%' }} />
    <div className="hero-overlay absolute inset-0 z-[1]" />
    <div className="hero-bottom-fade absolute inset-x-0 bottom-0 z-[1] h-72" />
    <div className="relative z-10 mx-auto flex min-h-[510px] w-full min-w-0 max-w-[1320px] flex-col justify-center px-4 pb-6 sm:px-6 lg:px-8">
      <div className="hero-copy w-full max-w-[620px] pt-5 sm:pt-7">
        <span className="inline-flex max-w-full items-center rounded-md border border-[#C8A24A]/24 bg-[#020817]/34 px-3.5 py-1.5 text-[8px] font-bold uppercase leading-5 tracking-[0.16em] text-white/82 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-md sm:text-[9px] sm:tracking-[0.28em]">London-Based Digital Infrastructure Company</span>
        <h1 className="mt-5 text-[34px] font-black leading-[1.06] tracking-[-0.018em] text-white sm:text-[46px] md:text-[54px] lg:text-[60px]">
          AI Systems.<span className="block">Automation.</span><span className="block text-gradient-gold">Scalable Platforms.</span>
        </h1>
        <p className="mt-5 max-w-[330px] text-[15px] font-medium leading-7 text-white/82 sm:max-w-xl sm:text-base">LionTech Innovations builds production-ready AI systems, automation workflows, and SaaS platforms for businesses that need reliable digital infrastructure.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button onClick={onStartIntake} className="btn-primary w-full rounded-md px-6 py-3 text-[11px] uppercase tracking-[0.16em] sm:w-auto sm:min-w-[190px]">Submit a Brief <ArrowRight size={15} /></button>
          <button onClick={() => scrollToSection('services')} className="btn-secondary-dark w-full rounded-md px-6 py-3 text-[11px] uppercase tracking-[0.16em] sm:w-auto sm:min-w-[155px]">View Services</button>
        </div>
      </div>
      <div className="mt-auto pt-7"><TrustStrip /></div>
    </div>
  </section>
);

const Stats = () => {
  const stats = [
    { icon: <BarChart3 size={26} />, value: '99.9%', label: 'Uptime Target', copy: 'Enterprise-grade reliability and infrastructure.' },
    { icon: <Shield size={26} />, value: '24/7', label: 'System Monitoring', copy: 'Continuous monitoring and rapid response.' },
    { icon: <Cpu size={26} />, value: '3+', label: 'Live Platforms', copy: 'Production systems delivering real business value.' },
    { icon: <Globe2 size={26} />, value: 'UK', label: 'Registered Company', copy: 'London-based with global client delivery.' },
  ];

  return (
    <section className="stats-band border-y border-[#C8A24A]/10 bg-[#020817]">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 divide-y divide-white/8 px-4 py-5 sm:px-6 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4 lg:px-8">
        {stats.map((item) => (
          <div key={item.label} className="flex gap-4 py-5 md:px-5 lg:px-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#C8A24A]/16 bg-white/5 text-[#C8A24A] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">{item.icon}</div>
            <div><p className="text-3xl font-black leading-none tracking-[-0.035em] text-white">{item.value}</p><p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/74">{item.label}</p><p className="mt-2 max-w-[210px] text-[13px] leading-5 text-white/56">{item.copy}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Platforms = () => {
  const projects = [
    { icon: <Shield size={22} />, title: 'ClearVisa UK', url: platformLinks.clearVisa, category: 'Compliance SaaS', description: 'AI-powered immigration risk analysis platform helping users assess UK visa refusal risk with confidence.' },
    { icon: <Building2 size={22} />, title: 'CalcFee', url: platformLinks.calcFee, category: 'FinTech Tool', description: 'Smart financial calculator platform with real-time data processing and premium PDF reporting.' },
    { icon: <FileText size={22} />, title: 'BundleBase', url: platformLinks.bundleBase, category: 'Legal Tech', description: 'Document bundling system for UK legal professionals. Automated PDF generation and structured output.' },
  ];

  return (
    <section id="platforms" className="scroll-target section-dark-connected py-14 text-white sm:py-18">
      <div className="mx-auto grid max-w-[1320px] gap-8 px-4 sm:px-6 lg:grid-cols-[0.68fr_1.32fr] lg:px-8">
        <div><span className="section-eyebrow text-[#C8A24A]">Our Live Platforms</span><h2 className="mt-3 max-w-md text-3xl font-black tracking-[-0.04em] text-white sm:text-[34px]">Real Systems. Real Impact.</h2><p className="mt-4 max-w-md text-[15px] leading-6 text-white/62">Production-ready platforms solving real business problems across compliance, finance, legal, and automation.</p></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {projects.map((project) => (
            <a key={project.title} href={project.url} target="_blank" rel="noopener noreferrer" className="dark-card group flex min-h-[220px] flex-col p-5 no-underline">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-md border border-[#C8A24A]/16 bg-white/5 text-[#C8A24A]">{project.icon}</span><span className="rounded-full bg-[#C8A24A]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#D8BE74]">{project.category}</span></div>
                <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-white">Live <span className="h-2 w-2 rounded-full bg-emerald-400" /></span>
              </div>
              <h3 className="text-lg font-bold tracking-[-0.03em] text-white">{project.title}</h3>
              <p className="mt-2.5 grow text-[14px] leading-6 text-white/62">{project.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#C8A24A] transition group-hover:text-white">Visit Platform <ArrowUpRight size={13} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    { icon: <Globe2 size={25} />, title: 'Corporate Website Design', description: 'Fast, credible web presences built for trust, clarity, and high-value enquiries.' },
    { icon: <Layers size={25} />, title: 'Landing Pages & Funnels', description: 'Focused conversion journeys with clear messaging, analytics-ready structure, and polished execution.' },
    { icon: <Cpu size={25} />, title: 'AI Automation Systems', description: 'Workflow automation that reduces manual processing, improves response times, and scales operations.' },
    { icon: <Zap size={25} />, title: 'SaaS Platform Development', description: 'Production-ready software platforms with secure architecture and intuitive user flows.' },
    { icon: <Server size={25} />, title: 'API & Payment Infrastructure', description: 'Reliable integrations, payment flows, data pipelines, and backend services for real business use.' },
    { icon: <BarChart3 size={25} />, title: 'Technical SEO & Performance', description: 'Search-ready structure, Core Web Vitals discipline, and performance tuning for faster growth.' },
  ];

  return (
    <section id="services" className="scroll-target section-light-connected py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl"><span className="section-eyebrow text-[#A77F26]">Our Capabilities</span><h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-[#071426] sm:text-[40px]">Enterprise-Grade Solutions</h2><p className="mt-4 text-base leading-7 text-[#455A6E]">We architect and deploy robust digital systems that solve complex business challenges and drive operational efficiency.</p></div>
        <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.title} className="light-card group p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-[#F3EAD1] text-[#A77F26] transition group-hover:bg-[#071426] group-hover:text-[#C8A24A]">{service.icon}</div>
              <h3 className="text-lg font-bold tracking-[-0.03em] text-[#071426]">{service.title}</h3>
              <p className="mt-2.5 text-[14px] leading-6 text-[#455A6E]">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Company = () => {
  const highlights = ['Structured UK digital infrastructure company', 'Enterprise-grade design, automation, and SaaS delivery', 'Reliability-minded architecture for production systems', 'London-based with UK and global client delivery'];

  return (
    <section id="company" className="scroll-target section-light-muted py-16 sm:py-20">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-9 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div><span className="section-eyebrow text-[#A77F26]">Company</span><h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.045em] text-[#071426] sm:text-[40px]">Engineered for Serious Business</h2><p className="mt-4 max-w-2xl text-base leading-7 text-[#455A6E]">Lion Tech Innovations Ltd builds high-performance systems, from websites and SaaS platforms to automation workflows and AI-powered business tools, for organisations that need operational reliability and premium execution.</p></div>
        <div className="grid gap-3.5 sm:grid-cols-2">
          {highlights.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-md border border-[#E2D3A6] bg-[#FBFAF6] p-4"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F3EAD1] text-[#A77F26]"><CheckCircle2 size={14} /></span><p className="text-[14px] font-semibold leading-6 text-[#071426]">{item}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = ({ onStartIntake }: { onStartIntake: () => void }) => (
  <section id="contact" className="scroll-target section-contact-connected relative overflow-hidden py-16 text-white sm:py-20">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C8A24A]/50 to-transparent" />
    <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
      <span className="section-eyebrow text-[#C8A24A]">Contact</span>
      <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-white sm:text-[40px]">Ready to Build Something Serious?</h2>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/64">Schedule a consultation to discuss your digital infrastructure, automation, or platform requirements.</p>
      <div className="mx-auto mt-9 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        <a href="mailto:contact@liontechinnovations.co.uk" className="dark-card p-5 text-left no-underline"><Mail className="mb-4 text-[#C8A24A]" size={22} /><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/44">Email</p><p className="mt-2 break-words text-[15px] font-semibold text-white">contact@liontechinnovations.co.uk</p></a>
        <div className="dark-card p-5 text-left"><MapPin className="mb-4 text-[#C8A24A]" size={22} /><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/44">Location</p><p className="mt-2 text-[15px] font-semibold text-white">London, United Kingdom</p></div>
      </div>
      <button type="button" onClick={onStartIntake} className="btn-primary mt-8 rounded-md px-7 py-3 text-[11px] uppercase tracking-[0.16em] no-underline">Submit a Brief <ArrowRight size={15} /></button>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-[#E2D3A6] bg-white py-8">
    <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-7 px-4 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:px-8">
      <div><a href="#/" className="flex items-center no-underline"><img src="/assets/liontechlogo.png" alt="LionTech Innovations" className="footer-logo" /></a><p className="mt-3 max-w-xs text-[13px] leading-6 text-[#455A6E]">Digital infrastructure, automation systems, SaaS platforms, and AI-powered business tools.</p></div>
      <div><h3 className="footer-heading">Solutions</h3><div className="mt-4 space-y-3">{['Web Infrastructure', 'AI Automation', 'SaaS Platforms', 'Payment Systems'].map((item) => <button key={item} onClick={() => scrollToSection('services')} className="footer-link block">{item}</button>)}</div></div>
      <div><h3 className="footer-heading">Platforms</h3><div className="mt-4 space-y-3">{[['ClearVisa UK', platformLinks.clearVisa], ['CalcFee', platformLinks.calcFee], ['BundleBase', platformLinks.bundleBase]].map(([label, href]) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="footer-link inline-flex items-center gap-1.5 no-underline">{label}<ExternalLink size={12} /></a>)}</div></div>
      <div><h3 className="footer-heading">Contact</h3><div className="mt-4 space-y-3 text-sm text-[#455A6E]"><a href="mailto:contact@liontechinnovations.co.uk" className="footer-link flex items-center gap-2 no-underline"><Mail size={15} /><span className="break-all">contact@liontechinnovations.co.uk</span></a><p className="flex items-center gap-2"><MapPin size={15} className="text-[#5B76FF]" />London, United Kingdom</p></div></div>
    </div>
    <div className="mx-auto mt-8 flex max-w-[1320px] flex-col gap-3 border-t border-[#E2D3A6] px-4 pt-5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#455A6E]/68 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
      <p>&copy; {new Date().getFullYear()} Lion Tech Innovations Ltd. All rights reserved.</p>
      <div className="flex gap-5"><a href="#/privacy-policy" className="text-[#455A6E]/68 no-underline transition hover:text-[#0B1F35]">Privacy Policy</a><a href="#/terms-and-conditions" className="text-[#455A6E]/68 no-underline transition hover:text-[#0B1F35]">Terms & Conditions</a></div>
      <p>Company registered in England &amp; Wales &mdash; No. 17068390</p>
    </div>
  </footer>
);

const LegalPage = ({ title, children, onStartIntake }: { title: string; children: React.ReactNode; onStartIntake: () => void }) => {
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <Navbar onStartIntake={onStartIntake} />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <a href="#/" className="mb-6 inline-flex text-sm font-semibold text-[#5B76FF] no-underline hover:underline">&larr; Back to Home</a>
        <h1 className="text-4xl font-black tracking-[-0.04em] text-[#0B1F35]">{title}</h1>
        <p className="mt-2 text-sm text-[#455A6E]">Last updated: March 2026</p>
        <div className="legal-content mt-10">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

const PrivacyPolicy = ({ onStartIntake }: { onStartIntake: () => void }) => (
  <LegalPage title="Privacy Policy" onStartIntake={onStartIntake}>
    <h2>1. Introduction</h2><p>Lion Tech Innovations Ltd ("we", "our", "us"), registered in England and Wales (Company No. 17068390), is committed to protecting the privacy of individuals who visit our website and use our services.</p>
    <h2>2. Information We Collect</h2><p>We may collect contact information, technical data, usage data, and business information you provide when discussing potential projects or engagements.</p>
    <h2>3. How We Use Your Information</h2><p>We use personal data to respond to enquiries, provide requested services, improve our website, send relevant communications where permitted, and comply with legal obligations.</p>
    <h2>4. Data Sharing</h2><p>We do not sell personal data. We may share information with trusted service providers who help operate our website and business, or where required by law.</p>
    <h2>5. Data Retention</h2><p>We retain personal data only for as long as necessary for the purposes for which it was collected, or as required by applicable law.</p>
    <h2>6. Your Rights</h2><p>Under UK GDPR, you have rights to access, correct, delete, restrict, object to processing, request portability, and lodge a complaint with the Information Commissioner's Office.</p>
    <h2>7. Cookies</h2><p>Our website may use cookies to enhance browsing and measure website usage. You can control cookie preferences through your browser settings.</p>
    <h2>8. Contact Us</h2><p>For questions regarding this Privacy Policy, contact us at <strong>contact@liontechinnovations.co.uk</strong>. Address: London, United Kingdom.</p>
  </LegalPage>
);

const TermsAndConditions = ({ onStartIntake }: { onStartIntake: () => void }) => (
  <LegalPage title="Terms & Conditions" onStartIntake={onStartIntake}>
    <h2>1. Introduction</h2><p>These Terms and Conditions govern your use of the Lion Tech Innovations Ltd website and our provision of services.</p>
    <h2>2. Services</h2><p>Lion Tech Innovations Ltd provides digital infrastructure, web development, automation, and related technology services on a project basis.</p>
    <h2>3. Intellectual Property</h2><p>All content on this website is the property of Lion Tech Innovations Ltd or its licensors and is protected by applicable intellectual property laws.</p>
    <h2>4. Client Obligations</h2><p>Clients agree to provide accurate information, respond to project requests in a timely manner, ensure rights to supplied materials, and pay agreed fees.</p>
    <h2>5. Limitation of Liability</h2><p>To the maximum extent permitted by law, Lion Tech Innovations Ltd shall not be liable for indirect, incidental, or consequential damages arising from website or service use.</p>
    <h2>6. Warranties</h2><p>Services are delivered with reasonable skill and care in accordance with applicable project agreements and industry standards.</p>
    <h2>7. Governing Law</h2><p>These Terms and Conditions are governed by the laws of England and Wales.</p>
    <h2>8. Contact</h2><p>For questions about these Terms and Conditions, contact us at <strong>contact@liontechinnovations.co.uk</strong>. Address: London, United Kingdom.</p>
  </LegalPage>
);

const HomePage = ({ onStartIntake }: { onStartIntake: () => void }) => (
  <div className="min-h-screen bg-[#F4F7FB]">
    <Navbar onStartIntake={onStartIntake} />
    <Hero onStartIntake={onStartIntake} />
    <Stats />
    <Platforms />
    <Services />
    <Company />
    <Contact onStartIntake={onStartIntake} />
    <Footer />
  </div>
);

export default function App() {
  const route = useHashRoute();
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const openIntake = () => setIsIntakeOpen(true);

  return (
    <div className="selection:bg-[#6EA8FF]/30 selection:text-[#0B1F35]">
      {route === '/privacy-policy' && <PrivacyPolicy onStartIntake={openIntake} />}
      {route === '/terms-and-conditions' && <TermsAndConditions onStartIntake={openIntake} />}
      {route !== '/privacy-policy' && route !== '/terms-and-conditions' && <HomePage onStartIntake={openIntake} />}
      <IntakeDialog open={isIntakeOpen} onClose={() => setIsIntakeOpen(false)} />
    </div>
  );
}
