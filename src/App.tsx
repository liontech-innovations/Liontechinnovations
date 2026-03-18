import React, { useState, useEffect } from 'react';
import {
  Building2,
  Cpu,
  Globe,
  Layers,
  Server,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  Mail,
  MapPin,
  Phone,
  Zap,
  Shield,
  BarChart3,
  ExternalLink,
  ArrowUpRight,
  ChevronUp,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   HASH ROUTER — supports /, /privacy-policy, /terms-and-conditions
   ───────────────────────────────────────────── */
function useHashRoute() {
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash.replace('#', '') || '/';
    return hash;
  });

  useEffect(() => {
    const handler = () => {
      setRoute(window.location.hash.replace('#', '') || '/');
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return route;
}

/* ─────────────────────────────────────────────
   SMOOTH SCROLL HELPER
   ───────────────────────────────────────────── */
function scrollToSection(id: string) {
  // Ensure we're on the home page first
  if (window.location.hash && window.location.hash !== '#/' && !window.location.hash.startsWith('#/#')) {
    window.location.hash = '/';
    setTimeout(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  } else {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ─────────────────────────────────────────────
   NAVBAR
   ───────────────────────────────────────────── */
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', id: 'services' },
    { label: 'Platforms', id: 'platforms' },
    { label: 'Company', id: 'company' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleNav = (id: string) => {
    setMobileMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/92 backdrop-blur-xl border-b border-[#5FA8FF]/10 py-3 shadow-[0_2px_20px_rgba(95,168,255,0.08)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a
            href="#/"
            className="flex items-center gap-2.5 group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Building2
              className="text-[#5FA8FF] group-hover:scale-105 transition-transform"
              size={26}
            />
            <span className="text-[#1B2A3A] font-bold text-xl tracking-wide">
              LION TECH{' '}
              <span className="text-gradient-ombre font-normal">INNOVATIONS</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-9">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className="text-[#455A6E] hover:text-[#1B2A3A] transition-colors text-[13px] uppercase tracking-[0.18em] font-semibold bg-transparent border-none cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav('contact')}
              className="btn-primary px-6 py-2.5 rounded-lg text-[12px] uppercase tracking-[0.15em]"
            >
              Get Started
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#1B2A3A] bg-transparent border-none cursor-pointer"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-xl absolute top-full left-0 w-full border-t border-[#5FA8FF]/10 shadow-xl">
          <div className="px-5 pt-3 pb-6 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className="block w-full text-left px-3 py-3.5 text-[#1B2A3A] hover:bg-[#EDF2FA] rounded-lg text-[13px] uppercase tracking-[0.15em] font-semibold bg-transparent border-none cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 px-3">
              <button
                onClick={() => handleNav('contact')}
                className="w-full btn-primary px-6 py-3.5 rounded-lg text-[12px] uppercase tracking-[0.15em]"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

/* ─────────────────────────────────────────────
   HERO — Big Ben + Thames + Westminster — wide panoramic, mobile-safe
   ───────────────────────────────────────────── */
const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image — Westminster / Big Ben wide daylight panoramic */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-no-repeat hero-image-enhance"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=85&w=2400&auto=format&fit=crop")',
          backgroundPosition: 'center 40%',
        }}
      >
        {/* Near-invisible top veil */}
        <div className="absolute inset-0 hero-overlay"></div>
        {/* Warm sunlight diagonal */}
        <div className="absolute inset-0 hero-warm-tint"></div>
        {/* Cinematic vignette — focus toward center */}
        <div className="absolute inset-0 hero-vignette"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full pt-24 pb-32">
        {/* Eyebrow */}
        <div className="animate-fade-in-up">
          <span className="inline-block text-[11px] font-bold text-[#3A4F63] uppercase tracking-[0.35em] mb-6 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/30 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            London-Based Digital Infrastructure
          </span>
        </div>

        {/* Headline — wider tracking on BUILD/SCALE, sharper gradient on AUTOMATE */}
        <h1
          className="font-display tight-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#0F1D2B] mb-8 animate-fade-in-up animate-delay-100 uppercase"
          style={{ textShadow: '0 2px 24px rgba(255,255,255,0.65), 0 1px 4px rgba(255,255,255,0.45)', letterSpacing: '-0.01em' }}
        >
          <span style={{ letterSpacing: '0.02em' }}>BUILD.</span>{' '}
          <span className="text-gradient-ombre" style={{ filter: 'drop-shadow(0 2px 16px rgba(255,255,255,0.40))' }}>AUTOMATE.</span>{' '}
          <span style={{ letterSpacing: '0.02em' }}>SCALE.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg md:text-xl text-[#2C3E50] max-w-2xl mx-auto font-semibold leading-relaxed mb-12 animate-fade-in-up animate-delay-200"
          style={{ textShadow: '0 1px 14px rgba(255,255,255,0.55)' }}
        >
          Institutional-grade digital infrastructure and automation solutions for modern enterprises.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animate-delay-300">
          <button
            onClick={() => scrollToSection('contact')}
            className="btn-primary px-9 py-4 rounded-lg text-[13px] uppercase tracking-[0.15em] gap-2.5"
          >
            Book a Consultation
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => scrollToSection('services')}
            className="btn-secondary px-9 py-4 rounded-lg text-[13px] uppercase tracking-[0.15em]"
          >
            View Services
          </button>
        </div>
      </div>

      {/* Minimal bottom blend — barely visible, skyline stays fully clear */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#F5F7FB]/90 to-transparent pointer-events-none"></div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   SERVICES
   ───────────────────────────────────────────── */
const Services = () => {
  const services = [
    {
      icon: <Globe size={26} />,
      title: 'Corporate Website Design',
      description:
        'High-end, secure, and performant web presences that reflect your corporate identity and establish immediate trust.',
    },
    {
      icon: <Layers size={26} />,
      title: 'Landing Pages & Funnels',
      description:
        'Conversion-optimised digital entry points designed to capture high-value leads and drive measurable ROI.',
    },
    {
      icon: <Cpu size={26} />,
      title: 'AI Automation Systems',
      description:
        'Intelligent workflows that reduce operational overhead, minimise human error, and accelerate processing times.',
    },
    {
      icon: <Zap size={26} />,
      title: 'Business Process Automation',
      description:
        'End-to-end digitisation of legacy processes, connecting disparate systems into unified, efficient pipelines.',
    },
    {
      icon: <Shield size={26} />,
      title: 'Custom SaaS Interfaces',
      description:
        'Bespoke software-as-a-service platforms built with robust architectures for internal use or commercial deployment.',
    },
    {
      icon: <Server size={26} />,
      title: 'Digital Infrastructure',
      description:
        'Scalable cloud deployments, database architecture, and API integrations for enterprise-grade reliability.',
    },
  ];

  return (
    <section id="services" className="py-32 bg-section-light page-texture">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16">
          <span className="text-[11px] font-bold text-[#5FA8FF] uppercase tracking-[0.35em] mb-3 block">
            Our Capabilities
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1B2A3A] tight-headline mb-5">
            Enterprise-Grade Solutions
          </h2>
          <p className="text-[#455A6E] text-lg max-w-xl leading-relaxed">
            We architect and deploy robust digital systems that solve complex business challenges and drive operational efficiency.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="institutional-card p-8 group"
            >
              <div className="w-11 h-11 rounded-lg bg-[#EDF2FA] flex items-center justify-center text-[#5FA8FF] mb-6 group-hover:bg-gradient-to-br group-hover:from-[#5FA8FF] group-hover:to-[#7C5CFF] group-hover:text-white transition-all duration-300">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold text-[#1B2A3A] mb-3 tracking-tight">
                {service.title}
              </h3>
              <p className="text-[#455A6E] leading-relaxed text-[15px]">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   PLATFORMS / DEPLOYED SYSTEMS
   ───────────────────────────────────────────── */
const Platforms = () => {
  const projects = [
    {
      title: 'ClearVisa UK',
      url: 'https://clearvisas.co.uk',
      description:
        'Immigration risk analysis platform helping users assess UK visa refusal risk. Built with secure data handling and real-time compliance intelligence.',
      tag: 'Compliance SaaS',
    },
    {
      title: 'CalcFee',
      url: 'https://www.calcfee.com/',
      description:
        'Financial calculator platform designed to uncover hidden costs and fees. Features real-time data processing and premium PDF report generation.',
      tag: 'FinTech Tool',
    },
    {
      title: 'BundleBase',
      url: 'https://bundlebase.com',
      description:
        'Document bundling system for UK legal processes and evidence preparation. Automated PDF generation and structured bundle compilation.',
      tag: 'Legal Tech',
    },
  ];

  return (
    <section id="platforms" className="py-32 bg-section-alt relative overflow-hidden">
      {/* Subtle decorative gradient blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#5FA8FF]/8 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#7C5CFF]/6 to-transparent rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[11px] font-bold text-[#5FA8FF] uppercase tracking-[0.35em] mb-3 block">
            Deployed Systems
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1B2A3A] tight-headline mb-5">
            Live Production Platforms
          </h2>
          <p className="text-[#455A6E] text-lg max-w-xl mx-auto leading-relaxed">
            Real-world infrastructure powering critical business operations across the UK.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {projects.map((project, index) => (
            <a
              key={index}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="platform-card p-8 flex flex-col h-full group cursor-pointer no-underline"
            >
              {/* Tag + Status */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-bold text-[#5FA8FF] uppercase tracking-[0.2em] bg-[#EDF2FA] px-3 py-1 rounded-full">
                  {project.tag}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-[#455A6E]/60 uppercase tracking-widest">Live</span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#1B2A3A] mb-3 tracking-tight group-hover:text-[#5FA8FF] transition-colors">
                {project.title}
              </h3>
              <p className="text-[#455A6E] text-[15px] leading-relaxed mb-8 flex-grow">
                {project.description}
              </p>

              <div className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.15em] text-[#1B2A3A] group-hover:text-[#5FA8FF] transition-colors">
                Visit Platform
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   COMPANY
   ───────────────────────────────────────────── */
const Company = () => {
  const highlights = [
    'Structured UK digital infrastructure company',
    'Enterprise-grade design & automation',
    'Operational reliability & uptime focus',
    'London-based, serving UK & global clients',
  ];

  return (
    <section id="company" className="py-32 bg-section-light page-texture">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div>
            <span className="text-[11px] font-bold text-[#5FA8FF] uppercase tracking-[0.35em] mb-3 block">
              Corporate Excellence
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1B2A3A] tight-headline mb-7">
              Engineered for Serious Business
            </h2>
            <p className="text-[17px] text-[#455A6E] mb-8 leading-relaxed">
              Lion Tech Innovations Ltd is a structured UK digital infrastructure company delivering
              high-performance systems — from websites and SaaS platforms to automation workflows and
              AI-powered business solutions — designed for organisations that demand operational
              reliability, premium presentation, and enterprise-grade execution.
            </p>
            <div className="space-y-4">
              {highlights.map((item, i) => (
                <div key={i} className="flex items-center gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-[#EDF2FA] flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="text-[#5FA8FF]" size={14} />
                  </div>
                  <span className="text-[#1B2A3A] font-semibold text-[15px]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — stat cards */}
          <div className="grid grid-cols-2 gap-5">
            <div className="institutional-card p-7">
              <BarChart3 className="text-[#5FA8FF] mb-5" size={28} />
              <h3 className="text-3xl font-bold text-[#1B2A3A] mb-1.5 font-display">99.9%</h3>
              <p className="text-[11px] font-bold text-[#455A6E] uppercase tracking-[0.18em]">Uptime Target</p>
            </div>
            <div className="institutional-card p-7 mt-8">
              <Shield className="text-[#5FA8FF] mb-5" size={28} />
              <h3 className="text-3xl font-bold text-[#1B2A3A] mb-1.5 font-display">24/7</h3>
              <p className="text-[11px] font-bold text-[#455A6E] uppercase tracking-[0.18em]">Monitoring</p>
            </div>
            <div className="institutional-card p-7">
              <Cpu className="text-[#5FA8FF] mb-5" size={28} />
              <h3 className="text-3xl font-bold text-[#1B2A3A] mb-1.5 font-display">3+</h3>
              <p className="text-[11px] font-bold text-[#455A6E] uppercase tracking-[0.18em]">Live Platforms</p>
            </div>
            <div className="institutional-card p-7 mt-8">
              <Globe className="text-[#5FA8FF] mb-5" size={28} />
              <h3 className="text-3xl font-bold text-[#1B2A3A] mb-1.5 font-display">UK</h3>
              <p className="text-[11px] font-bold text-[#455A6E] uppercase tracking-[0.18em]">Registered Entity</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   CONTACT / CTA
   ───────────────────────────────────────────── */
const Contact = () => {
  return (
    <section id="contact" className="py-32 bg-section-alt relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#5FA8FF]/8 via-[#7C5CFF]/4 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-[11px] font-bold text-[#5FA8FF] uppercase tracking-[0.35em] mb-3 block">
            Get in Touch
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1B2A3A] tight-headline mb-5">
            Ready to Build Something Serious?
          </h2>
          <p className="text-[#455A6E] text-lg max-w-xl mx-auto leading-relaxed">
            Schedule a consultation to discuss your digital infrastructure requirements with our technical directors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Email */}
          <a
            href="mailto:contact@liontechinnovations.co.uk"
            className="institutional-card p-7 text-center group no-underline cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-[#EDF2FA] flex items-center justify-center mx-auto mb-4 group-hover:bg-gradient-to-br group-hover:from-[#5FA8FF] group-hover:to-[#7C5CFF] group-hover:text-white text-[#5FA8FF] transition-all duration-300">
              <Mail size={22} />
            </div>
            <p className="text-[13px] font-bold text-[#1B2A3A] mb-1">Email</p>
            <p className="text-[14px] text-[#455A6E]">contact@liontechinnovations.co.uk</p>
          </a>

          {/* Phone */}
          <div className="institutional-card p-7 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#EDF2FA] flex items-center justify-center mx-auto mb-4 text-[#5FA8FF]">
              <Phone size={22} />
            </div>
            <p className="text-[13px] font-bold text-[#1B2A3A] mb-1">Phone</p>
            <p className="text-[14px] text-[#455A6E]">+44 (0) 20 1234 5678</p>
          </div>

          {/* Location */}
          <div className="institutional-card p-7 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#EDF2FA] flex items-center justify-center mx-auto mb-4 text-[#5FA8FF]">
              <MapPin size={22} />
            </div>
            <p className="text-[13px] font-bold text-[#1B2A3A] mb-1">Location</p>
            <p className="text-[14px] text-[#455A6E]">London, United Kingdom</p>
          </div>
        </div>

        <div className="text-center">
          <a
            href="mailto:contact@liontechinnovations.co.uk"
            className="btn-primary px-10 py-4 rounded-lg text-[13px] uppercase tracking-[0.15em] gap-2.5 no-underline"
          >
            Book a Consultation
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   FOOTER
   ───────────────────────────────────────────── */
const Footer = () => {
  return (
    <footer className="bg-white pt-20 pb-8 border-t border-[#5FA8FF]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <a href="#/" className="flex items-center gap-2 mb-5 no-underline">
              <Building2 className="text-[#5FA8FF]" size={24} />
              <span className="text-[#1B2A3A] font-bold text-lg tracking-wide">LION TECH</span>
            </a>
            <p className="text-[#455A6E] text-sm leading-relaxed max-w-xs">
              Institutional-grade digital infrastructure, automation, and AI solutions for modern enterprises.
            </p>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-5 text-[#1B2A3A]">Solutions</h4>
            <ul className="space-y-3">
              {['Web Infrastructure', 'AI Automation', 'SaaS Development', 'Process Automation'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollToSection('services')}
                    className="text-[#455A6E] hover:text-[#1B2A3A] transition-colors text-sm font-medium bg-transparent border-none cursor-pointer p-0"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Platforms */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-5 text-[#1B2A3A]">Platforms</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://clearvisas.co.uk" target="_blank" rel="noopener noreferrer" className="text-[#455A6E] hover:text-[#1B2A3A] transition-colors text-sm font-medium no-underline inline-flex items-center gap-1.5">
                  ClearVisa UK <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href="https://www.calcfee.com/" target="_blank" rel="noopener noreferrer" className="text-[#455A6E] hover:text-[#1B2A3A] transition-colors text-sm font-medium no-underline inline-flex items-center gap-1.5">
                  CalcFee <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href="https://bundlebase.com" target="_blank" rel="noopener noreferrer" className="text-[#455A6E] hover:text-[#1B2A3A] transition-colors text-sm font-medium no-underline inline-flex items-center gap-1.5">
                  BundleBase <ExternalLink size={11} />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-5 text-[#1B2A3A]">Contact</h4>
            <ul className="space-y-3.5">
              <li className="flex items-center gap-3 text-[#455A6E] text-sm">
                <Mail size={15} className="text-[#5FA8FF] flex-shrink-0" />
                <span>contact@liontechinnovations.co.uk</span>
              </li>
              <li className="flex items-center gap-3 text-[#455A6E] text-sm">
                <Phone size={15} className="text-[#5FA8FF] flex-shrink-0" />
                <span>+44 (0) 20 1234 5678</span>
              </li>
              <li className="flex items-center gap-3 text-[#455A6E] text-sm">
                <MapPin size={15} className="text-[#5FA8FF] flex-shrink-0" />
                <span>London, United Kingdom</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#5FA8FF]/10 pt-7 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#455A6E]/60 text-[11px] uppercase tracking-[0.15em] font-semibold">
            &copy; {new Date().getFullYear()} Lion Tech Innovations Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#/privacy-policy" className="text-[#455A6E]/60 hover:text-[#1B2A3A] text-[11px] uppercase tracking-[0.15em] font-semibold no-underline transition-colors">
              Privacy Policy
            </a>
            <a href="#/terms-and-conditions" className="text-[#455A6E]/60 hover:text-[#1B2A3A] text-[11px] uppercase tracking-[0.15em] font-semibold no-underline transition-colors">
              Terms & Conditions
            </a>
          </div>
          <p className="text-[#455A6E]/60 text-[11px] uppercase tracking-[0.15em] font-semibold">
            Company registered in England & Wales · No. 17068390
          </p>
        </div>
      </div>
    </footer>
  );
};

/* ─────────────────────────────────────────────
   PRIVACY POLICY PAGE
   ───────────────────────────────────────────── */
const PrivacyPolicy = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <Navbar />
      <div className="pt-32 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <a href="#/" className="text-[#5FA8FF] text-sm font-semibold mb-6 inline-flex items-center gap-1.5 no-underline hover:underline">
          &larr; Back to Home
        </a>
        <h1 className="font-display text-4xl font-bold text-[#1B2A3A] mb-3 tight-headline">Privacy Policy</h1>
        <p className="text-[#455A6E] text-sm mb-10">Last updated: March 2026</p>

        <div className="legal-content">
          <h2>1. Introduction</h2>
          <p>
            Lion Tech Innovations Ltd ("we", "our", "us"), registered in England and Wales
            (Company No. 17068390), is committed to protecting the privacy of individuals
            who visit our website and use our services. This Privacy Policy explains how we collect, use, and
            safeguard your personal information in accordance with the UK General Data Protection Regulation
            (UK GDPR) and the Data Protection Act 2018.
          </p>

          <h2>2. Information We Collect</h2>
          <p>We may collect the following types of personal information:</p>
          <ul>
            <li>Contact information (name, email address, phone number) when you submit enquiries</li>
            <li>Technical data (IP address, browser type, device information) collected automatically via cookies and analytics</li>
            <li>Usage data relating to how you navigate and interact with our website</li>
            <li>Business information you provide when discussing potential projects or engagements</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use your personal data to:</p>
          <ul>
            <li>Respond to your enquiries and provide requested services</li>
            <li>Improve our website and user experience</li>
            <li>Send relevant communications about our services (with your consent)</li>
            <li>Comply with legal obligations and protect our legitimate interests</li>
          </ul>

          <h2>4. Data Sharing</h2>
          <p>
            We do not sell your personal data. We may share information with trusted third-party service providers
            who assist in operating our website and conducting business, provided they agree to keep your
            information confidential. We may also disclose data where required by law or to protect our rights.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            We retain personal data only for as long as necessary to fulfil the purposes for which it was collected,
            or as required by applicable law. Enquiry data is typically retained for up to 24 months.
          </p>

          <h2>6. Your Rights</h2>
          <p>Under UK GDPR, you have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability</li>
            <li>Lodge a complaint with the Information Commissioner's Office (ICO)</li>
          </ul>

          <h2>7. Cookies</h2>
          <p>
            Our website uses cookies to enhance your browsing experience. You can control cookie preferences
            through your browser settings. Essential cookies are required for the website to function properly.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            For questions regarding this Privacy Policy or to exercise your data rights, please contact us at:
            <br />
            <strong>Email:</strong> contact@liontechinnovations.co.uk
            <br />
            <strong>Address:</strong> London, United Kingdom
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

/* ─────────────────────────────────────────────
   TERMS & CONDITIONS PAGE
   ───────────────────────────────────────────── */
const TermsAndConditions = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <Navbar />
      <div className="pt-32 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <a href="#/" className="text-[#5FA8FF] text-sm font-semibold mb-6 inline-flex items-center gap-1.5 no-underline hover:underline">
          &larr; Back to Home
        </a>
        <h1 className="font-display text-4xl font-bold text-[#1B2A3A] mb-3 tight-headline">Terms & Conditions</h1>
        <p className="text-[#455A6E] text-sm mb-10">Last updated: March 2026</p>

        <div className="legal-content">
          <h2>1. Introduction</h2>
          <p>
            These Terms and Conditions govern your use of the Lion Tech Innovations Ltd website and our
            provision of services. By accessing our website or engaging our services, you agree to be bound
            by these terms. Lion Tech Innovations Ltd is a company registered in England and Wales (Company No. 17068390).
          </p>

          <h2>2. Services</h2>
          <p>
            Lion Tech Innovations Ltd provides digital infrastructure, web development, automation, and related
            technology services. All services are provided on a project basis, subject to individual agreements
            or statements of work.
          </p>

          <h2>3. Intellectual Property</h2>
          <p>
            All content on this website — including text, graphics, logos, and software — is the property of
            Lion Tech Innovations Ltd or its licensors and is protected by applicable intellectual property laws.
            You may not reproduce, distribute, or create derivative works without our written permission.
          </p>

          <h2>4. Client Obligations</h2>
          <p>When engaging our services, you agree to:</p>
          <ul>
            <li>Provide accurate and complete information necessary for project delivery</li>
            <li>Respond to requests for feedback and approval in a timely manner</li>
            <li>Ensure you have the rights to any materials you provide to us</li>
            <li>Pay all fees as agreed in the relevant statement of work</li>
          </ul>

          <h2>5. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Lion Tech Innovations Ltd shall not be liable for any
            indirect, incidental, or consequential damages arising from use of our website or services.
            Our total liability shall not exceed the fees paid for the specific service giving rise to the claim.
          </p>

          <h2>6. Warranties</h2>
          <p>
            Our website is provided on an "as is" basis. While we strive for accuracy, we do not warrant
            that the website will be uninterrupted, error-free, or free from harmful components. Services
            are delivered with reasonable skill and care in accordance with industry standards.
          </p>

          <h2>7. Termination</h2>
          <p>
            We reserve the right to suspend or terminate access to our website at any time. Project-specific
            termination provisions will be set out in individual agreements.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These Terms and Conditions are governed by and construed in accordance with the laws of England
            and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England
            and Wales.
          </p>

          <h2>9. Contact</h2>
          <p>
            For questions about these Terms and Conditions, please contact us at:
            <br />
            <strong>Email:</strong> contact@liontechinnovations.co.uk
            <br />
            <strong>Address:</strong> London, United Kingdom
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

/* ─────────────────────────────────────────────
   HOME PAGE (assembles all sections)
   ───────────────────────────────────────────── */
const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <Navbar />
      <Hero />
      <div className="section-divider"></div>
      <Services />
      <div className="section-divider"></div>
      <Platforms />
      <div className="section-divider"></div>
      <Company />
      <div className="section-divider"></div>
      <Contact />
      <Footer />
    </div>
  );
};

/* ─────────────────────────────────────────────
   APP — Hash Router
   ───────────────────────────────────────────── */
export default function App() {
  const route = useHashRoute();

  return (
    <div className="selection:bg-[#5FA8FF]/30 selection:text-[#1B2A3A]">
      {route === '/privacy-policy' && <PrivacyPolicy />}
      {route === '/terms-and-conditions' && <TermsAndConditions />}
      {(route === '/' || (route !== '/privacy-policy' && route !== '/terms-and-conditions')) && <HomePage />}
    </div>
  );
}
