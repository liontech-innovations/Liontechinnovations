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
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Zap,
  Shield,
  BarChart3
} from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0B1A2B]/95 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-white font-bold text-2xl tracking-wider flex items-center gap-2">
              <Building2 className="text-[#5B8CFF]" size={28} />
              LION TECH <span className="text-gradient font-light">INNOVATIONS</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-10">
            <a href="#services" className="text-[#A0AEC0] hover:text-white transition-colors text-sm uppercase tracking-widest font-medium">Services</a>
            <a href="#platforms" className="text-[#A0AEC0] hover:text-white transition-colors text-sm uppercase tracking-widest font-medium">Platforms</a>
            <a href="#about" className="text-[#A0AEC0] hover:text-white transition-colors text-sm uppercase tracking-widest font-medium">Company</a>
            <a href="#contact" className="text-[#A0AEC0] hover:text-white transition-colors text-sm uppercase tracking-widest font-medium">Contact</a>
            <button className="btn-primary text-white px-7 py-2.5 rounded-sm font-bold transition-all text-xs uppercase tracking-widest">
              Get Started
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B1A2B] absolute top-full left-0 w-full border-t border-white/5 shadow-2xl">
          <div className="px-4 pt-2 pb-8 space-y-1">
            <a href="#services" className="block px-3 py-4 text-white hover:bg-white/5 text-sm uppercase tracking-widest">Services</a>
            <a href="#platforms" className="block px-3 py-4 text-white hover:bg-white/5 text-sm uppercase tracking-widest">Platforms</a>
            <a href="#about" className="block px-3 py-4 text-white hover:bg-white/5 text-sm uppercase tracking-widest">Company</a>
            <a href="#contact" className="block px-3 py-4 text-white hover:bg-white/5 text-sm uppercase tracking-widest">Contact</a>
            <div className="pt-4 px-3">
              <button className="w-full btn-primary text-white px-6 py-4 rounded-sm font-bold text-sm uppercase tracking-widest">
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <div className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image: London Skyline High-rise */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=2070&auto=format&fit=crop")',
          filter: 'blur(2px)'
        }}
      >
        {/* Dark Navy Gradient Overlay */}
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <div className="relative inline-block">
          {/* Subtle radial blue glow behind headline */}
          <div className="absolute inset-0 hero-glow -z-10 scale-150 blur-3xl opacity-60"></div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tight-headline uppercase tracking-tighter">
            BUILD. <span className="text-gradient">AUTOMATE.</span> SCALE.
          </h1>
        </div>
        <p className="mt-4 text-xl md:text-2xl text-[#A0AEC0] max-w-3xl mx-auto font-medium leading-relaxed mb-12">
          Corporate-grade websites, AI systems, and automation solutions for modern businesses.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="btn-primary text-white px-10 py-5 rounded-sm font-bold transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3">
            Book a Consultation
            <ArrowRight size={18} />
          </button>
          <button className="btn-secondary text-white px-10 py-5 rounded-sm font-bold transition-all text-sm uppercase tracking-widest">
            View Services
          </button>
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0B1A2B] to-transparent"></div>
    </div>
  );
};

