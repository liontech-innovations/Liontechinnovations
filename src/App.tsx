import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Cpu,
  ExternalLink,
  Globe2,
  Mail,
  MapPin,
  Menu,
  Server,
  Shield,
  ShieldCheck,
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
  leadRecovery: 'https://leadrecovery.co.uk',
};

const routeMeta = {
  '/': {
    title: 'Lion Tech Innovations | UK AI Infrastructure Operator',
    description: 'Lion Tech Innovations Ltd is a UK AI infrastructure company building operational automation systems, SaaS platforms, and enterprise-grade digital workflows.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Lion Tech Innovations',
    description: 'How Lion Tech Innovations Ltd collects, uses, and protects personal data, including AI intake conversation data, under UK GDPR.',
  },
  '/terms-and-conditions': {
    title: 'Terms & Conditions | Lion Tech Innovations',
    description: 'The terms governing use of the Lion Tech Innovations website, AI intake assistant, and engagement process under English and Welsh law.',
  },
  '/uk-ai-infrastructure': {
    title: 'UK AI Infrastructure | Lion Tech Innovations',
    description: 'Lion Tech Innovations Ltd is a UK AI infrastructure operator building operational automation systems, SaaS platforms, and enterprise-grade digital workflows. London-based, selectively engaged.',
  },
  '/saas-platform-development': {
    title: 'SaaS Platform Development | Lion Tech Innovations',
    description: 'We architect and ship production SaaS for regulated UK markets. The patterns behind ClearVisa UK and CalcFee — applied to your domain.',
  },
  '/ai-intake-systems': {
    title: 'AI Intake Systems | Lion Tech Innovations',
    description: "Real conversational intake powered by streaming LLMs. The architecture behind LionTech's own AI intake, available for your domain.",
  },
  '/lead-recovery': {
    title: 'Emergency Roofing Lead Capture System — From £495 | Lion Tech Innovations',
    description: 'Capture emergency roofing leads via SMS. Live in 5 working days. £495 setup + £199/mo managed, or £1,995 one-off. Built for UK roofing companies.',
  },
  '/roofing-brief': {
    title: 'Roofing Website Build Brief | Lion Tech Innovations',
    description: 'Submit the build details for your Roofing Lead Recovery website after checkout: contact details, service areas, phone numbers, branding links, and launch notes.',
  },
};

type Route = keyof typeof routeMeta;

function getRoute(): Route {
  if (
    window.location.pathname === '/privacy-policy' ||
    window.location.pathname === '/terms-and-conditions' ||
    window.location.pathname === '/uk-ai-infrastructure' ||
    window.location.pathname === '/saas-platform-development' ||
    window.location.pathname === '/ai-intake-systems' ||
    window.location.pathname === '/lead-recovery' ||
    window.location.pathname === '/roofing-brief'
  ) {
    return window.location.pathname;
  }

  return '/';
}

function navigateTo(path: Route) {
  if (window.location.pathname !== path || window.location.hash.length > 0) {
    window.history.pushState(null, '', path);
  }
  window.dispatchEvent(new Event('popstate'));
}

function useHistoryRoute() {
  const [route, setRoute] = useState<Route>(() => getRoute());

  useEffect(() => {
    const handler = () => setRoute(getRoute());
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  return route;
}

function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', description);
  }, [title, description]);
}

function setMeta(selector: string, attr: string, value: string) {
  const tag = document.querySelector(selector);
  if (tag) tag.setAttribute(attr, value);
}

