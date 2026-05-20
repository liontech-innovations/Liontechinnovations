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
    title: 'Lead Recovery — Premium Emergency Roofing Websites | Lion Tech Innovations',
    description: 'Premium emergency roofing websites with qualified SMS lead alerts, postcode coverage, and conversion-engineered design. Built in 5 working days. £995 deposit. UK infrastructure company.',
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
    window.location.pathname === '/lead-recovery'
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

const LeadRecoveryPage = ({ onStartIntake }: { onStartIntake: () => void }) => {
  const meta = routeMeta['/lead-recovery'];
  const stripeLink = 'https://buy.stripe.com/aFadRb3UNcOIafU2oR5wI04';
  const demoSlots = [
    { label: '/images/lead-recovery/hero-mock.png', alt: 'Emergency roofing homepage' },
    { label: '/images/lead-recovery/wizard-mock.png', alt: '5-step estimate assistant' },
    { label: '/images/lead-recovery/sms-mock.png', alt: 'Qualified SMS lead alert' },
  ];
  const included = [
    'Emergency-positioned homepage built under your brand',
    '5-step qualified estimate assistant',
    'Real-time Twilio SMS lead alerts on your phone',
    'Postcode-based local coverage intelligence',
    'WhatsApp and one-tap call integration',
    'Photo upload for roof damage submissions',
    'Mobile-first conversion architecture',
    'Google Maps service-area display',
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

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <Navbar onStartIntake={onStartIntake} />

      <main>
        <section className="relative overflow-hidden border-b border-[#C8A24A]/10 pt-28 pb-14 sm:pt-32 sm:pb-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_18%,rgba(200,162,74,0.12),transparent_34%),linear-gradient(180deg,#071426_0%,#020817_78%)]" />
          <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="section-eyebrow text-[#C8A24A]">Roofing Lead Infrastructure</span>
              <h1 className="mt-4 text-[34px] font-black leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl lg:text-[58px]">Premium Emergency Roofing Websites, Built in 5 Working Days</h1>
              <p className="mt-5 max-w-2xl text-[17px] leading-7 text-white/70 sm:text-lg sm:leading-8">Capture qualified emergency roofing enquiries with SMS lead alerts, postcode coverage intelligence, and conversion-engineered design — deployed under your brand in 5 working days.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href={stripeLink} target="_blank" rel="noopener noreferrer" className="btn-primary min-h-11 rounded-md px-6 py-3 text-center text-[11px] uppercase tracking-[0.14em] no-underline">Secure Your Build Slot — £995 Deposit →</a>
                <a href="https://leadrecovery.co.uk" target="_blank" rel="noopener noreferrer" className="btn-secondary-dark min-h-11 rounded-md px-6 py-3 text-center text-[11px] uppercase tracking-[0.14em] no-underline">See it live ↗</a>
              </div>
              <div className="mt-7 grid gap-3 text-[13px] font-semibold text-white/72 sm:grid-cols-3">
                <div className="flex items-center gap-2"><Zap size={16} className="text-[#C8A24A]" />Live in 5 working days</div>
                <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#C8A24A]" />Stripe-secured payment</div>
                <div className="flex items-center gap-2"><MapPin size={16} className="text-[#C8A24A]" />UK-based infrastructure company</div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/8 py-14 sm:py-18">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
            <span className="section-eyebrow text-[#C8A24A]">See It In Action</span>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.04em] text-white sm:text-[40px]">A live, working roofing lead system.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {demoSlots.map((slot) => (
                <div key={slot.label} aria-label={slot.alt} className="flex aspect-[9/16] items-center justify-center rounded-xl border border-[#C8A24A]/18 bg-[#071426] p-5 text-center text-[12px] font-bold leading-5 tracking-[0.08em] text-white/56 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_54px_rgba(0,0,0,0.25)]">{slot.label}</div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/8 py-14 sm:py-18">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
            <span className="section-eyebrow text-[#C8A24A]">What's Included</span>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.04em] text-white sm:text-[40px]">Everything you need to capture and qualify emergency roofing leads.</h2>
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {included.map((item) => (
                <p key={item} className="text-[15px] font-semibold leading-7 text-white/72"><span className="mr-2 text-[#C8A24A]">→</span>{item}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/8 py-14 sm:py-18">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
            <span className="section-eyebrow text-[#C8A24A]">How It Works</span>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.04em] text-white sm:text-[40px]">From deposit to live site — 5 working days.</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ['01', 'Reserve your slot', "Pay the £995 deposit on this page. You'll receive a confirmation email and an intake form within 1 hour."],
                ['02', 'Complete the intake form', '10 questions, takes 5 minutes. Tell us your brand name, service area, phone number, and which roofing services you offer.'],
                ['03', 'Your site goes live', 'Within 5 working days. You receive the URL, the SMS alert system is tested with your number, and your phone starts buzzing with qualified leads.'],
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

        <section className="border-b border-white/8 py-14 text-center sm:py-18">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <span className="section-eyebrow text-[#C8A24A]">Transparent Pricing</span>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-[40px]">£995 today. £1,000 on launch. That's it.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-7 text-white/70">Optional £149/month support package available after launch (hosting, SMS credits, monthly performance review). Cancel any time.</p>
            <p className="mx-auto mt-4 max-w-2xl text-[13px] leading-6 text-white/50">48-hour deposit refund. 60-day money-back guarantee if your site doesn't generate at least 3 qualified leads.</p>
          </div>
        </section>

        <section className="border-b border-white/8 py-14 text-center sm:py-18">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <span className="section-eyebrow text-[#C8A24A]">Ready To Start?</span>
            <div className="mt-5">
              <a href={stripeLink} target="_blank" rel="noopener noreferrer" className="btn-primary min-h-11 rounded-md px-6 py-3 text-center text-[11px] uppercase tracking-[0.14em] no-underline">Secure Your Build Slot — £995 Deposit →</a>
            </div>
            <p className="mx-auto mt-4 max-w-xl text-[13px] leading-6 text-white/50">Payment processed by Stripe. Receipt and intake form delivered instantly to your email.</p>
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
      {route === '/' && <HomePage onStartIntake={openIntake} />}
      <IntakeDialog open={isIntakeOpen} onClose={() => setIsIntakeOpen(false)} />
    </div>
  );
}
