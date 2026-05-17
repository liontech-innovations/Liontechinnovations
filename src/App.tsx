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

const navLinks = [
  { label: 'Services', id: 'services' },
  { label: 'Platforms', id: 'platforms' },
  { label: 'Company', id: 'company' },
  { label: 'Contact', id: 'contact' },
];

const techStack = [
  'Anthropic',
  'NVIDIA',
  'Vercel',
  'AWS',
  'Supabase',
  'Stripe',
  'OpenAI',
  'Microsoft Azure',
  'Google Cloud',
  'Docker',
  'Cloudflare',
  'GitHub',
  'Redis',
  'PostgreSQL',
  'SendGrid',
  'and more',
];

const platformLinks = {
  clearVisa: 'https://clearvisas.co.uk',
  calcFee: 'https://www.calcfee.com/',
  bundleBase: 'https://bundlebase.com',
};

const Navbar = () => {
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
    <nav
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'border-b border-white/10 bg-[#06172A]/92 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl'
          : 'border-b border-white/10 bg-[#06172A]/22 py-5 backdrop-blur-[2px]'
      }`}
    >
      <div className="relative mx-auto flex max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#/"
          className="flex min-w-0 max-w-[calc(100%-3.75rem)] items-center gap-2.5 no-underline"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Building2 className="h-7 w-7 shrink-0 text-[#6EA8FF]" aria-hidden="true" />
          <span className="truncate text-[16px] font-bold uppercase tracking-[0.05em] text-white sm:text-[22px]">
            Lion Tech <span className="font-medium text-white/82">Innovations</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className="border-none bg-transparent text-[13px] font-bold uppercase tracking-[0.22em] text-white/82 transition hover:text-white"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNav('contact')}
            className="btn-primary rounded-md px-8 py-3 text-[12px] uppercase tracking-[0.16em]"
          >
            Get Started
          </button>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="mobile-menu-button"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute left-0 top-full w-full border-t border-white/10 bg-[#06172A]/96 px-4 py-4 shadow-2xl backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-[1500px] space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className="block w-full rounded-md border-none bg-transparent px-3 py-3 text-left text-[13px] font-bold uppercase tracking-[0.18em] text-white/82 transition hover:bg-white/8 hover:text-white"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav('contact')}
              className="btn-primary mt-3 w-full rounded-md px-6 py-3.5 text-[12px] uppercase tracking-[0.16em]"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const TrustStrip = () => (
  <div className="hero-trust mx-auto w-full min-w-0 max-w-[1500px] overflow-hidden rounded-lg border border-white/10 bg-[#081D34]/78 px-4 py-4 shadow-[0_18px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-5">
    <div className="flex min-w-0 items-center gap-4 overflow-x-auto pb-1 [scrollbar-width:none] md:gap-4 [&::-webkit-scrollbar]:hidden">
      <div className="shrink-0 border-r border-white/12 pr-4 text-[9px] font-bold uppercase leading-snug tracking-[0.16em] text-white/58 sm:text-[10px]">
        Trusted by
        <br />
        modern businesses
      </div>
      {techStack.map((name) => (
        <span
          key={name}
          className="shrink-0 text-[12px] font-bold tracking-[-0.01em] text-white/88 last:font-medium last:text-white/72 xl:text-[13px]"
        >
          {name}
        </span>
      ))}
    </div>
  </div>
);

const Hero = () => (
  <section className="relative isolate min-h-[760px] overflow-hidden bg-[#06172A] pt-28 text-white sm:min-h-screen lg:pt-32">
    <img
      src="https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=90&w=2400&auto=format&fit=crop"
      alt="Sunny London skyline with Big Ben and Westminster"
      className="hero-bg absolute inset-0 z-0 h-full w-full object-cover"
      style={{ objectPosition: 'center 42%' }}
    />
    <div className="hero-overlay absolute inset-0 z-[1]" />
    <div className="hero-bottom-fade absolute inset-x-0 bottom-0 z-[1] h-72" />

    <div className="relative z-10 mx-auto flex min-h-[640px] w-full min-w-0 max-w-[1500px] flex-col justify-center px-4 pb-7 sm:px-6 lg:px-8">
      <div className="hero-copy w-full max-w-[620px] pt-7 sm:pt-10">
        <span className="inline-flex max-w-full items-center rounded-md border border-white/14 bg-white/8 px-4 py-2 text-[9px] font-bold uppercase leading-5 tracking-[0.16em] text-white/88 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-md sm:text-[11px] sm:tracking-[0.34em]">
          London-Based Digital Infrastructure Company
        </span>

        <h1 className="mt-6 text-[52px] font-black uppercase leading-[0.96] tracking-[0.01em] text-white sm:text-[88px] md:text-[104px] lg:text-[116px]">
          Build.
          <span className="block text-gradient-ombre">Automate.</span>
          Scale.
        </h1>

        <p className="mt-6 max-w-[330px] text-base font-medium leading-7 text-white/88 sm:max-w-xl sm:text-lg">
          We build and deploy enterprise-grade digital infrastructure, automation systems, and AI-powered platforms that drive real business results.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => scrollToSection('contact')}
            className="btn-primary w-full rounded-md px-8 py-4 text-[12px] uppercase tracking-[0.16em] sm:w-auto sm:min-w-[246px]"
          >
            Book a Consultation
            <ArrowRight size={17} />
          </button>
          <button
            onClick={() => scrollToSection('services')}
            className="btn-secondary-dark w-full rounded-md px-8 py-4 text-[12px] uppercase tracking-[0.16em] sm:w-auto sm:min-w-[178px]"
          >
            View Services
          </button>
        </div>
      </div>

      <div className="mt-auto pt-10">
        <TrustStrip />
      </div>
    </div>
  </section>
);

const Stats = () => {
  const stats = [
    {
      icon: <BarChart3 size={26} />,
      value: '99.9%',
      label: 'Uptime Target',
      copy: 'Enterprise-grade reliability and infrastructure.',
    },
    {
      icon: <Shield size={26} />,
      value: '24/7',
      label: 'System Monitoring',
      copy: 'Continuous monitoring and rapid response.',
    },
    {
      icon: <Cpu size={26} />,
      value: '3+',
      label: 'Live Platforms',
      copy: 'Production systems delivering real business value.',
    },
    {
      icon: <Globe2 size={26} />,
      value: 'UK',
      label: 'Registered Company',
      copy: 'London-based with global client delivery.',
    },
  ];

  return (
    <section className="border-y border-white/8 bg-[#06172A]">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 divide-y divide-white/8 px-4 py-8 sm:px-6 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4 lg:px-8">
        {stats.map((item) => (
          <div key={item.label} className="flex gap-6 py-7 md:px-6 lg:px-8">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/6 text-[#7C6BFF] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              {item.icon}
            </div>
            <div>
              <p className="text-4xl font-black leading-none tracking-[-0.03em] text-white">{item.value}</p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white/78">{item.label}</p>
              <p className="mt-3 max-w-[230px] text-sm leading-6 text-white/62">{item.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Platforms = () => {
  const projects = [
    {
      icon: <Shield size={22} />,
      title: 'ClearVisa UK',
      url: platformLinks.clearVisa,
      category: 'Compliance SaaS',
      description: 'AI-powered immigration risk analysis platform helping users assess UK visa refusal risk with confidence.',
    },
    {
      icon: <Building2 size={22} />,
      title: 'CalcFee',
      url: platformLinks.calcFee,
      category: 'FinTech Tool',
      description: 'Smart financial calculator platform with real-time data processing and premium PDF reporting.',
    },
    {
      icon: <FileText size={22} />,
      title: 'BundleBase',
      url: platformLinks.bundleBase,
      category: 'Legal Tech',
      description: 'Document bundling system for UK legal professionals. Automated PDF generation and structured output.',
    },
  ];

  return (
    <section id="platforms" className="bg-[#06172A] py-20 text-white sm:py-24">
      <div className="mx-auto grid max-w-[1500px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
        <div>
          <span className="section-eyebrow text-[#8F80FF]">Our Live Platforms</span>
          <h2 className="mt-4 max-w-md text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
            Real Systems. Real Impact.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-white/66">
            Production-ready platforms solving real business problems across compliance, finance, legal, and automation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="dark-card group flex min-h-[260px] flex-col p-6 no-underline"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/6 text-[#7C6BFF]">
                    {project.icon}
                  </span>
                  <span className="rounded-full bg-[#7C5CFF]/14 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A99DFF]">
                    {project.category}
                  </span>
                </div>
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                  Live <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </span>
              </div>

              <h3 className="text-xl font-bold tracking-[-0.03em] text-white">{project.title}</h3>
              <p className="mt-3 grow text-[15px] leading-6 text-white/66">{project.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-[#9E90FF] transition group-hover:text-white">
                Visit Platform
                <ArrowUpRight size={15} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      icon: <Globe2 size={25} />,
      title: 'Corporate Website Design',
      description: 'Fast, credible web presences built for trust, clarity, and high-value enquiries.',
    },
    {
      icon: <Layers size={25} />,
      title: 'Landing Pages & Funnels',
      description: 'Focused conversion journeys with clear messaging, analytics-ready structure, and polished execution.',
    },
    {
      icon: <Cpu size={25} />,
      title: 'AI Automation Systems',
      description: 'Workflow automation that reduces manual processing, improves response times, and scales operations.',
    },
    {
      icon: <Zap size={25} />,
      title: 'SaaS Platform Development',
      description: 'Production-ready software platforms with secure architecture and intuitive user flows.',
    },
    {
      icon: <Server size={25} />,
      title: 'API & Payment Infrastructure',
      description: 'Reliable integrations, payment flows, data pipelines, and backend services for real business use.',
    },
    {
      icon: <BarChart3 size={25} />,
      title: 'Technical SEO & Performance',
      description: 'Search-ready structure, Core Web Vitals discipline, and performance tuning for faster growth.',
    },
  ];

  return (
    <section id="services" className="bg-[#F4F7FB] py-24 sm:py-28">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="section-eyebrow text-[#6B5CFF]">Our Capabilities</span>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#0B1F35] sm:text-5xl">
            Enterprise-Grade Solutions
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#455A6E]">
            We architect and deploy robust digital systems that solve complex business challenges and drive operational efficiency.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.title} className="light-card group p-7">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-[#E8EFFA] text-[#5B76FF] transition group-hover:bg-[#0B1F35] group-hover:text-white">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold tracking-[-0.03em] text-[#0B1F35]">{service.title}</h3>
              <p className="mt-3 text-[15px] leading-7 text-[#455A6E]">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Company = () => {
  const highlights = [
    'Structured UK digital infrastructure company',
    'Enterprise-grade design, automation, and SaaS delivery',
    'Reliability-minded architecture for production systems',
    'London-based with UK and global client delivery',
  ];

  return (
    <section id="company" className="bg-white py-24 sm:py-28">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <span className="section-eyebrow text-[#6B5CFF]">Company</span>
          <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-[-0.05em] text-[#0B1F35] sm:text-5xl">
            Engineered for Serious Business
          </h2>
          <p className="mt-6 max-w-2xl text-[17px] leading-8 text-[#455A6E]">
            Lion Tech Innovations Ltd builds high-performance systems, from websites and SaaS platforms to automation workflows and AI-powered business tools, for organisations that need operational reliability and premium execution.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {highlights.map((item) => (
            <div key={item} className="flex items-start gap-4 rounded-lg border border-[#DCE6F2] bg-[#F8FAFD] p-5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E8EFFA] text-[#5B76FF]">
                <CheckCircle2 size={16} />
              </span>
              <p className="text-[15px] font-semibold leading-6 text-[#0B1F35]">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => (
  <section id="contact" className="relative overflow-hidden bg-[#071A30] py-24 text-white sm:py-28">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7C5CFF]/50 to-transparent" />
    <div className="absolute -right-32 top-8 h-72 w-72 rounded-full bg-[#5FA8FF]/12 blur-3xl" />
    <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-[#7C5CFF]/12 blur-3xl" />

    <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
      <span className="section-eyebrow text-[#9E90FF]">Contact</span>
      <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
        Ready to Build Something Serious?
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/68">
        Schedule a consultation to discuss your digital infrastructure, automation, or platform requirements.
      </p>

      <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
        <a href="mailto:contact@liontechinnovations.co.uk" className="dark-card p-7 text-left no-underline">
          <Mail className="mb-5 text-[#8F80FF]" size={26} />
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-white/50">Email</p>
          <p className="mt-2 break-words text-base font-semibold text-white">contact@liontechinnovations.co.uk</p>
        </a>
        <div className="dark-card p-7 text-left">
          <MapPin className="mb-5 text-[#8F80FF]" size={26} />
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-white/50">Location</p>
          <p className="mt-2 text-base font-semibold text-white">London, United Kingdom</p>
        </div>
      </div>

      <a
        href="mailto:contact@liontechinnovations.co.uk"
        className="btn-primary mt-10 rounded-md px-9 py-4 text-[12px] uppercase tracking-[0.16em] no-underline"
      >
        Book a Consultation
        <ArrowRight size={17} />
      </a>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-[#DCE6F2] bg-white py-10">
    <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:px-8">
      <div>
        <a href="#/" className="flex items-center gap-2 no-underline">
          <Building2 className="text-[#5B76FF]" size={24} />
          <span className="text-lg font-black uppercase tracking-[0.08em] text-[#0B1F35]">Lion Tech</span>
        </a>
        <p className="mt-4 max-w-xs text-sm leading-6 text-[#455A6E]">
          Digital infrastructure, automation systems, SaaS platforms, and AI-powered business tools.
        </p>
      </div>

      <div>
        <h3 className="footer-heading">Solutions</h3>
        <div className="mt-4 space-y-3">
          {['Web Infrastructure', 'AI Automation', 'SaaS Platforms', 'Payment Systems'].map((item) => (
            <button key={item} onClick={() => scrollToSection('services')} className="footer-link block">
              {item}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="footer-heading">Platforms</h3>
        <div className="mt-4 space-y-3">
          {[
            ['ClearVisa UK', platformLinks.clearVisa],
            ['CalcFee', platformLinks.calcFee],
            ['BundleBase', platformLinks.bundleBase],
          ].map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="footer-link inline-flex items-center gap-1.5 no-underline">
              {label}
              <ExternalLink size={12} />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h3 className="footer-heading">Contact</h3>
        <div className="mt-4 space-y-3 text-sm text-[#455A6E]">
          <a href="mailto:contact@liontechinnovations.co.uk" className="footer-link flex items-center gap-2 no-underline">
            <Mail size={15} />
            <span className="break-all">contact@liontechinnovations.co.uk</span>
          </a>
          <p className="flex items-center gap-2">
            <MapPin size={15} className="text-[#5B76FF]" />
            London, United Kingdom
          </p>
        </div>
      </div>
    </div>

    <div className="mx-auto mt-10 flex max-w-[1500px] flex-col gap-4 border-t border-[#DCE6F2] px-4 pt-7 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#455A6E]/68 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
      <p>&copy; {new Date().getFullYear()} Lion Tech Innovations Ltd. All rights reserved.</p>
      <div className="flex gap-5">
        <a href="#/privacy-policy" className="text-[#455A6E]/68 no-underline transition hover:text-[#0B1F35]">
          Privacy Policy
        </a>
        <a href="#/terms-and-conditions" className="text-[#455A6E]/68 no-underline transition hover:text-[#0B1F35]">
          Terms & Conditions
        </a>
      </div>
      <p>Company registered in England & Wales - No. 17068390</p>
    </div>
  </footer>
);

const LegalPage = ({ title, children }: { title: string; children: React.ReactNode }) => {
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <a href="#/" className="mb-6 inline-flex text-sm font-semibold text-[#5B76FF] no-underline hover:underline">
          &larr; Back to Home
        </a>
        <h1 className="text-4xl font-black tracking-[-0.04em] text-[#0B1F35]">{title}</h1>
        <p className="mt-2 text-sm text-[#455A6E]">Last updated: March 2026</p>
        <div className="legal-content mt-10">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

const PrivacyPolicy = () => (
  <LegalPage title="Privacy Policy">
    <h2>1. Introduction</h2>
    <p>
      Lion Tech Innovations Ltd ("we", "our", "us"), registered in England and Wales (Company No. 17068390), is committed to protecting the privacy of individuals who visit our website and use our services.
    </p>
    <h2>2. Information We Collect</h2>
    <p>We may collect contact information, technical data, usage data, and business information you provide when discussing potential projects or engagements.</p>
    <h2>3. How We Use Your Information</h2>
    <p>We use personal data to respond to enquiries, provide requested services, improve our website, send relevant communications where permitted, and comply with legal obligations.</p>
    <h2>4. Data Sharing</h2>
    <p>We do not sell personal data. We may share information with trusted service providers who help operate our website and business, or where required by law.</p>
    <h2>5. Data Retention</h2>
    <p>We retain personal data only for as long as necessary for the purposes for which it was collected, or as required by applicable law.</p>
    <h2>6. Your Rights</h2>
    <p>Under UK GDPR, you have rights to access, correct, delete, restrict, object to processing, request portability, and lodge a complaint with the Information Commissioner's Office.</p>
    <h2>7. Cookies</h2>
    <p>Our website may use cookies to enhance browsing and measure website usage. You can control cookie preferences through your browser settings.</p>
    <h2>8. Contact Us</h2>
    <p>
      For questions regarding this Privacy Policy, contact us at <strong>contact@liontechinnovations.co.uk</strong>. Address: London, United Kingdom.
    </p>
  </LegalPage>
);

const TermsAndConditions = () => (
  <LegalPage title="Terms & Conditions">
    <h2>1. Introduction</h2>
    <p>These Terms and Conditions govern your use of the Lion Tech Innovations Ltd website and our provision of services.</p>
    <h2>2. Services</h2>
    <p>Lion Tech Innovations Ltd provides digital infrastructure, web development, automation, and related technology services on a project basis.</p>
    <h2>3. Intellectual Property</h2>
    <p>All content on this website is the property of Lion Tech Innovations Ltd or its licensors and is protected by applicable intellectual property laws.</p>
    <h2>4. Client Obligations</h2>
    <p>Clients agree to provide accurate information, respond to project requests in a timely manner, ensure rights to supplied materials, and pay agreed fees.</p>
    <h2>5. Limitation of Liability</h2>
    <p>To the maximum extent permitted by law, Lion Tech Innovations Ltd shall not be liable for indirect, incidental, or consequential damages arising from website or service use.</p>
    <h2>6. Warranties</h2>
    <p>Services are delivered with reasonable skill and care in accordance with applicable project agreements and industry standards.</p>
    <h2>7. Governing Law</h2>
    <p>These Terms and Conditions are governed by the laws of England and Wales.</p>
    <h2>8. Contact</h2>
    <p>
      For questions about these Terms and Conditions, contact us at <strong>contact@liontechinnovations.co.uk</strong>. Address: London, United Kingdom.
    </p>
  </LegalPage>
);

const HomePage = () => (
  <div className="min-h-screen bg-[#F4F7FB]">
    <Navbar />
    <Hero />
    <Stats />
    <Platforms />
    <Services />
    <Company />
    <Contact />
    <Footer />
  </div>
);

export default function App() {
  const route = useHashRoute();

  return (
    <div className="selection:bg-[#6EA8FF]/30 selection:text-[#0B1F35]">
      {route === '/privacy-policy' && <PrivacyPolicy />}
      {route === '/terms-and-conditions' && <TermsAndConditions />}
      {route !== '/privacy-policy' && route !== '/terms-and-conditions' && <HomePage />}
    </div>
  );
}