function scrollToSection(id: string) {
  const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (window.location.pathname !== '/') {
    navigateTo('/');
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
        <a href="/" className="flex min-w-0 max-w-[calc(100%-3.5rem)] items-center no-underline" onClick={(event) => { event.preventDefault(); navigateTo('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
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
      <div className="shrink-0 border-r border-[#C8A24A]/18 pr-4 text-[8px] font-bold uppercase leading-snug tracking-[0.16em] text-white/48 sm:text-[9px]">Our Stack</div>
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
    { title: 'ClearVisa UK', url: platformLinks.clearVisa, category: 'Compliance SaaS', image: '/assets/clearvisa-platform-preview.jpg', description: 'AI-powered immigration risk analysis platform helping users assess UK visa refusal risk with confidence.' },
    { title: 'CalcFee', url: platformLinks.calcFee, category: 'FinTech Tool', image: '/assets/calcfee-platform-preview.jpg', description: 'Smart financial calculator platform with real-time data processing and premium PDF reporting.' },
    { title: 'Lead Recovery', url: '/lead-recovery', category: 'Emergency Lead Infrastructure', image: '/assets/lead-recovery-platform-preview.jpg', description: 'Premium emergency roofing websites with qualified SMS lead alerts and postcode-based qualification systems.', internal: true },
  ];

  return (
    <section id="platforms" className="scroll-target section-dark-connected py-14 text-white sm:py-18">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl"><span className="section-eyebrow text-[#C8A24A]">Our Live Platforms</span><h2 className="mt-3 max-w-md text-3xl font-black tracking-[-0.04em] text-white sm:text-[34px]">Our Platforms</h2><p className="mt-4 max-w-2xl text-[15px] leading-6 text-white/62">Production-ready platforms solving real business problems across compliance, finance, lead infrastructure, and automation.</p></div>
        <div className="mx-auto mt-8 grid max-w-[1080px] grid-cols-1 gap-4 md:grid-cols-3">
          {projects.map((project) => (
            <a key={project.title} href={project.url} target={project.internal ? undefined : '_blank'} rel={project.internal ? undefined : 'noopener noreferrer'} onClick={project.internal ? (event) => { event.preventDefault(); navigateTo('/lead-recovery'); } : undefined} className="platform-card group no-underline">
              <div className="platform-preview">
                <img src={project.image} alt={`${project.title} platform preview`} loading="lazy" />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="mb-3 flex items-center justify-between gap-2.5">
                  <span className="platform-badge">{project.category}</span>
                  <span className="platform-live">Live <span /></span>
                </div>
                <h3 className="text-lg font-black tracking-[-0.035em] text-white">{project.title}</h3>
                <p className="mt-2.5 grow text-[13px] leading-5 text-white/66">{project.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#C8A24A] transition group-hover:text-white">Visit Platform <ArrowUpRight size={12} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    { icon: <Zap size={25} />, title: 'SaaS Platform Development', href: '/saas-platform-development' as Route, description: 'Production-ready software platforms with secure architecture, intuitive flows, and operational reliability — the stack behind ClearVisa UK and CalcFee.' },
    { icon: <Cpu size={25} />, title: 'AI Automation Systems', href: '/ai-intake-systems' as Route, description: 'Workflow automation, intake systems, and operational AI integrations that reduce manual processing and scale operations.' },
    { icon: <Server size={25} />, title: 'API & Payment Infrastructure', description: 'Reliable integrations, payment flows, webhooks, and backend services for production business systems.' },
  ];

  return (
    <section id="services" className="scroll-target section-light-connected py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl"><span className="section-eyebrow text-[#C8A24A]">Our Capabilities</span><h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-white sm:text-[40px]">Enterprise-Grade Solutions</h2><p className="mt-4 text-base leading-7 text-white/72">We architect and deploy robust digital systems that solve complex business challenges and drive operational efficiency.</p></div>
        <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            service.href ? (
              <a
                key={service.title}
                href={service.href}
                onClick={(event) => { event.preventDefault(); navigateTo(service.href); }}
                className="light-card group relative block p-5 no-underline transition hover:border-[#C8A24A]/36"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-[#C8A24A]/14 bg-white/5 text-[#C8A24A] transition group-hover:border-[#C8A24A]/28 group-hover:bg-[#C8A24A]/8">{service.icon}</div>
                <h3 className="text-lg font-bold tracking-[-0.03em] text-white">{service.title}</h3>
                <p className="mt-2.5 text-[14px] leading-6 text-white/72">{service.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#C8A24A]">
                  Read more <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </a>
            ) : (
              <div key={service.title} className="light-card group p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-[#C8A24A]/14 bg-white/5 text-[#C8A24A] transition group-hover:border-[#C8A24A]/28 group-hover:bg-[#C8A24A]/8">{service.icon}</div>
                <h3 className="text-lg font-bold tracking-[-0.03em] text-white">{service.title}</h3>
                <p className="mt-2.5 text-[14px] leading-6 text-white/72">{service.description}</p>
              </div>
            )
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
        <div><span className="section-eyebrow text-[#C8A24A]">Company</span><h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.045em] text-white sm:text-[40px]">Engineered for Serious Business</h2><p className="mt-4 max-w-2xl text-base leading-7 text-white/72">Lion Tech Innovations Ltd builds high-performance systems, from websites and SaaS platforms to automation workflows and AI-powered business tools, for organisations that need operational reliability and premium execution.</p></div>
        <div className="grid gap-3.5 sm:grid-cols-2">
          {highlights.map((item) => (
            <div key={item} className="company-card flex items-start gap-3 p-4"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#C8A24A]/14 bg-white/5 text-[#C8A24A]"><CheckCircle2 size={14} /></span><p className="text-[14px] font-semibold leading-6 text-white/72">{item}</p></div>
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
      <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-white sm:text-[40px]">Begin an Engagement</h2>
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
      <div><a href="/" className="flex items-center no-underline" onClick={(event) => { event.preventDefault(); navigateTo('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><img src="/assets/liontechlogo.png" alt="LionTech Innovations" className="footer-logo" /></a><p className="mt-3 max-w-xs text-[13px] leading-6 text-[#455A6E]">Digital infrastructure, automation systems, SaaS platforms, and AI-powered business tools.</p></div>
      <div><h3 className="footer-heading">Solutions</h3><div className="mt-4 space-y-3">{['Web Infrastructure', 'AI Automation', 'SaaS Platforms', 'Payment Systems'].map((item) => <button key={item} onClick={() => scrollToSection('services')} className="footer-link block">{item}</button>)}</div></div>
      <div><h3 className="footer-heading">Platforms</h3><div className="mt-4 space-y-3">{[['ClearVisa UK', platformLinks.clearVisa], ['CalcFee', platformLinks.calcFee], ['Lead Recovery', platformLinks.leadRecovery]].map(([label, href]) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="footer-link inline-flex items-center gap-1.5 no-underline">{label}<ExternalLink size={12} /></a>)}</div></div>
      <div><h3 className="footer-heading">Contact</h3><div className="mt-4 space-y-3 text-sm text-[#455A6E]"><a href="mailto:contact@liontechinnovations.co.uk" className="footer-link flex items-center gap-2 no-underline"><Mail size={15} /><span className="break-all">contact@liontechinnovations.co.uk</span></a><p className="flex items-center gap-2"><MapPin size={15} className="text-[#5B76FF]" />London, United Kingdom</p></div></div>
    </div>
    <div className="mx-auto mt-8 flex max-w-[1320px] flex-col gap-3 border-t border-[#E2D3A6] px-4 pt-5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#455A6E]/68 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
      <p>&copy; {new Date().getFullYear()} Lion Tech Innovations Ltd. All rights reserved.</p>
      <div className="flex gap-5"><a href="/privacy-policy" onClick={(event) => { event.preventDefault(); navigateTo('/privacy-policy'); }} className="text-[#455A6E]/68 no-underline transition hover:text-[#0B1F35]">Privacy Policy</a><a href="/terms-and-conditions" onClick={(event) => { event.preventDefault(); navigateTo('/terms-and-conditions'); }} className="text-[#455A6E]/68 no-underline transition hover:text-[#0B1F35]">Terms & Conditions</a></div>
      <p>Company registered in England &amp; Wales &mdash; No. 17068390</p>
    </div>
  </footer>
);

const LegalPage = ({ title, children, onStartIntake }: { title: string; children: React.ReactNode; onStartIntake: () => void }) => {
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <div className="min-h-screen bg-[#020817]">
      <Navbar onStartIntake={onStartIntake} />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <a href="/" onClick={(event) => { event.preventDefault(); navigateTo('/'); }} className="mb-6 inline-flex text-sm font-semibold text-[#C8A24A] no-underline transition hover:text-[#D4B05A] hover:underline">&larr; Back to Home</a>
        <h1 className="text-4xl font-black tracking-[-0.04em] text-white">{title}</h1>
        <p className="mt-2 text-sm text-white/56">Last updated: May 2026</p>
        <div className="legal-content mt-10">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

const CapabilityPage = ({ eyebrow, title, intro, children, onStartIntake }: { eyebrow: string; title: string; intro: string; children: React.ReactNode; onStartIntake: () => void }) => {
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <div className="min-h-screen bg-[#020817]">
      <Navbar onStartIntake={onStartIntake} />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <a href="/" onClick={(event) => { event.preventDefault(); navigateTo('/'); }} className="mb-6 inline-flex text-sm font-semibold text-[#C8A24A] no-underline transition hover:text-[#D4B05A] hover:underline">&larr; Back to Home</a>
        <span className="section-eyebrow text-[#C8A24A]">{eyebrow}</span>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-white">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-white/72">{intro}</p>
        <div className="legal-content mt-10">{children}</div>
        <button type="button" onClick={onStartIntake} className="btn-primary mt-10 rounded-md px-7 py-3 text-[11px] uppercase tracking-[0.16em] no-underline">Submit a Brief <ArrowRight size={15} /></button>
      </main>
      <Footer />
    </div>
  );
};

const UkAiInfrastructure = ({ onStartIntake }: { onStartIntake: () => void }) => {
  usePageMeta(routeMeta['/uk-ai-infrastructure'].title, routeMeta['/uk-ai-infrastructure'].description);

  return (
    <CapabilityPage
      eyebrow="UK AI INFRASTRUCTURE"
      title="UK AI Infrastructure Operator"
      intro="Lion Tech Innovations Ltd is a UK AI infrastructure company building operational automation systems, SaaS platforms, and enterprise-grade digital workflows for organisations that need reliable production systems. We operate, we don't agency. The platforms we ship are platforms we run."
      onStartIntake={onStartIntake}
    >
      <h2>What we operate</h2>
      <p>We maintain a portfolio of production UK technology platforms. Two are currently public:</p>
      <ul>
        <li><strong>ClearVisa UK</strong> — Compliance SaaS. AI-powered immigration risk analysis. Helps applicants assess UK visa refusal risk before submission, using classification models trained on Home Office decision patterns and policy guidance. Live.</li>
        <li><strong>CalcFee</strong> — Fintech tool. Real-time financial calculation and reporting platform with secure data processing pipelines and structured PDF output generation. Live.</li>
      </ul>
      <p>Each platform is operated by us, on our infrastructure, end to end. We design, deploy, secure, monitor, and maintain. The same engineering rigour applies to any partner engagement.</p>

      <h2>Infrastructure principles</h2>
      <p><strong>Production-first.</strong> Every system we ship is designed for the conditions it will actually run under: real users, real load, regulated UK markets, real failure modes. We do not ship MVPs that quietly become someone else's 3am incident.</p>
      <p><strong>Stack discipline.</strong> Our stack is deliberately narrow. TypeScript across frontend and serverless functions. Vercel Edge for compute. Supabase for managed Postgres and storage. Stripe for payment flows. Anthropic Claude via OpenRouter for LLM workloads. Resend for transactional email. Cloudflare for edge protection. A narrow stack means fewer abstractions to maintain, deeper expertise per tool, and predictable operational behaviour.</p>
      <p><strong>Operational reliability.</strong> Production-grade is not a marketing word. It means observability before launch, runbooks for every incident class, structured logging, alerting that pages on signal not noise, deploy gates with rollback, and a habit of fixing the cause rather than the symptom.</p>
      <p><strong>UK jurisdiction.</strong> Subject to UK GDPR, the Data Protection Act 2018, and English and Welsh law. Data flows are designed with UK and EU data residency in mind. International transfers documented and contracted under Standard Contractual Clauses where applicable.</p>

      <h2>What we build for partners</h2>
      <p>We selectively undertake infrastructure engagements with organisations that need production systems, not marketing collateral. Three capability lanes — each built on what we already operate:</p>
      <ul>
        <li><a href="/saas-platform-development" onClick={(event) => { event.preventDefault(); navigateTo('/saas-platform-development'); }}>SaaS Platform Development</a>. Architecting and shipping production SaaS for regulated UK markets. The patterns behind ClearVisa and CalcFee, applied to your domain.</li>
        <li><a href="/ai-intake-systems" onClick={(event) => { event.preventDefault(); navigateTo('/ai-intake-systems'); }}>AI Automation Systems</a>. Operational AI: intake systems, document processing, classification pipelines, workflow automation. We integrate with your existing stack rather than ask you to adopt ours.</li>
        <li><strong>API &amp; Payment Infrastructure.</strong> Stripe integrations, webhook reliability, idempotent transactional pipelines, financial reporting. The critical, often-unglamorous work that determines whether your business gets paid on time.</li>
      </ul>
      <p>What we do not do: marketing campaigns, SEO consulting, social media management, freelance hourly work, generic agency engagements, app cloning, ghostwriting, content writing. If those are what you need, we are not a fit.</p>

      <h2>How we engage</h2>
      <p>Engagement is initiated through our AI intake assistant — a real conversational interface, not a form. It captures requirements in your own words and generates a structured brief for our engineering team to review within one business day.</p>
      <p>If your brief fits how we work, we follow up with a discovery call to clarify constraints. After that, we issue a written engagement agreement with scope, fees, timelines, deliverables, and liability terms. No work begins outside a signed scope.</p>
      <p>We currently take a small number of engagements per year. Selectivity is not a marketing pose — it is how we maintain operational quality on the platforms we already run.</p>

      <h2>Where we are</h2>
      <p>London, United Kingdom. Registered in England and Wales (Company No. 17068390). All contracts governed by English and Welsh law.</p>
      <p>We work primarily with UK organisations. We accept engagements from EU and overseas clients on a case-by-case basis where the work is interesting and the data residency model fits.</p>
    </CapabilityPage>
  );
};

const SaasPlatformDevelopment = ({ onStartIntake }: { onStartIntake: () => void }) => {
  usePageMeta(routeMeta['/saas-platform-development'].title, routeMeta['/saas-platform-development'].description);

  return (
    <CapabilityPage
      eyebrow="SAAS PLATFORM DEVELOPMENT"
      title="Production SaaS for Regulated UK Markets"
      intro="We build production SaaS the way it has to work in real markets: secure, audited, observable, and operationally reliable. ClearVisa UK and CalcFee run on the patterns described below."
      onStartIntake={onStartIntake}
    >
      <h2>What 'production-ready' actually means</h2>
      <p>Most SaaS shipped today is a prototype with a Stripe button bolted on. We define production-ready strictly:</p>
      <ul>
        <li><strong>Multi-tenant data isolation enforced at the database layer.</strong> Row-level security policies in Postgres, not application-layer filters. A bug in your application code cannot leak data between tenants.</li>
        <li><strong>Audit logging on every state change.</strong> Who did what, when, with what payload. Retained for the legally required period. Queryable.</li>
        <li><strong>Observability before launch.</strong> Structured logs with request IDs propagated across all services. Alert thresholds set before traffic arrives, not retrofitted after incidents.</li>
        <li><strong>Idempotent transactional flows.</strong> Every payment, every webhook, every state transition designed to handle replay safely. Network failures should not produce duplicate charges or orphaned records.</li>
        <li><strong>GDPR-compliant data handling.</strong> Lawful basis documented per data category. Subject access, rectification, and erasure flows in place from launch — not added under pressure during a complaint.</li>
      </ul>

      <h2>Stack discipline</h2>
      <p>We use the same narrow stack across every platform we ship:</p>
      <ul>
        <li><strong>Frontend:</strong> TypeScript + React + Vite. Tailwind for styling.</li>
        <li><strong>Runtime:</strong> Vercel Edge functions for low-latency execution. Node serverless where edge is unsuitable.</li>
        <li><strong>Database:</strong> Supabase-managed Postgres. Row-level security policies. Database-side triggers for auditing.</li>
        <li><strong>Auth:</strong> Supabase Auth or Clerk, depending on the engagement's compliance requirements.</li>
        <li><strong>Payments:</strong> Stripe. Webhook receivers idempotent by event ID. Subscription state mirrored in our own database for auditability.</li>
        <li><strong>Email:</strong> Resend for transactional. Postmark or AWS SES for higher-volume engagements.</li>
        <li><strong>Edge security:</strong> Cloudflare. Rate limiting, bot mitigation, WAF rules.</li>
        <li><strong>Monitoring:</strong> Vercel observability, Sentry, and structured logging into Supabase or BetterStack.</li>
      </ul>
      <p>This stack is deliberately narrow. Deep expertise across few tools is more useful than shallow coverage of many.</p>

      <h2>Our shipped platforms</h2>
      <p><strong>ClearVisa UK</strong> — compliance SaaS in the UK immigration risk-analysis space. Built around a classification model, a document handling pipeline, and an outcome scoring presentation layer. Multi-tenant, GDPR-compliant, and operating in a regulated category.</p>
      <p><strong>CalcFee</strong> — fintech tool. Real-time calculation engine, secure financial data pipeline, structured PDF report generation. Stripe-integrated billing.</p>
      <p>The architectural patterns across both are the same. Multi-tenancy, RLS, audit logs, idempotent transactions, observability, structured PDF output. We build to one standard.</p>

      <h2>What an engagement looks like</h2>
      <p>Most SaaS partner engagements follow this shape:</p>
      <ol>
        <li><strong>Discovery.</strong> 60-90 min call. Domain understanding, regulatory constraints, integration surface, team and ownership model.</li>
        <li><strong>Scoping document.</strong> Architecture proposal, data model, integration map, deployment plan, milestones, and pricing. Signed before any code.</li>
        <li><strong>Build.</strong> Iterative delivery. Working software in production environments from week one, not week twelve.</li>
        <li><strong>Handover or operate.</strong> Depending on the engagement, we either hand the platform to your internal team with documentation and runbooks, or continue to operate it under a managed-platform agreement.</li>
      </ol>
      <p>We do not run hourly billing. Engagements are fixed-scope or platform-operated, with clear deliverables and timelines.</p>

      <h2>What we don't build</h2>
      <p>We do not build: marketing sites with 'SaaS' in the page title, NFT mints, crypto exchanges, gambling platforms, dating apps, AI image generators, copywriting tools, generic CRMs, or one-off WordPress builds. We have no problem with these markets — they're not where our engineering value is concentrated.</p>
      <p>Part of <a href="/uk-ai-infrastructure" onClick={(event) => { event.preventDefault(); navigateTo('/uk-ai-infrastructure'); }}>LionTech's UK AI infrastructure</a>.</p>
    </CapabilityPage>
  );
};

const AiIntakeSystems = ({ onStartIntake }: { onStartIntake: () => void }) => {
  usePageMeta(routeMeta['/ai-intake-systems'].title, routeMeta['/ai-intake-systems'].description);

  return (
    <CapabilityPage
      eyebrow="AI INTAKE SYSTEMS"
      title="Conversational Intake, Not Multi-Step Forms"
      intro="Multi-step intake wizards are an anti-pattern. Real buyers describe their problem in their own words; a structured form forces them to translate their problem into your taxonomy. We build conversational AI intake systems that capture intent in the visitor's own language, then structure it for your team. The intake on this site is itself a working example. The same architecture is available for your domain."
      onStartIntake={onStartIntake}
    >
      <h2>Why conversational beats form</h2>
      <p>Forms work when the user already knows what they want. For complex purchases — software, legal services, financial products, infrastructure work — the user is exploring, and a form makes them feel interrogated.</p>
      <p>Conversational intake inverts this. The user describes their problem in natural language. The AI captures intent, asks at most one clarifying question, and produces a structured brief for the receiving team. The user does less work; the team gets richer information.</p>
      <p>Compared to a typical multi-step form:</p>
      <ul>
        <li><strong>Higher completion rate.</strong> No drop-off between steps.</li>
        <li><strong>Higher information density.</strong> Free-text replies surface context that radio buttons never capture.</li>
        <li><strong>Faster qualification.</strong> The AI can decline obvious misfits politely, freeing your team to focus on real opportunities.</li>
        <li><strong>Better team handoff.</strong> The output is a structured brief in your team's schema, not a CRM record padded with empty fields.</li>
      </ul>

      <h2>Architecture (the intake on this site)</h2>
      <p>The AI intake you can try via the Submit a Brief button on this site uses the following architecture. The same pattern is what we deploy for partners.</p>
      <p><strong>Frontend.</strong> React component with streaming response rendering. The user types, sends with Enter, and watches the assistant's response stream in character by character — the streaming itself is most of what makes the experience feel intelligent.</p>
      <p><strong>API endpoint.</strong> Vercel Edge function. Receives the conversation history, applies a system prompt that defines the AI's voice and behaviour, and streams the response back from the upstream model.</p>
      <p><strong>Model.</strong> Anthropic Claude (currently Sonnet 4.6) accessed via OpenRouter. OpenRouter abstracts model providers, so the system can switch providers without code changes if pricing, latency, or capability requires it.</p>
      <p><strong>System prompt.</strong> The system prompt IS the product. It defines voice (engineer, terse, no filler), turn rules (maximum one clarifying question, brief on second response), decline filters (explicit budget or scope misfit), and output format (structured JSON brief).</p>
      <p><strong>Brief generation.</strong> When the conversation has enough signal, the assistant responds with JSON in a strict schema: project, problem, current state, capabilities required, constraints, urgency, suggested next step.</p>
      <p><strong>Submission endpoint.</strong> A second Vercel Edge function receives the user-confirmed brief plus contact details, formats it as HTML email, and dispatches via Resend to the receiving team. Reply-to is set to the visitor's email so team replies go directly to them.</p>
      <p><strong>No database.</strong> Conversation transcripts are not stored. The brief lives only in the email record. This is deliberate — minimum-data-retention by design.</p>

      <h2>Engineering details we get asked about</h2>
      <p><strong>Streaming.</strong> We use a fetch with ReadableStream consumed character-by-character on the client. No fake typing animation.</p>
      <p><strong>JSON suppression.</strong> When the assistant generates the brief JSON, the client detects JSON mode on the first non-whitespace character and replaces the streamed text with a placeholder, then transitions to the brief preview UI when streaming completes. The raw JSON is never visible to the user.</p>
      <p><strong>Turn budget.</strong> The system prompt enforces a maximum of one clarifying question. Backend logic enforces a maximum of three visitor messages. After that, the model must produce a brief regardless of how thin the input is.</p>
      <p><strong>Decline filter.</strong> Only specific signals trigger a decline: explicit budget under £15K, hobby framing, requests for services we don't offer. Short answers, terse phrasing, or thin input do not trigger a decline.</p>
      <p><strong>Rate limiting.</strong> Per-IP rate limits at the edge prevent abuse. Cost-bounded per conversation.</p>

      <h2>Where this applies</h2>
      <p>We deploy AI intake systems for:</p>
      <ul>
        <li>Professional services firms (law, accountancy, consulting) where the qualification process is currently a 30-minute phone call.</li>
        <li>B2B SaaS companies where the enterprise inbound funnel is currently a HubSpot form.</li>
        <li>Regulated services (fintech, healthtech, legaltech) where intake needs to be auditable and structured.</li>
        <li>Internal tools, replacing internal ticketing or request forms with conversational intake that handles triage automatically.</li>
      </ul>
      <p>We do not deploy AI intake for retail support, customer service chatbots, or general-purpose AI assistants. Different problem space.</p>

      <h2>What an engagement looks like</h2>
      <p>Two engagement models:</p>
      <ol>
        <li><strong>Drop-in intake.</strong> We build a customised version of the intake on your site, with your system prompt, your branding, your structured brief schema, and your email delivery target. Typical delivery: two to three weeks.</li>
        <li><strong>Operated intake.</strong> As above, but we host, monitor, and maintain the system long term. Includes a monthly cost cap, model upgrades as they ship, and quarterly system prompt iteration based on conversation logs.</li>
      </ol>
      <p>Both engagement models include conversation flow design — choosing what the AI should and shouldn't ask is more important than the implementation. The system prompt is the product.</p>
      <p>Part of <a href="/uk-ai-infrastructure" onClick={(event) => { event.preventDefault(); navigateTo('/uk-ai-infrastructure'); }}>LionTech's UK AI infrastructure</a>.</p>
    </CapabilityPage>
  );
};

const PrivacyPolicy = ({ onStartIntake }: { onStartIntake: () => void }) => {
  usePageMeta(routeMeta['/privacy-policy'].title, routeMeta['/privacy-policy'].description);

  return (
  <LegalPage title="Privacy Policy" onStartIntake={onStartIntake}>
    <h2>1. Introduction</h2>
    <p>Lion Tech Innovations Ltd ("LionTech", "we", "our", "us"), registered in England and Wales (Company No. 17068390), is committed to protecting the privacy of individuals who interact with our website, services, and products. This policy explains what information we collect, how we use it, and the rights you have under UK GDPR and the Data Protection Act 2018.</p>
    <h2>2. Information We Collect</h2>
    <p>We collect the following categories of personal data:</p>
    <ul>
      <li>Contact information you provide voluntarily (name, email address, company, role) when submitting a brief through our AI intake assistant or contacting us directly.</li>
      <li>Conversation data from the AI intake assistant, including the messages you send and the structured brief generated from those messages.</li>
      <li>Technical data automatically logged when you visit the site: IP address, browser type, device type, referring page, and timestamps.</li>
      <li>Communication records from any subsequent correspondence with our team.</li>
    </ul>
    <p>We do not knowingly collect special category data, financial details, or information from children under 16.</p>
    <h2>3. How We Use Your Information</h2>
    <p>We process personal data on the following lawful bases under UK GDPR:</p>
    <ul>
      <li>Legitimate interests: to respond to enquiries, evaluate fit for engagements, operate our infrastructure, and improve our services.</li>
      <li>Contractual necessity: where you become a customer or engagement partner.</li>
      <li>Legal obligation: to comply with applicable UK laws, including tax, company, and data protection legislation.</li>
    </ul>
    <p>We do not sell personal data. We do not use personal data for advertising or profiling.</p>
    <h2>4. Third-Party Processors</h2>
    <p>We use the following processors to deliver our services. Each is bound by data protection contracts and processes data only on our instructions:</p>
    <ul>
      <li>OpenRouter (OpenRouter, Inc., USA) — routes the AI intake conversation to the Anthropic Claude language model.</li>
      <li>Anthropic, PBC (USA) — provides the underlying Claude language model used for the intake assistant. Anthropic's API data usage policy applies.</li>
      <li>Resend (Resend, Inc., USA) — delivers transactional email notifications. Hosted in Ireland (EU).</li>
      <li>Vercel Inc. (USA) — hosts our website infrastructure on its Edge network.</li>
      <li>Google LLC (USA / Ireland) — provides Google Workspace for our email and document infrastructure.</li>
      <li>GoDaddy.com, LLC (USA) — registers our domain.</li>
    </ul>
    <p>International transfers to the USA are protected by Standard Contractual Clauses (SCCs) and the EU–US Data Privacy Framework where applicable.</p>
    <h2>5. Data Retention</h2>
    <ul>
      <li>AI intake conversation transcripts are transmitted in-memory during the conversation. Once a brief is generated and emailed to our team, the transcript is retained only as part of that email record. We do not store transcripts in a database.</li>
      <li>Email correspondence is retained for up to 7 years for legitimate business and tax purposes, then deleted.</li>
      <li>Technical logs are retained for up to 30 days for security and operational purposes, then deleted.</li>
      <li>Customer records are retained for the duration of the engagement plus 7 years thereafter.</li>
    </ul>
    <h2>6. Your Rights</h2>
    <p>Under UK GDPR you have the right to:</p>
    <ul>
      <li>Access the personal data we hold about you.</li>
      <li>Request correction of inaccurate data.</li>
      <li>Request deletion of your data where applicable.</li>
      <li>Request restriction of, or object to, processing.</li>
      <li>Request data portability in a structured, machine-readable format.</li>
      <li>Withdraw consent where processing is based on consent.</li>
      <li>Lodge a complaint with the UK Information Commissioner's Office (ICO) at ico.org.uk.</li>
    </ul>
    <p>To exercise any of these rights, email <a href="mailto:privacy@liontechinnovations.co.uk">privacy@liontechinnovations.co.uk</a>. We will respond within one calendar month.</p>
    <h2>7. Cookies</h2>
    <p>Our website uses only essential cookies required for site function. We do not use advertising, analytics, or tracking cookies. You can control cookie preferences through your browser settings.</p>
    <h2>8. Security</h2>
    <p>We apply reasonable technical and organisational measures to protect personal data, including encrypted transport (HTTPS), least-privilege access controls, and segregation of production credentials. We will notify affected individuals and the ICO of any qualifying data breach within 72 hours of discovery.</p>
    <h2>9. Changes to This Policy</h2>
    <p>We may update this policy from time to time. Material changes will be reflected in the "Last updated" date at the top.</p>
    <h2>10. Contact</h2>
    <ul>
      <li>Data protection enquiries and rights requests: <a href="mailto:privacy@liontechinnovations.co.uk">privacy@liontechinnovations.co.uk</a></li>
      <li>General contact: <a href="mailto:contact@liontechinnovations.co.uk">contact@liontechinnovations.co.uk</a></li>
      <li>Postal: Lion Tech Innovations Ltd, London, United Kingdom (full registered office available on request).</li>
    </ul>
  </LegalPage>
  );
};

const TermsAndConditions = ({ onStartIntake }: { onStartIntake: () => void }) => {
  usePageMeta(routeMeta['/terms-and-conditions'].title, routeMeta['/terms-and-conditions'].description);

  return (
  <LegalPage title="Terms & Conditions" onStartIntake={onStartIntake}>
    <h2>1. Introduction</h2>
    <p>These Terms govern your use of the website operated by Lion Tech Innovations Ltd ("LionTech", "we", "our", "us"), a company registered in England and Wales (Company No. 17068390). By accessing this website or using our services, you agree to these Terms.</p>
    <h2>2. Services</h2>
    <p>LionTech operates a portfolio of UK technology platforms — including ClearVisa UK and CalcFee — and selectively undertakes infrastructure engagements with organisations that need production-grade systems work. We do not offer freelance services, hourly billing, marketing services, or generic agency work.</p>
    <h2>3. Engagement Process</h2>
    <ul>
      <li>Submissions via our AI intake assistant ("Submit a Brief") are evaluated by our engineering team within one business day.</li>
      <li>A submission does not constitute an offer of services or a contract.</li>
      <li>If we determine a fit, we will follow up to arrange a discovery call. Terms specific to any engagement (scope, fees, timelines, deliverables, liability, intellectual property) will be set out in a separate written agreement before any work begins.</li>
    </ul>
    <h2>4. Use of the Website</h2>
    <p>You agree not to:</p>
    <ul>
      <li>Attempt to disrupt, probe, or circumvent the security of the website or its underlying infrastructure.</li>
      <li>Submit unlawful, defamatory, or abusive content through the intake assistant or any other form.</li>
      <li>Use automated tools, scrapers, or scripts to interact with the intake assistant or extract content.</li>
      <li>Misrepresent your identity, company, or intentions.</li>
    </ul>
    <p>We reserve the right to refuse service, block access, or terminate engagements at our discretion.</p>
    <h2>5. Intellectual Property</h2>
    <p>All content on this website — including text, graphics, logos, the "LionTech Innovations" name, product branding (ClearVisa UK, CalcFee), and source code — is the property of Lion Tech Innovations Ltd or its licensors and is protected by UK copyright and trademark law. Use, reproduction, or distribution without prior written permission is prohibited.</p>
    <h2>6. Products</h2>
    <p>ClearVisa UK and CalcFee are each operated under their own terms of service available on the respective product website. Those product terms govern use of those products and take precedence over these Terms for matters specific to the product.</p>
    <h2>7. Disclaimers</h2>
    <p>The website and any informational content are provided "as is" without warranties of any kind, express or implied. We make no warranty that the website will be uninterrupted, error-free, or free from security vulnerabilities at all times. Outputs from the AI intake assistant are not professional advice; they are an automated structuring of your submitted information for our team to review.</p>
    <h2>8. Limitation of Liability</h2>
    <p>To the maximum extent permitted by UK law, Lion Tech Innovations Ltd shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising from your use of the website or any free-tier interactions. Nothing in these Terms limits liability for fraud, death or personal injury caused by negligence, or any other liability that cannot be excluded by UK law.</p>
    <h2>9. Indemnification</h2>
    <p>You agree to indemnify and hold harmless Lion Tech Innovations Ltd from any claims, damages, or expenses arising from your breach of these Terms or your misuse of the website.</p>
    <h2>10. Governing Law</h2>
    <p>These Terms are governed by the laws of England and Wales. Any disputes arising shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
    <h2>11. Changes to These Terms</h2>
    <p>We may update these Terms periodically. Material changes will be reflected in the "Last updated" date at the top.</p>
    <h2>12. Contact</h2>
    <ul>
      <li>Legal and contractual enquiries: <a href="mailto:legal@liontechinnovations.co.uk">legal@liontechinnovations.co.uk</a></li>
      <li>General contact: <a href="mailto:contact@liontechinnovations.co.uk">contact@liontechinnovations.co.uk</a></li>
    </ul>
  </LegalPage>
  );
};

const HomePage = ({ onStartIntake }: { onStartIntake: () => void }) => {
  usePageMeta(routeMeta['/'].title, routeMeta['/'].description);

  return (
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
};

type RoofingBriefForm = {
  plan: string;
  sessionId: string;
  contactName: string;
  email: string;
  mobileNumber: string;
  roofingBusinessName: string;
  tradingName: string;
  mainWebsitePhone: string;
  whatsappSameAsMain: boolean;
  whatsappNumber: string;
  businessEmail: string;
  mainTownCity: string;
  areasCovered: string;
  areasNotCovered: string;
  services: string[];
  otherServices: string;
  currentWebsiteUrl: string;
  googleBusinessProfile: string;
  facebookPage: string;
  instagramLink: string;
  tradeProfileLinks: string;
  logoLink: string;
  logoPhotoUploadLink: string;
  jobPhotosUploadLink: string;
  brandColours: string;
  siteLookNotes: string;
  reviewLinks: string;
  testimonials: string;
  accreditations: string;
  insuranceGuarantees: string;
  domainStatus: string;
  domainName: string;
  preferredDomainIdeas: string;
  importantNotes: string;
  bestTimeToContact: string;
  confirmAccurate: boolean;
};

const roofingServices = [
  'Emergency roof repairs',
  'Active leaks',
  'Storm damage',
  'Missing / slipped tiles',
  'Flat roofs',
  'New roofs',
  'Guttering',
  'Chimneys',
  'Leadwork',
  'Fascias and soffits',
  'Commercial roofing',
  'Other',
];

const RoofingBriefPage = ({ onStartIntake }: { onStartIntake: () => void }) => {
  const meta = routeMeta['/roofing-brief'];
  const params = new URLSearchParams(window.location.search);
  const plan = params.get('plan') === 'oneoff' ? 'oneoff' : 'managed';
  const sessionId = params.get('session_id') || '';
  const uploadHelp = 'Paste a Google Drive, Dropbox, WeTransfer, iCloud, OneDrive, or website link. If you do not have one yet, leave blank and send photos later.';
  const [stripeNote, setStripeNote] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState<RoofingBriefForm>(() => ({
    plan,
    sessionId,
    contactName: '',
    email: '',
    mobileNumber: '',
    roofingBusinessName: '',
    tradingName: '',
    mainWebsitePhone: '',
    whatsappSameAsMain: false,
    whatsappNumber: '',
    businessEmail: '',
    mainTownCity: '',
    areasCovered: '',
    areasNotCovered: '',
    services: [],
    otherServices: '',
    currentWebsiteUrl: '',
    googleBusinessProfile: '',
    facebookPage: '',
    instagramLink: '',
    tradeProfileLinks: '',
    logoLink: '',
    logoPhotoUploadLink: '',
    jobPhotosUploadLink: '',
    brandColours: '',
    siteLookNotes: '',
    reviewLinks: '',
    testimonials: '',
    accreditations: '',
    insuranceGuarantees: '',
    domainStatus: 'not-sure',
    domainName: '',
    preferredDomainIdeas: '',
    importantNotes: '',
    bestTimeToContact: '',
    confirmAccurate: false,
  }));

  usePageMeta(meta.title, meta.description);
  useEffect(() => {
    setMeta('meta[property="og:title"]', 'content', meta.title);
    setMeta('meta[property="og:description"]', 'content', meta.description);
    setMeta('meta[property="og:url"]', 'content', 'https://liontechinnovations.co.uk/roofing-brief');
    setMeta('meta[name="twitter:title"]', 'content', meta.title);
    setMeta('meta[name="twitter:description"]', 'content', meta.description);
    setMeta('link[rel="canonical"]', 'href', 'https://liontechinnovations.co.uk/roofing-brief');
  }, [meta.description, meta.title]);

  useEffect(() => {
    if (!sessionId) {
      setStripeNote('We could not automatically load your checkout details. Please fill the form manually.');
      return;
    }

    let isMounted = true;
    fetch(`/api/get-checkout-session?session_id=${encodeURIComponent(sessionId)}`)
      .then((response) => response.json())
      .then((data) => {
        if (!isMounted) return;
        if (!data?.ok) {
          setStripeNote('We could not automatically load your checkout details. Please fill the form manually.');
          return;
        }

        const businessField = Array.isArray(data.custom_fields)
          ? data.custom_fields.find((field: { key?: string; text?: { value?: string } }) => field.key === 'business_name')?.text?.value
          : '';

        setForm((current) => ({
          ...current,
          contactName: current.contactName || data.customer_name || '',
          email: current.email || data.customer_email || '',
          mobileNumber: current.mobileNumber || data.customer_phone || '',
          roofingBusinessName: current.roofingBusinessName || businessField || '',
        }));
      })
      .catch(() => {
        if (isMounted) setStripeNote('We could not automatically load your checkout details. Please fill the form manually.');
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  const updateField = (field: keyof RoofingBriefForm, value: string | boolean | string[]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleService = (service: string) => {
    setForm((current) => ({
      ...current,
      services: current.services.includes(service)
        ? current.services.filter((item) => item !== service)
        : [...current.services, service],
    }));
  };

  const inputClass = 'mt-2 w-full rounded-lg border border-white/10 bg-[#071426]/78 px-3 py-3 text-[15px] text-white outline-none transition placeholder:text-white/35 focus:border-[#C8A24A]/70 focus:ring-2 focus:ring-[#C8A24A]/20';
  const labelClass = 'block text-[13px] font-bold leading-6 text-white/82';

  const TextInput = ({ field, label, required = false, placeholder = '' }: { field: keyof RoofingBriefForm; label: string; required?: boolean; placeholder?: string }) => (
    <label className={labelClass}>
      {label}{required && <span className="text-[#C8A24A]"> *</span>}
      <input className={inputClass} value={String(form[field] || '')} required={required} placeholder={placeholder} onChange={(event) => updateField(field, event.target.value)} />
    </label>
  );

  const TextArea = ({ field, label, required = false, placeholder = '', rows = 4 }: { field: keyof RoofingBriefForm; label: string; required?: boolean; placeholder?: string; rows?: number }) => (
    <label className={labelClass}>
      {label}{required && <span className="text-[#C8A24A]"> *</span>}
      <textarea className={inputClass} value={String(form[field] || '')} required={required} rows={rows} placeholder={placeholder} onChange={(event) => updateField(field, event.target.value)} />
    </label>
  );

  const FieldGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="rounded-2xl border border-[#C8A24A]/14 bg-[#071426]/72 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_48px_rgba(0,0,0,0.24)]">
      <h2 className="text-xl font-black tracking-[-0.035em] text-white">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    const payload = {
      ...form,
      whatsappNumber: form.whatsappSameAsMain ? form.mainWebsitePhone : form.whatsappNumber,
    };

    try {
      const response = await fetch('/api/submit-roofing-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result?.ok) {
        setSubmitError(result?.missing?.length ? `Missing server env vars: ${result.missing.join(', ')}` : result?.error || 'Brief submit failed.');
        return;
      }
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setSubmitError('Connection issue. Please try again or email contact@liontechinnovations.co.uk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#020817] text-white">
        <Navbar onStartIntake={onStartIntake} />
        <main className="mx-auto max-w-3xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#C8A24A]/20 bg-[#071426]/78 p-6 text-center shadow-[0_24px_70px_rgba(0,0,0,0.34)]">
            <CheckCircle2 className="mx-auto text-[#C8A24A]" size={38} />
            <h1 className="mt-5 text-3xl font-black tracking-[-0.04em] text-white">Brief received.</h1>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-7 text-white/72">Your 5-working-day build starts now, provided payment is complete. We'll review the details and contact you if anything is missing.</p>
            <a href="/lead-recovery" onClick={(event) => { event.preventDefault(); navigateTo('/lead-recovery'); }} className="btn-primary mt-7 inline-flex min-h-11 items-center justify-center rounded-md px-6 py-3 text-[11px] uppercase tracking-[0.14em] no-underline">Back to Lead Recovery Page</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <Navbar onStartIntake={onStartIntake} />
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <a href="/lead-recovery" onClick={(event) => { event.preventDefault(); navigateTo('/lead-recovery'); }} className="mb-6 inline-flex text-sm font-semibold text-[#C8A24A] no-underline transition hover:text-[#D4B05A] hover:underline">&larr; Back to Lead Recovery</a>
        <span className="section-eyebrow text-[#C8A24A]">Roofing build brief</span>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-white">Roofing Website Build Brief</h1>
        <p className="mt-5 text-xl font-bold tracking-[-0.02em] text-white">Payment received - now send your build details.</p>
        <p className="mt-3 max-w-3xl text-[16px] leading-7 text-white/72">This takes about 5 minutes. Your 5-working-day build starts once payment and this brief are both complete.</p>
        <p className="mt-4 max-w-3xl rounded-xl border border-[#C8A24A]/18 bg-[#C8A24A]/8 p-4 text-[14px] leading-6 text-white/72">No technical knowledge needed. If you do not have a logo or photos yet, leave those fields blank or paste a link later.</p>
        {stripeNote && <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-[14px] leading-6 text-white/68">{stripeNote}</p>}

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <input type="hidden" name="plan" value={form.plan} />
          <input type="hidden" name="sessionId" value={form.sessionId} />

          <FieldGroup title="1. Contact details">
            <TextInput field="contactName" label="Contact name" required />
            <TextInput field="email" label="Email" required />
            <TextInput field="mobileNumber" label="Mobile number" required />
            <TextInput field="roofingBusinessName" label="Roofing business name" required />
            <TextInput field="tradingName" label="Trading name if different" />
          </FieldGroup>

          <FieldGroup title="2. Website contact details">
            <TextInput field="mainWebsitePhone" label="Main phone number to show on the website" required />
            <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3 text-[13px] font-bold text-white/82">
              <input type="checkbox" checked={form.whatsappSameAsMain} onChange={(event) => updateField('whatsappSameAsMain', event.target.checked)} />
              WhatsApp number is the same as main phone
            </label>
            <TextInput field="whatsappNumber" label="WhatsApp number to use" />
            <TextInput field="businessEmail" label="Business email to show on website, optional" />
          </FieldGroup>

          <FieldGroup title="3. Service areas">
            <TextInput field="mainTownCity" label="Main town/city" required />
            <TextArea field="areasCovered" label="Areas/postcodes covered" required />
            <TextArea field="areasNotCovered" label="Areas you do NOT cover, optional" />
          </FieldGroup>

          <section className="rounded-2xl border border-[#C8A24A]/14 bg-[#071426]/72 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_48px_rgba(0,0,0,0.24)]">
            <h2 className="text-xl font-black tracking-[-0.035em] text-white">4. Roofing services</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {roofingServices.map((service) => (
                <label key={service} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3 text-[13px] font-bold text-white/82">
                  <input type="checkbox" checked={form.services.includes(service)} onChange={() => toggleService(service)} />
                  {service}
                </label>
              ))}
            </div>
            {form.services.includes('Other') && <div className="mt-4"><TextInput field="otherServices" label="Other services" /></div>}
          </section>

          <FieldGroup title="5. Existing online presence">
            <TextInput field="currentWebsiteUrl" label="Current website URL, optional" />
            <TextInput field="googleBusinessProfile" label="Google Business Profile link, optional" />
            <TextInput field="facebookPage" label="Facebook page link, optional" />
            <TextInput field="instagramLink" label="Instagram link, optional" />
            <TextArea field="tradeProfileLinks" label="Checkatrade / Rated People / MyBuilder / other profile links, optional" />
          </FieldGroup>

          <FieldGroup title="6. Branding">
            <TextInput field="logoLink" label="Logo link, optional" placeholder={uploadHelp} />
            <TextInput field="logoPhotoUploadLink" label="Logo/photo upload link" placeholder={uploadHelp} />
            <TextInput field="jobPhotosUploadLink" label="Job photos upload link" placeholder={uploadHelp} />
            <TextInput field="brandColours" label="Brand colours, optional" />
            <TextArea field="siteLookNotes" label="Notes about how they want the site to look, optional" />
          </FieldGroup>

          <FieldGroup title="7. Reviews / trust">
            <TextArea field="reviewLinks" label="Review links, optional" />
            <TextArea field="testimonials" label="Short testimonials to include, optional" />
            <TextArea field="accreditations" label="Accreditations to mention, optional" />
            <TextArea field="insuranceGuarantees" label="Insurance / guarantees to mention, optional" />
          </FieldGroup>

          <section className="rounded-2xl border border-[#C8A24A]/14 bg-[#071426]/72 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_48px_rgba(0,0,0,0.24)]">
            <h2 className="text-xl font-black tracking-[-0.035em] text-white">8. Domain</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                ['own-domain', 'I already own a domain'],
                ['need-domain', 'I need a new domain'],
                ['not-sure', 'I am not sure'],
              ].map(([value, label]) => (
                <label key={value} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3 text-[13px] font-bold text-white/82">
                  <input type="radio" name="domainStatus" checked={form.domainStatus === value} onChange={() => updateField('domainStatus', value)} />
                  {label}
                </label>
              ))}
            </div>
            {form.domainStatus === 'own-domain' && <div className="mt-4"><TextInput field="domainName" label="Domain name" /></div>}
            {form.domainStatus === 'need-domain' && <div className="mt-4"><TextArea field="preferredDomainIdeas" label="Preferred domain ideas" /></div>}
          </section>

          <FieldGroup title="9. Urgency / notes">
            <TextArea field="importantNotes" label="Anything important we should know?" />
            <TextInput field="bestTimeToContact" label="Best time to contact you" />
            <label className="md:col-span-2 flex items-start gap-3 rounded-lg border border-[#C8A24A]/18 bg-[#C8A24A]/8 px-3 py-3 text-[13px] font-bold leading-6 text-white/82">
              <input className="mt-1" type="checkbox" required checked={form.confirmAccurate} onChange={(event) => updateField('confirmAccurate', event.target.checked)} />
              I confirm these details are accurate enough for LionTech to start the build.
            </label>
          </FieldGroup>

          {submitError && <p className="rounded-xl border border-red-400/25 bg-red-500/10 p-4 text-[14px] font-semibold leading-6 text-red-100">{submitError}</p>}
          <div>
            <button type="submit" disabled={isSubmitting} className="btn-primary min-h-11 rounded-md px-6 py-3 text-center text-[11px] uppercase tracking-[0.14em] disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? 'Submitting...' : 'Submit Build Brief'}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

const LeadRecoveryPage = ({ onStartIntake }: { onStartIntake: () => void }) => {
  const meta = routeMeta['/lead-recovery'];
  const managedLink = '/api/create-managed-checkout';
  const oneOffLink = '/api/create-oneoff-checkout';
  const checkoutStatus = new URLSearchParams(window.location.search).get('checkout');
  const previewImage = '/images/roofing-lead-desktop-preview.png';
  const mobilePreviews = [
    {
      label: 'Mobile emergency landing page',
      src: '/images/lead-recovery/hero-mock.jpg',
      alt: 'Demo preview of mobile emergency roofing landing page',
    },
    {
      label: 'Roofing issue form',
      src: '/images/lead-recovery/wizard-mock.jpg',
      alt: 'Demo preview of roofing issue qualification form',
    },
    {
      label: 'Estimate and payment options',
      src: '/images/lead-recovery/assessment-mock.jpg',
      alt: 'Demo preview of roofing assessment and payment options',
    },
    {
      label: 'Lead routed to the roofer',
      src: '/images/lead-recovery/sms-mock.jpg',
      alt: 'Demo preview of SMS roofing lead alert',
    },
  ];

  const managedIncludes = [
    'Custom emergency roofing website',
    'SMS lead alerts to your phone',
    'Hosting and basic maintenance included',
    '1 small website tweak per month',
    'Quarterly performance check-in',
    '12-month minimum term',
    'Cancel any time after month 12',
  ];
  const oneOffIncludes = [
    'Custom emergency roofing website',
    'Built and handed over after completion',
    'No monthly management',
    'No ongoing support included',
    'You manage hosting, domain, SMS, database, and future changes',
  ];
  const includedGroups = [
    {
      title: 'Website & Branding',
      items: ['Custom emergency roofing lead-capture website', 'Built around your business name', 'Your branding, colours, and logo added', 'Your service areas added', 'Your phone number displayed clearly', 'Mobile-friendly layout', 'Click-to-call buttons for mobile visitors'],
    },
    {
      title: 'Lead Capture',
      items: ['Emergency roofing enquiry form', 'Leak repair / storm damage / urgent roof repair wording', 'Calls and enquiries sent to your phone', 'SMS lead alerts', 'Lead details stored securely', 'Simple lead tracking so enquiries can be reviewed'],
    },
    {
      title: 'Setup',
      items: ['Domain connected or setup guidance provided', 'Website launched within 5 working days after intake details are received', 'Basic local wording for your town/city', 'No technical setup needed by the roofer'],
    },
    {
      title: 'Managed Support',
      items: ['Hosting included', 'Basic maintenance included', 'Security updates included', 'Basic speed/performance checks', 'Up to 1 small website tweak per month', 'Quarterly performance review/check-in'],
    },
  ];
  const tweakExamples = ['Updating your phone number', 'Changing opening hours', 'Updating a short paragraph', 'Changing a service area', 'Swapping one image', 'Adding one short customer testimonial', 'Updating a small offer or seasonal message'];
  const paidExtras = ['Uploading lots of extra photographs', 'Adding new website pages', 'Full page redesigns', 'Rewriting large sections of the website', 'Adding new services that need new copy or layout', 'SEO campaigns', 'Google Ads management', 'Social media posting', 'Photography', 'Logo design from scratch', 'CRM setup', 'Complex integrations', 'Extra automation work', 'Major design changes', 'Rebuilding the site after the roofer changes direction'];
  const comparisonRows = [
    ['Price today', '£495 setup', '£1,995 one-off'],
    ['Monthly cost', '£199/month from launch', '£0'],
    ['Website build', 'Included', 'Included'],
    ['Live in 5 working days', 'Yes, after intake details received', 'Yes, after intake details received'],
    ['Business branding', 'Included', 'Included'],
    ['SMS lead alerts', 'Included', 'Setup included before handoff'],
    ['Hosting', 'Included while managed plan active', 'Your responsibility after handoff'],
    ['Basic maintenance', 'Included', 'Not included'],
    ['Security updates', 'Included', 'Your responsibility after handoff'],
    ['Small tweaks', '1 per month included', 'Charged separately'],
    ['Quarterly check-in', 'Included', 'Not included'],
    ['Best for', 'Roofers who want it handled', 'Roofers who want to manage it themselves'],
  ];
  const faqs = [
    ['What do I pay today?', 'For the managed plan, you pay £495 today. The £199/month managed plan starts from launch day.'],
    ['When does the £199/month start?', 'It starts on launch day, after the website is live.'],
    ['Is there a minimum term?', 'Yes. The managed plan has a 12-month minimum term. After that, you can cancel any time.'],
    ['When will my website go live?', 'The target is 5 working days after we receive your required business details, including your business name, phone number, service areas, and any branding or photos you want used.'],
    ['Do I need to know anything technical?', 'No. The managed plan is designed for roofers who want the technical side handled for them.'],
    ['What happens after launch?', 'On the managed plan, hosting, SMS lead routing, basic maintenance, security updates, and one small website tweak per month are included.'],
    ['What counts as a small tweak?', 'A small tweak is a simple change that takes under 30 minutes, such as changing a phone number, swapping one image, updating opening hours, or editing a short paragraph.'],
    ['What is not included?', 'Bigger changes such as new pages, full redesigns, SEO campaigns, Google Ads, lots of photo uploads, major rewrites, or complex integrations are charged separately.'],
    ['How are extras charged?', 'Extra work is charged at £75/hour or as a fixed quote agreed before work starts. You are never charged for extra work without approval.'],
    ['What is the difference between managed and one-off?', 'Managed means we build the website and keep the basics running for you. One-off means we build it, hand it over, and you manage it yourself after completion.'],
    ['Are there hidden fees?', 'No. The page clearly shows what is included, what is not included, and how extra work is charged.'],
    ['Can I use my own business name and branding?', 'Yes. The website is built around your roofing business name, branding, phone number, and service areas.'],
  ];

  usePageMeta(meta.title, meta.description);
  useEffect(() => {
    setMeta('meta[property="og:title"]', 'content', meta.title);
    setMeta('meta[property="og:description"]', 'content', meta.description);
    setMeta('meta[property="og:url"]', 'content', 'https://liontechinnovations.co.uk/lead-recovery');
    setMeta('meta[name="twitter:title"]', 'content', meta.title);
    setMeta('meta[name="twitter:description"]', 'content', meta.description);
    setMeta('link[rel="canonical"]', 'href', 'https://liontechinnovations.co.uk/lead-recovery');
  }, [meta.description, meta.title]);

  const CheckItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex gap-2 text-[14px] leading-6 text-white/72">
      <CheckCircle2 size={16} className="mt-1 shrink-0 text-[#C8A24A]" />
      <span>{children}</span>
    </li>
  );

  const PreviewFrame = ({ caption, compact = false }: { caption: string; compact?: boolean }) => (
    <a href="https://leadrecovery.co.uk/" target="_blank" rel="noopener noreferrer" className={`block rounded-2xl border border-[#C8A24A]/18 bg-[#071426]/78 no-underline shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_24px_70px_rgba(0,0,0,0.34)] transition hover:border-[#C8A24A]/36 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_28px_80px_rgba(0,0,0,0.42)] ${compact ? 'p-2.5' : 'p-3'}`} aria-label="Open live Lead Recovery website">
      <div className={`${compact ? 'mb-2' : 'mb-3'} flex items-center justify-between gap-3`}>
        <span className="rounded-full border border-[#C8A24A]/22 bg-[#C8A24A]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#C8A24A]">Example preview</span>
        <span className="hidden items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-emerald-300 sm:inline-flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Live
        </span>
      </div>
      <img src={previewImage} alt="Example emergency roofing lead website preview" loading={compact ? 'lazy' : 'eager'} className={`${compact ? 'h-40 object-cover object-top sm:h-44 lg:h-48' : 'object-contain'} w-full rounded-xl border border-white/8 bg-[#020817]`} />
      <p className={`${compact ? 'mt-2' : 'mt-3'} text-[12px] leading-5 text-white/56`}>{caption}</p>
    </a>
  );

  return (
    <div id="lead-recovery-page" className="h-dvh min-h-screen overflow-y-auto overflow-x-hidden bg-[#020817] text-white [-webkit-overflow-scrolling:touch]">
      <Navbar onStartIntake={onStartIntake} />

      <main>
        {checkoutStatus === 'success' && (
          <div className="border-b border-[#C8A24A]/18 bg-[#C8A24A]/10 px-4 py-3 text-center text-[14px] font-semibold leading-6 text-white sm:px-6">
            Payment received. Your receipt, intake form, and next steps will be sent by email.
          </div>
        )}
        {checkoutStatus === 'cancelled' && (
          <div className="border-b border-white/10 bg-white/[0.04] px-4 py-3 text-center text-[14px] font-semibold leading-6 text-white/72 sm:px-6">
            Checkout cancelled. You can restart whenever you are ready.
          </div>
        )}
        <section className="relative overflow-hidden border-b border-[#C8A24A]/10 pt-28 pb-14 sm:pt-32 sm:pb-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_18%,rgba(200,162,74,0.12),transparent_34%),linear-gradient(180deg,#071426_0%,#020817_78%)]" />
          <div className="relative mx-auto grid max-w-[1320px] gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.75fr)] lg:items-center lg:px-8">
            <div>
              <span className="section-eyebrow text-[#C8A24A]">Roofing Lead Infrastructure</span>
              <h1 className="mt-4 text-[34px] font-black leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl lg:text-[56px]">Premium Emergency Roofing Websites, Built in 5 Working Days</h1>
              <p className="mt-5 max-w-2xl text-[17px] leading-7 text-white/70 sm:text-lg sm:leading-8">Capture qualified emergency roofing enquiries with SMS lead alerts, postcode coverage intelligence, and conversion-focused design — deployed under your brand in 5 working days.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href={managedLink} className="btn-primary min-h-11 rounded-md px-6 py-3 text-center text-[11px] uppercase tracking-[0.14em] no-underline">Start Managed Plan — £495 →</a>
                <a href="https://leadrecovery.co.uk/" target="_blank" rel="noopener noreferrer" className="btn-secondary-dark min-h-11 rounded-md px-6 py-3 text-center text-[11px] uppercase tracking-[0.14em] no-underline">See It Live ↗</a>
              </div>
              <div className="mt-7 grid gap-3 text-[13px] font-semibold text-white/72 sm:grid-cols-2">
                {['Live in 5 working days', 'Built around your roofing business', 'Calls and enquiries sent to your phone', 'No technical setup needed'].map((item) => (
                  <div key={item} className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#C8A24A]" />{item}</div>
                ))}
              </div>
            </div>
            <PreviewFrame caption="Demo preview only. Your website is built using your own business name, branding, phone number, service areas, and roofing services." />
          </div>
        </section>

        <section className="border-b border-white/8 py-14 sm:py-18">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
            <span className="section-eyebrow text-[#C8A24A]">Transparent Pricing</span>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.04em] text-white sm:text-[40px]">Choose how you want to run it</h2>
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <article className="relative rounded-2xl border border-[#C8A24A]/35 bg-[#071426]/88 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_28px_80px_rgba(0,0,0,0.38)]">
                <span className="absolute right-5 top-5 rounded-full bg-[#C8A24A] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#020817]">Recommended</span>
                <p className="pr-32 text-[13px] font-semibold leading-6 text-white/62">Same website, fully managed for you.</p>
                <h3 className="mt-5 text-2xl font-black tracking-[-0.035em] text-white">Managed Website</h3>
                <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#C8A24A]">£495 setup + £199/month from launch day</p>
                <p className="mt-3 text-[15px] leading-6 text-white/70">Best for roofers who want the website built, hosted, maintained, and managed for them.</p>
                <ul className="mt-5 grid gap-2">{managedIncludes.map((item) => <CheckItem key={item}>{item}</CheckItem>)}</ul>
                <p className="mt-5 text-[13px] font-semibold text-white/70">12-month minimum term. Cancel any time after the first 12 months.</p>
                <a href={managedLink} className="btn-primary mt-5 inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-center text-[11px] uppercase tracking-[0.14em] no-underline">Start Managed Plan — £495 →</a>
                <p className="mt-3 text-[12px] leading-5 text-white/50">The £199/month managed plan starts from launch day.</p>
              </article>

              <article className="rounded-2xl border border-white/10 bg-[#071426]/62 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_56px_rgba(0,0,0,0.28)]">
                <span className="w-fit rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/70">One-off</span>
                <p className="mt-4 text-[13px] font-semibold leading-6 text-white/62">Same website, handed over after completion.</p>
                <h3 className="mt-5 text-2xl font-black tracking-[-0.035em] text-white">Build & Handoff</h3>
                <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">£1,995 one-off build and handoff</p>
                <p className="mt-3 text-[15px] leading-6 text-white/70">Best for roofers who want to own the website outright and manage it themselves after launch.</p>
                <ul className="mt-5 grid gap-2">{oneOffIncludes.map((item) => <CheckItem key={item}>{item}</CheckItem>)}</ul>
                <a href={oneOffLink} className="btn-secondary-dark mt-5 inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-center text-[11px] uppercase tracking-[0.14em] no-underline">Choose One-Off Build — £1,995 →</a>
                <p className="mt-3 text-[12px] leading-5 text-white/50">Future changes or support are charged separately.</p>
              </article>
            </div>
            <div className="mx-auto mt-6 max-w-3xl text-center text-[13px] leading-6 text-white/56">
              <p>After payment, you'll complete a 5-minute build brief so we can start without back-and-forth.</p>
              <p>Your 5-working-day build starts once payment and the build brief are both complete.</p>
              <p>48-hour deposit refund. 60-day money-back guarantee if your site doesn't generate at least 3 qualified leads.</p>
              <p className="mt-1">Payment processed by Stripe. Checkout sends you straight to the build brief.</p>
            </div>
          </div>
        </section>

        <section id="included" className="hidden scroll-mt-24 border-b border-white/8 py-14 sm:py-18">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
            <span className="section-eyebrow text-[#C8A24A]">Everything Included</span>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.04em] text-white sm:text-[40px]">What you get with the managed plan</h2>
            <p className="mt-4 max-w-3xl text-[16px] leading-7 text-white/70">The managed plan is built for roofers who do not want to deal with websites, hosting, SMS systems, or technical setup. We build it, launch it, and keep the basics running for you.</p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {includedGroups.map((group) => (
                <article key={group.title} className="rounded-xl border border-[#C8A24A]/14 bg-[#071426]/72 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_54px_rgba(0,0,0,0.22)]">
                  <h3 className="text-lg font-black tracking-[-0.03em] text-white">{group.title}</h3>
                  <ul className="mt-4 grid gap-2">{group.items.map((item) => <CheckItem key={item}>{item}</CheckItem>)}</ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="hidden border-b border-white/8 py-14 sm:py-18">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
            <span className="section-eyebrow text-[#C8A24A]">See It In Action</span>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.04em] text-white sm:text-[40px]">A live-style roofing lead system built for urgent enquiries.</h2>
            <p className="mt-4 max-w-3xl text-[16px] leading-7 text-white/70">Show roofers how the website captures emergency roof repair enquiries, drives calls, and sends leads straight to their phone.</p>
            <div className="-mx-4 mt-7 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-4">
              {mobilePreviews.map((preview) => (
                <article key={preview.label} className="min-w-[210px] snap-start rounded-xl border border-[#C8A24A]/14 bg-[#071426]/72 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_44px_rgba(0,0,0,0.2)] sm:min-w-0">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="rounded-full border border-[#C8A24A]/20 bg-[#C8A24A]/8 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#C8A24A]">Demo preview</span>
                  </div>
                  <div className="flex h-[300px] items-center justify-center overflow-hidden rounded-lg border border-white/8 bg-[#020817] sm:h-[330px] lg:h-[360px]">
                    <img src={preview.src} alt={preview.alt} loading="lazy" className="h-full w-full object-contain" />
                  </div>
                  <h3 className="mt-3 text-[14px] font-black tracking-[-0.02em] text-white">{preview.label}</h3>
                </article>
              ))}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {['Click-to-call and WhatsApp buttons', 'Emergency enquiry form', 'SMS lead alerts to your phone'].map((item) => (
                <div key={item} className="rounded-xl border border-[#C8A24A]/14 bg-[#071426]/72 p-5 text-[15px] font-bold leading-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_44px_rgba(0,0,0,0.2)]">
                  <CheckCircle2 size={18} className="mb-3 text-[#C8A24A]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="hidden border-b border-white/8 py-14 sm:py-18">
          <div className="mx-auto grid max-w-[1320px] gap-6 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <span className="section-eyebrow text-[#C8A24A]">Monthly Tweak Included</span>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-[40px]">What counts as your included monthly tweak?</h2>
              <p className="mt-4 text-[16px] leading-7 text-white/70">Your managed plan includes 1 small website tweak per month. A small tweak is a simple change that takes under 30 minutes.</p>
              <p className="mt-4 text-[13px] font-semibold text-white/50">Unused tweaks do not roll over.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {tweakExamples.map((item) => <p key={item} className="rounded-lg border border-white/10 bg-[#071426]/72 p-4 text-[14px] font-semibold leading-6 text-white/72"><span className="mr-2 text-[#C8A24A]">→</span>{item}</p>)}
            </div>
          </div>
        </section>

        <section className="hidden border-b border-[#C8A24A]/20 bg-[#C8A24A]/[0.03] py-14 sm:py-18">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
            <span className="section-eyebrow text-[#C8A24A]">No Hidden Extras</span>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.04em] text-white sm:text-[40px]">Bigger changes are agreed before any extra charge.</h2>
            <p className="mt-4 max-w-3xl text-[16px] leading-7 text-white/70">Some work sits outside the managed plan. If you need extra work, we agree the price with you first. You are never charged for extra work without approval.</p>
            <p className="mt-5 rounded-xl border border-[#C8A24A]/24 bg-[#C8A24A]/10 p-4 text-[16px] font-bold leading-7 text-white">Extra work is charged at £75/hour or as a fixed quote agreed before work starts.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {paidExtras.map((item) => <p key={item} className="rounded-lg border border-white/10 bg-[#071426]/72 p-4 text-[14px] leading-6 text-white/68">{item}</p>)}
            </div>
          </div>
        </section>

        <section className="border-b border-white/8 py-14 sm:py-18">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
            <span className="section-eyebrow text-[#C8A24A]">How It Works</span>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.04em] text-white sm:text-[40px]">From payment + brief to live site - 5 working days.</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ['01', 'Pay online', 'Choose managed or one-off and complete Stripe checkout.'],
                ['02', 'Submit your build brief', 'After payment, you\'ll be sent straight to a simple form for your business name, phone number, service areas, logo/photo links, and website details.'],
                ['03', 'Your website goes live', 'Once payment and the brief are complete, your 5-working-day build starts. We launch your site and route leads to your phone.'],
              ].map(([number, title, copy]) => (
                <div key={number} className="rounded-xl border border-[#C8A24A]/14 bg-[#071426]/72 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_54px_rgba(0,0,0,0.22)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C8A24A]/34 bg-[#C8A24A]/10 text-[12px] font-black text-[#C8A24A]">{number}</div>
                  <h3 className="mt-5 text-lg font-black tracking-[-0.03em] text-white">{title}</h3>
                  <p className="mt-3 text-[14px] leading-6 text-white/70">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="hidden border-b border-white/8 py-14 sm:py-18">
          <div className="mx-auto grid max-w-[1320px] gap-6 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <div>
              <span className="section-eyebrow text-[#C8A24A]">One-Off Option</span>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-[40px]">Want to own it outright?</h2>
              <p className="mt-4 text-[16px] leading-7 text-white/70">Some roofers prefer to pay once and manage everything themselves. The one-off option gives you the same custom emergency roofing website, then it is handed over after completion.</p>
              <p className="mt-5 text-3xl font-black tracking-[-0.04em] text-[#C8A24A]">£1,995 one-off build and handoff</p>
              <p className="mt-4 rounded-xl border border-white/10 bg-[#071426]/72 p-4 text-[14px] leading-6 text-white/70">After handoff, you are responsible for hosting, domain, SMS account, database, updates, and future changes.</p>
              <a href={oneOffLink} className="btn-secondary-dark mt-5 inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-center text-[11px] uppercase tracking-[0.14em] no-underline">Choose One-Off Build — £1,995</a>
              <p className="mt-3 text-[12px] leading-5 text-white/50">Post-handoff support is charged at £75/hour or by fixed quote agreed before work starts.</p>
            </div>
            <div className="rounded-xl border border-[#C8A24A]/14 bg-[#071426]/72 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_54px_rgba(0,0,0,0.22)]">
              <h3 className="text-lg font-black tracking-[-0.03em] text-white">Included</h3>
              <ul className="mt-4 grid gap-2">
                {['Custom emergency roofing website', 'Business branding and service area setup', 'Lead form and call setup', 'Built within the same 5-working-day target after intake details are received', 'Handoff after completion', 'No monthly support'].map((item) => <CheckItem key={item}>{item}</CheckItem>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="hidden border-b border-white/8 py-14 sm:py-18">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
            <span className="section-eyebrow text-[#C8A24A]">Compare Options</span>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.04em] text-white sm:text-[40px]">Managed plan or one-off build?</h2>
            <div className="mt-8 overflow-hidden rounded-2xl border border-[#C8A24A]/14 bg-[#071426]/72">
              <div className="hidden grid-cols-[1fr_1fr_1fr] border-b border-white/10 bg-white/[0.03] text-[12px] font-black uppercase tracking-[0.12em] text-[#C8A24A] md:grid">
                <div className="p-4">Feature</div><div className="p-4">Managed Plan</div><div className="p-4">One-Off Build</div>
              </div>
              {comparisonRows.map(([feature, managed, oneOff]) => (
                <div key={feature} className="grid gap-2 border-b border-white/8 p-4 last:border-b-0 md:grid-cols-[1fr_1fr_1fr] md:gap-0">
                  <div className="text-[13px] font-black uppercase tracking-[0.08em] text-white md:text-[14px] md:normal-case md:tracking-normal">{feature}</div>
                  <div className="text-[14px] leading-6 text-white/72"><span className="mr-2 text-[#C8A24A] md:hidden">Managed:</span>{managed}</div>
                  <div className="text-[14px] leading-6 text-white/72"><span className="mr-2 text-[#C8A24A] md:hidden">One-off:</span>{oneOff}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="hidden border-b border-white/8 py-14 sm:py-18">
          <div className="mx-auto max-w-[980px] px-4 sm:px-6 lg:px-8">
            <span className="section-eyebrow text-[#C8A24A]">FAQ</span>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-[40px]">Common questions from roofers</h2>
            <div className="mt-8 grid gap-4">
              {faqs.map(([question, answer]) => (
                <article key={question} className="rounded-xl border border-white/10 bg-[#071426]/72 p-5">
                  <h3 className="text-[16px] font-black tracking-[-0.02em] text-white">{question}</h3>
                  <p className="mt-2 text-[14px] leading-6 text-white/70">{answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="hidden border-b border-white/8 py-14 text-center sm:py-18">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-[40px]">Ready to get your roofing lead website built?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-7 text-white/70">Start with the £495 managed setup payment. Your website is built around your business and launched within 5 working days after your intake details are received.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={managedLink} className="btn-primary min-h-11 rounded-md px-6 py-3 text-center text-[11px] uppercase tracking-[0.14em] no-underline">Start Managed Plan — £495 Setup</a>
              <a href={oneOffLink} className="btn-secondary-dark min-h-11 rounded-md px-6 py-3 text-center text-[11px] uppercase tracking-[0.14em] no-underline">Choose One-Off Build — £1,995</a>
            </div>
            <p className="mx-auto mt-4 max-w-xl text-[13px] leading-6 text-white/50">Payment processed securely by Stripe. Intake form and next steps sent by email.</p>
          </div>
        </section>

        <section className="py-6 text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <p className="text-[13px] leading-6 text-white/60">Built by Lion Tech Innovations — London-based digital infrastructure company. Companies House 17068390.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  const route = useHistoryRoute();
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const openIntake = () => setIsIntakeOpen(true);

  return (
    <div className="selection:bg-[#6EA8FF]/30 selection:text-[#0B1F35]">
      {route === '/privacy-policy' && <PrivacyPolicy onStartIntake={openIntake} />}
      {route === '/terms-and-conditions' && <TermsAndConditions onStartIntake={openIntake} />}
      {route === '/uk-ai-infrastructure' && <UkAiInfrastructure onStartIntake={openIntake} />}
      {route === '/saas-platform-development' && <SaasPlatformDevelopment onStartIntake={openIntake} />}
      {route === '/ai-intake-systems' && <AiIntakeSystems onStartIntake={openIntake} />}
      {route === '/lead-recovery' && <LeadRecoveryPage onStartIntake={openIntake} />}
      {route === '/roofing-brief' && <RoofingBriefPage onStartIntake={openIntake} />}
      {route === '/' && <HomePage onStartIntake={openIntake} />}
      <IntakeDialog open={isIntakeOpen} onClose={() => setIsIntakeOpen(false)} />
    </div>
  );
}
