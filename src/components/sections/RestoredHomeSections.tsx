import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  CheckCircle2,
  Cpu,
  Database,
  FileCheck2,
  Globe2,
  Mail,
  MapPin,
  Network,
  Search,
  Shield,
  ShieldCheck,
  Waypoints,
  Wrench,
  Zap,
} from 'lucide-react';
import { company } from '../../content/company';
import { homepage } from '../../content/homepage';
import { fiveGates } from '../../content/methodology';
import { companyBrainOffer, fixSprintOffer, monitoringOffer, snapshotOffer } from '../../content/offers';
import { PrimaryCta } from '../ui/PrimaryCta';
import { RouteLink } from '../ui/RouteLink';

export function CredibilityMetrics() {
  const metrics = [
    { icon: BarChart3, value: '99.9%', label: 'Uptime Target', copy: 'Enterprise-grade reliability and infrastructure.' },
    { icon: Shield, value: '24/7', label: 'System Monitoring', copy: 'Continuous monitoring and rapid response.' },
    { icon: Cpu, value: '3+', label: 'Live Platforms', copy: 'Production systems delivering real business value.' },
    { icon: Globe2, value: 'UK', label: 'Registered Company', copy: 'Manchester-based, serving UK businesses remotely.' },
  ];

  return (
    <section className="stats-band border-y border-[#C8A24A]/10 bg-[#020817]" aria-label="LionTech credibility metrics">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 divide-y divide-white/8 px-4 py-5 sm:px-6 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4 lg:px-8">
        {metrics.map(({ icon: Icon, value, label, copy }) => (
          <div key={label} className="flex gap-4 py-5 md:px-5 lg:px-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#C8A24A]/16 bg-white/5 text-[#C8A24A] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <Icon aria-hidden="true" size={26} />
            </div>
            <div>
              <p className="text-3xl font-bold leading-none tracking-[-0.025em] text-white">{value}</p>
              <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/74">{label}</p>
              <p className="mt-2 max-w-[210px] text-[13px] leading-5 text-white/56">{copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BuyerBehaviour() {
  const steps = [
    ['Discover', 'Find businesses for a real need.'],
    ['Compare', 'Weigh services, proof and fit.'],
    ['Verify', 'Check facts against trusted sources.'],
    ['Contact', 'Choose a clear next action.'],
  ];

  return (
    <section className="lt-typography-polish section-light-muted py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <span className="section-eyebrow text-[#C8A24A]">The Buyer Shift</span>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.025em] sm:text-[40px]">{homepage.shift.title}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/72">{homepage.shift.description}</p>
          </div>
          <div className="lt-uniform-grid lt-buyer-cards grid gap-3 sm:grid-cols-2">
            {steps.map(([title, copy], index) => (
              <div key={title} className="lt-standard-card light-card flex items-start gap-3 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#C8A24A]/16 bg-white/5 text-[11px] font-bold text-[#C8A24A]">0{index + 1}</span>
                <div><h3 className="text-base font-medium">{title}</h3><p className="mt-1 text-[13px] leading-5">{copy}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FiveGates() {
  return (
    <section id="how-it-works" className="lt-typography-polish scroll-target section-light-connected py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="section-eyebrow text-[#C8A24A]">The Five Gates Method</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] sm:text-[40px]">{homepage.methodologyTitle}</h2>
          <p className="mt-4 text-base leading-7 text-white/72">A practical readiness profile built from the questions real buyers ask and the evidence AI systems surface.</p>
        </div>
        <ol className="lt-restored-gates mt-9">
          {fiveGates.map((gate, index) => (
            <li key={gate.name} className="lt-standard-card light-card p-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C8A24A]">Gate 0{index + 1}</span>
              <h3 className="mt-3 text-xl font-medium tracking-[-0.015em]">{gate.name}</h3>
              <p className="mt-2.5 text-[14px] leading-6">{gate.question}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
          <RouteLink className="inline-flex items-center gap-2 text-sm font-bold text-[#C8A24A] no-underline hover:text-[#E9D491]" href="/methodology">
            Read the methodology <ArrowRight aria-hidden="true" size={15} />
          </RouteLink>
          <RouteLink className="inline-flex items-center gap-2 text-sm font-bold text-[#C8A24A] no-underline hover:text-[#E9D491]" href="/industries">
            Explore industry guides <ArrowRight aria-hidden="true" size={15} />
          </RouteLink>
        </div>
      </div>
    </section>
  );
}

export function SnapshotOffer() {
  return (
    <section id="services" className="lt-typography-polish lt-snapshot-section-polished scroll-target section-dark-connected py-12 sm:py-14">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <article className="lt-commercial-card lt-snapshot-restored platform-card">
          <div className="lt-snapshot-top">
            <div className="lt-snapshot-price-panel">
              <span className="platform-badge">Founding offer</span>
              <p className="lt-snapshot-product-name">AI Visibility Snapshot</p>
              <strong className="lt-snapshot-price">{snapshotOffer.foundingPrice}</strong>
              <p className="lt-snapshot-standard-price">{snapshotOffer.standardPrice} standard {snapshotOffer.standardPriceTiming}</p>
              <div className="lt-snapshot-turnaround">{snapshotOffer.turnaround}</div>
            </div>
            <div className="lt-snapshot-content-panel">
              <span className="section-eyebrow text-[#C8A24A]">Evidence first. Priority fixes next.</span>
              <h2>See exactly what AI says about your business.</h2>
              <p className="lt-snapshot-scope">{snapshotOffer.shortScope}</p>
            </div>
          </div>
          <ul className="lt-snapshot-features">
            {snapshotOffer.inclusions.map((item) => (
              <li key={item}><Check aria-hidden="true" size={14} />{item}</li>
            ))}
          </ul>
          <div className="lt-snapshot-guarantee">
            <strong>Minimum-5 Guarantee</strong>
            <p>{snapshotOffer.guarantee}</p>
          </div>
          <PrimaryCta className="lt-snapshot-cta" />
        </article>
      </div>
    </section>
  );
}

export function EvidenceFindings() {
  return (
    <section className="lt-typography-polish section-light-muted py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="section-eyebrow text-[#C8A24A]">Illustrative Finding Types</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] sm:text-[40px]">Evidence, not theory.</h2>
          <p className="mt-4 text-base leading-7 text-white/64">Examples of the categories LionTech reviews. These are not claimed client outcomes.</p>
        </div>
        <div className="lt-evidence-cards mt-9">
          {homepage.evidenceTypes.map((item, index) => (
            <article key={item} className="lt-standard-card light-card p-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C8A24A]">Finding {String(index + 1).padStart(2, '0')}</span>
              <p className="lt-evidence-title mt-4 text-base leading-6">{item}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FixSprint() {
  const capabilities = [
    { icon: Search, title: 'Source-of-truth fixes', copy: 'Correct approved facts, service information and evidence that AI systems can reliably interpret.' },
    { icon: Wrench, title: 'Structured implementation', copy: 'Ship agreed website, structured data, trust evidence and action-path improvements.' },
    { icon: FileCheck2, title: 'Verified handoff', copy: 'Retest the agreed scope and document what changed, what remains and what to monitor.' },
  ];

  return (
    <section className="lt-typography-polish section-light-connected py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="section-eyebrow text-[#C8A24A]">Readiness Fix Sprint</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] sm:text-[40px]">Finding the gap is useful. Fixing it is where the value begins.</h2>
        </div>
        <div className="lt-uniform-grid lt-fix-cards mt-9 grid gap-4 md:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, copy }) => (
            <article key={title} className="lt-standard-card lt-card-layout light-card p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-[#C8A24A]/14 bg-white/5 text-[#C8A24A]"><Icon aria-hidden="true" size={24} /></div>
              <h3 className="text-lg font-medium tracking-[-0.02em]">{title}</h3>
              <p className="mt-2.5 text-[14px] leading-6">{copy}</p>
            </article>
          ))}
        </div>
        <div className="lt-commercial-card lt-offer-card lt-fix-price-strip mt-5 flex flex-col justify-between gap-4 rounded-lg border border-[#C8A24A]/14 bg-[#020817]/72">
          <div><span className="lt-route-card-label">IMPLEMENTATION OFFER</span><strong>{fixSprintOffer.price}</strong><p>{fixSprintOffer.scope} {fixSprintOffer.duration}. {fixSprintOffer.credit}</p></div>
          <RouteLink className="lt-button lt-button-primary lt-fix-cta shrink-0" href="/readiness-fix-sprint">Explore the Fix Sprint</RouteLink>
        </div>
      </div>
    </section>
  );
}

export function ContinuityOffers() {
  return (
    <section className="lt-typography-polish section-dark-connected py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl"><span className="section-eyebrow text-[#C8A24A]">Ongoing Readiness</span><h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] sm:text-[40px]">Stay accurate. Become actionable.</h2></div>
        <div className="lt-uniform-grid lt-continuity-cards mt-9 grid gap-4 md:grid-cols-2">
          <article className="lt-commercial-card lt-offer-card lt-continuity-card dark-card p-6">
            <ShieldCheck aria-hidden="true" className="text-[#C8A24A]" size={27} strokeWidth={1.5} />
            <h3 className="mt-5 text-xl font-medium">AI Visibility Monitoring</h3><p className="mt-3 text-[14px] leading-6">{monitoringOffer.scope}</p>
            <strong className="lt-service-price mt-5 block">{monitoringOffer.price}</strong>
            <RouteLink className="lt-button lt-button-primary lt-continuity-cta mt-4" href="/monitoring">Explore monitoring <ArrowRight size={14} /></RouteLink>
          </article>
          <article className="lt-commercial-card lt-offer-card lt-continuity-card dark-card p-6">
            <Waypoints aria-hidden="true" className="text-[#C8A24A]" size={27} strokeWidth={1.5} />
            <h3 className="mt-5 text-xl font-medium">Agent Action Sprints</h3><p className="mt-3 text-[14px] leading-6">Improve quote, booking, enquiry, availability or information paths when a documented business case exists.</p>
            <strong className="lt-service-price mt-5 block">£1,500-£3,500 per workflow</strong>
            <RouteLink className="lt-button lt-button-primary lt-continuity-cta mt-4" href="/ai-business-readiness">See the readiness path <ArrowRight size={14} /></RouteLink>
          </article>
        </div>
      </div>
    </section>
  );
}

export function PlatformShowcase() {
  const projects = [
    { title: 'ClearVisa UK', category: 'Compliance SaaS', image: '/assets/clearvisa-platform-preview.jpg', description: 'AI-powered immigration risk analysis platform helping users assess UK visa refusal risk with confidence.', actions: [{ label: 'Visit Platform', href: 'https://clearvisas.co.uk' }] },
    { title: 'CalcFee', category: 'FinTech Tool', image: '/assets/calcfee-platform-preview.jpg', description: 'Smart financial calculator platform with real-time data processing and premium PDF reporting.', actions: [{ label: 'Visit Platform', href: 'https://www.calcfee.com/' }] },
    { title: 'Lead Recovery', category: 'Emergency Lead Infrastructure', image: '/assets/lead-recovery-platform-preview.jpg', description: 'Premium emergency roofing websites with qualified SMS lead alerts and postcode-based qualification systems.', actions: [{ label: 'Visit Platform', href: '/lead-recovery' }] },
    { title: 'CareOps', category: 'Care Operations Platform', image: '/assets/careops-ai-receptionist-platform.jpg', description: 'Operational visibility and lost-enquiry recovery infrastructure for UK domiciliary care providers.', finalVisual: true, actions: [{ label: 'Lost Enquiry Recovery', href: '/careops/lost-enquiry-recovery' }, { label: 'Command Centre', href: '/careops/command-centre' }] },
  ];

  return (
    <section id="platforms" className="scroll-target section-dark-connected py-14 text-white sm:py-18">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl"><span className="section-eyebrow text-[#C8A24A]">Our Live Platforms</span><h2 className="mt-3 max-w-md text-3xl font-bold tracking-[-0.03em] sm:text-[34px]">Built and operated by LionTech</h2><p className="mt-4 max-w-2xl text-[15px] leading-6 text-white/62">LionTech does not merely produce strategy reports. LionTech ships production systems.</p></div>
        <div className="mx-auto mt-8 grid max-w-[1320px] grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {projects.map((project) => (
            <article key={project.title} className="platform-card group">
              <div className={`platform-preview${project.finalVisual ? ' platform-preview-final' : ''}`}><img src={project.image} alt={`${project.title} platform preview`} loading="lazy" /></div>
              <div className="flex flex-1 flex-col p-4">
                <div className="mb-3 flex items-center justify-between gap-2.5"><span className="platform-badge">{project.category}</span><span className="platform-live">Live <span /></span></div>
                <h3 className="text-lg font-bold tracking-[-0.025em]">{project.title}</h3><p className="mt-2.5 grow text-[13px] leading-5 text-white/66">{project.description}</p>
                <div className="mt-5 flex flex-col gap-2">
                  {project.actions.map((action) => (
                    <RouteLink key={action.label} href={action.href} className="inline-flex items-center justify-between gap-2 rounded-md border border-[#C8A24A]/22 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#C8A24A] no-underline transition hover:border-[#C8A24A]/48 hover:bg-[#C8A24A]/10 hover:text-white">
                      {action.label}{action.href.startsWith('http') ? <ArrowUpRight size={12} /> : <ArrowRight size={12} />}
                    </RouteLink>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CompanyBrain() {
  const nodes = [
    { icon: Database, label: 'Approved facts' },
    { icon: Network, label: 'Structured knowledge' },
    { icon: ShieldCheck, label: 'Role-scoped access' },
    { icon: Zap, label: 'Approved workflows' },
    { icon: CheckCircle2, label: 'Verified output' },
  ];

  return (
    <section className="lt-typography-polish section-light-muted py-16 sm:py-20">
      <div className="mx-auto grid max-w-[1320px] items-center gap-9 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
        <div><span className="section-eyebrow text-[#C8A24A]">{companyBrainOffer.stage}</span><h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] sm:text-[40px]">When your business is ready to bring AI inside.</h2><p className="mt-4 text-base leading-7">{companyBrainOffer.scope}</p><RouteLink className="lt-button lt-button-secondary mt-6" href="/company-brain">Explore Company Brain</RouteLink></div>
        <div className="lt-large-panel dark-card p-5 sm:p-7" aria-label="Company Brain operating layer diagram">
          <div className="lt-brain-diagram">
            {nodes.map(({ icon: Icon, label }, index) => (
              <div key={label} className="lt-brain-node"><Icon aria-hidden="true" size={22} /><span>{label}</span>{index < nodes.length - 1 && <ArrowRight className="lt-brain-arrow" aria-hidden="true" size={16} />}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CompanyTrust() {
  const highlights = [
    'Evidence before hype',
    'Real implementation capability',
    'Model-independent thinking',
    'Human-reviewed findings',
    'Privacy and access discipline',
    'Manchester-based with UK-wide remote delivery',
  ];

  return (
    <section id="company" className="lt-typography-polish scroll-target section-light-connected py-16 sm:py-20">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-9 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div><span className="section-eyebrow text-[#C8A24A]">Company</span><h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.025em] sm:text-[40px]">Engineered for Serious Business</h2><p className="mt-4 max-w-2xl text-base leading-7">Lion Tech Innovations Ltd tests how AI systems understand a business, documents the evidence, and implements approved fixes with production-grade discipline.</p></div>
        <div className="lt-uniform-grid lt-company-proof-grid grid gap-3.5 sm:grid-cols-2">
          {highlights.map((item) => <div key={item} className="lt-standard-card company-card flex items-start gap-3 p-4"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#C8A24A]/14 bg-white/5 text-[#C8A24A]"><CheckCircle2 aria-hidden="true" size={14} /></span><p className="text-[14px] font-medium leading-6">{item}</p></div>)}
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="scroll-target section-contact-connected relative overflow-hidden py-16 text-white sm:py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C8A24A]/50 to-transparent" />
      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <span className="section-eyebrow text-[#C8A24A]">Contact</span><h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] sm:text-[40px]">See What AI Says About Your Business</h2><p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/64">Start with an evidence-led AI Visibility Snapshot, reviewed by a human and delivered from Manchester for businesses across the UK.</p>
        <div className="mx-auto mt-9 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
          <a href="mailto:contact@liontechinnovations.co.uk" className="lt-standard-card dark-card p-5 text-left no-underline"><Mail className="mb-4 text-[#C8A24A]" size={22} /><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/44">Email</p><p className="mt-2 break-words text-[15px] font-semibold text-white">contact@liontechinnovations.co.uk</p></a>
          <div className="lt-standard-card dark-card p-5 text-left"><MapPin className="mb-4 text-[#C8A24A]" size={22} /><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/44">Location</p><p className="mt-2 text-[15px] font-semibold text-white">{company.location}</p></div>
        </div>
        <PrimaryCta className="mt-8" />
      </div>
    </section>
  );
}