const Services = () => {
  const services = [
    {
      icon: <Globe size={28} />,
      title: "Corporate Website Design",
      description: "High-end, secure, and performant web presences that reflect your corporate identity and establish immediate trust."
    },
    {
      icon: <Layers size={28} />,
      title: "Landing Pages & Funnels",
      description: "Conversion-optimized digital entry points designed to capture high-value leads and drive measurable ROI."
    },
    {
      icon: <Cpu size={28} />,
      title: "AI Automation Systems",
      description: "Intelligent workflows that reduce operational overhead, minimize human error, and accelerate processing times."
    },
    {
      icon: <Zap size={28} />,
      title: "Business Process Automation",
      description: "End-to-end digitization of legacy processes, connecting disparate systems into unified, efficient pipelines."
    },
    {
      icon: <Shield size={28} />,
      title: "Custom SaaS Interfaces",
      description: "Bespoke software-as-a-service platforms built with robust architectures for internal use or commercial deployment."
    },
    {
      icon: <Server size={28} />,
      title: "Digital Infrastructure",
      description: "Scalable cloud deployments, database architecture, and API integrations for enterprise-grade reliability."
    }
  ];

  return (
    <section id="services" className="py-32 bg-[#0F223A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <h2 className="text-xs font-bold text-[#5B8CFF] uppercase tracking-[0.3em] mb-4">Our Capabilities</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 tight-headline">
            Enterprise-Grade Solutions
          </h3>
          <p className="text-[#A0AEC0] text-lg max-w-2xl leading-relaxed">
            We architect and deploy robust digital systems that solve complex business challenges and drive operational efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="saas-card p-10 rounded-sm group">
              <div className="text-[#5B8CFF] mb-8 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h4 className="text-xl font-bold text-white mb-4 tracking-tight">{service.title}</h4>
              <p className="text-[#A0AEC0] leading-relaxed text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Platforms = () => {
  const projects = [
    {
      title: "ClearVisa UK",
      url: "https://clearvisas.co.uk",
      description: "Immigration risk analysis platform helping users assess UK visa refusal risk. Built with secure data handling.",
    },
    {
      title: "CalcFee",
      url: "https://www.calcfee.com/",
      description: "Financial calculator platform designed to uncover hidden costs and fees. Features real-time data processing.",
    },
    {
      title: "BundleBase",
      url: "https://bundlebase.com",
      description: "Document bundling system for UK legal processes and evidence preparation. Automated PDF generation.",
    }
  ];

  return (
    <section id="platforms" className="relative py-32 overflow-hidden">
      {/* Background Image: High-rise office */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-[4px]"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop")',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[#050F23]/88"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-xs font-bold text-[#5B8CFF] uppercase tracking-[0.3em] mb-4">Deployed Systems</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 tight-headline">
            Live Production Platforms
          </h3>
          <p className="text-[#A0AEC0] text-lg max-w-2xl mx-auto leading-relaxed">
            We build and maintain real-world infrastructure that powers critical business operations across the UK.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="glass-card p-10 rounded-xl flex flex-col h-full relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5B8CFF]/5 to-[#9B7CFF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[10px] font-bold text-[#5B8CFF] uppercase tracking-widest">System Active</span>
                <span className="w-2 h-2 bg-[#5B8CFF] rounded-full animate-pulse shadow-[0_0_8px_#5B8CFF]"></span>
              </div>
              <h4 className="text-2xl font-bold text-white mb-4 tracking-tight">{project.title}</h4>
              <p className="text-[#A0AEC0] text-sm leading-relaxed mb-10 flex-grow">
                {project.description}
              </p>
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-[#5B8CFF] transition-colors group/link"
              >
                Visit Platform 
                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CompanyPresence = () => {
  return (
    <section id="about" className="py-32 bg-[#0B1A2B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-xs font-bold text-[#5B8CFF] uppercase tracking-[0.3em] mb-4">Corporate Excellence</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 tight-headline">
              Engineered for Serious Business
            </h3>
            <p className="text-lg text-[#A0AEC0] mb-8 leading-relaxed">
              Lion Tech Innovations Ltd delivers high-performance digital systems including websites, automation workflows, and AI-powered business solutions designed for serious companies.
            </p>
            <div className="space-y-6">
              {[
                "Professional corporate presentation",
                "Built for real business use",
                "Automation-first approach",
                "Clean, scalable architecture"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#5B8CFF]/10 flex items-center justify-center">
                    <CheckCircle2 className="text-[#5B8CFF]" size={14} />
                  </div>
                  <span className="text-white font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="saas-card p-8 rounded-sm">
              <BarChart3 className="text-[#5B8CFF] mb-6" size={32} />
              <h5 className="text-3xl font-bold text-white mb-2">99.9%</h5>
              <p className="text-xs font-bold text-[#A0AEC0] uppercase tracking-widest">Uptime Target</p>
            </div>
            <div className="saas-card p-8 rounded-sm mt-8">
              <Shield className="text-[#5B8CFF] mb-6" size={32} />
              <h5 className="text-3xl font-bold text-white mb-2">24/7</h5>
              <p className="text-xs font-bold text-[#A0AEC0] uppercase tracking-widest">Monitoring</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-[#0F223A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-10 tight-headline">
          Ready to Build Something Serious?
        </h2>
        <p className="text-xl text-[#A0AEC0] mb-12 font-medium max-w-2xl mx-auto">
          Schedule a consultation to discuss your digital infrastructure requirements with our technical directors.
        </p>
        <button className="btn-primary text-white px-12 py-6 rounded-sm font-bold transition-all text-sm uppercase tracking-widest">
          Book a Consultation
        </button>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="bg-[#0B1A2B] text-white pt-32 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-1">
            <span className="text-white font-bold text-2xl tracking-wider flex items-center gap-2 mb-8">
              <Building2 className="text-[#5B8CFF]" size={28} />
              LION TECH
            </span>
            <p className="text-[#A0AEC0] text-sm leading-relaxed mb-8 max-w-xs">
              Corporate-grade digital infrastructure, automation, and AI solutions for modern enterprises.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-white">Solutions</h4>
            <ul className="space-y-4">
              <li><a href="#services" className="text-[#A0AEC0] hover:text-white transition-colors text-sm">Web Infrastructure</a></li>
              <li><a href="#services" className="text-[#A0AEC0] hover:text-white transition-colors text-sm">AI Automation</a></li>
              <li><a href="#services" className="text-[#A0AEC0] hover:text-white transition-colors text-sm">SaaS Development</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-white">Contact</h4>
            <ul className="space-y-5">
              <li className="flex items-center gap-4 text-[#A0AEC0] text-sm">
                <Mail size={18} className="text-[#5B8CFF]" />
                <span>contact@liontechinnovations.co.uk</span>
              </li>
              <li className="flex items-center gap-4 text-[#A0AEC0] text-sm">
                <Phone size={18} className="text-[#5B8CFF]" />
                <span>+44 (0) 20 1234 5678</span>
              </li>
              <li className="flex items-center gap-4 text-[#A0AEC0] text-sm">
                <MapPin size={18} className="text-[#5B8CFF]" />
                <span>London, United Kingdom</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-white">Inquiries</h4>
            <p className="text-[#A0AEC0] text-sm mb-6">Direct access to our technical directors for project scoping.</p>
            <a href="mailto:contact@liontechinnovations.co.uk" className="btn-secondary inline-block px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all">
              Email Us
            </a>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#A0AEC0]/50 text-[10px] uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Lion Tech Innovations Ltd. All rights reserved.
          </p>
          <p className="text-[#A0AEC0]/50 text-[10px] uppercase tracking-widest">
            Company registered in England & Wales.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-[#0B1A2B] font-sans selection:bg-[#5B8CFF] selection:text-white">
      <Navbar />
      <Hero />
      <div className="section-divider"></div>
      <Services />
      <div className="section-divider"></div>
      <Platforms />
      <div className="section-divider"></div>
      <CompanyPresence />
      <div className="section-divider"></div>
      <CTA />
      <Footer />
    </div>
  );
}
