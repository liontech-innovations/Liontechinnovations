import { ArrowRight, CheckCircle2, ExternalLink, Eye, FileCheck2, LockKeyhole, MapPin, Network, Wrench } from 'lucide-react';
import {
  FeatureCard,
  PageHero,
  RouteCta,
  RouteHeading,
  RouteSection,
} from '../components/sections/RoutePageSections';
import { PrimaryCta } from '../components/ui/PrimaryCta';
import { RouteLink } from '../components/ui/RouteLink';
import { company } from '../content/company';
import { platforms } from '../content/platforms';
import { routeSeo } from '../content/routeSeo';
import { useSeo } from '../lib/seo';
import '../styles/about-founder.css';

const FOUNDER_LINKEDIN_URL: string | null = 'https://www.linkedin.com/in/freejoy-chimbizi-544157a7/';

const FOUNDER_CREDENTIAL_EMBED_URL =
  'https://certify.sbs.ox.ac.uk/embed/ba50fb87-4576-4f98-a03a-bfc7ee6cae91';
// Public destination confirmed by the official credential page's og:url metadata.
const FOUNDER_CREDENTIAL_VERIFICATION_URL =
  'https://certify.sbs.ox.ac.uk/ba50fb87-4576-4f98-a03a-bfc7ee6cae91';
// Set false only after browser verification confirms that the provider blocks embedding.
// Cross-origin iframe load/error events alone cannot reliably prove a CSP/X-Frame-Options block.
const FOUNDER_CREDENTIAL_EMBED_ENABLED = true;

const professionalDevelopmentAreas = [
  'AI Ethics',
  'Human Oversight',
  'Transparency',
  'Accountability',
  'Human Rights',
  'Judicial Transparency',
  'Access to Justice',
];

const founderCapabilities = [
  {
    title: 'MILITARY OPERATIONAL DISCIPLINE',
    description: 'British Army experience shaped a disciplined approach to accountability, reliability and operational delivery.',
  },
  {
    title: 'PRACTICAL ENGINEERING',
    description: 'Production-focused implementation built around useful systems, clear controls and measurable business outcomes.',
  },
  {
    title: 'RESPONSIBLE AI & GOVERNANCE',
    description: 'Professional development covering AI ethics, transparency, accountability, human oversight, human rights and responsible decision-making.',
  },
];

function FounderProofIcon() {
  return (
    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#C8A24A]/14 bg-white/5 text-[#C8A24A]">
      <CheckCircle2 aria-hidden="true" size={14} />
    </span>
  );
}

function FounderCredentialDetails() {
  return (
    <>
      <p className="lt-about-credential-label">PROFESSIONAL DEVELOPMENT</p>
      <h3 id="founder-credential-title">AI, Justice, and the Rule of Law</h3>
      <dl className="lt-about-credential-meta">
        <div>
          <dt>Issued</dt>
          <dd><time dateTime="2026-09-11">11 September 2026</time></dd>
        </div>
        <div>
          <dt>Developed by</dt>
          <dd>Saïd Business School<br />University of Oxford</dd>
        </div>
      </dl>
      <div className="lt-about-client-reassurance" aria-labelledby="founder-client-reassurance-title">
        <h4 className="lt-about-credential-label" id="founder-client-reassurance-title">WHY THIS MATTERS FOR CLIENTS</h4>
        <p>AI systems can affect customers, staff, data and business decisions. This professional development strengthens LionTech’s approach to AI ethics, transparency, accountability, human oversight and responsible decision-making.</p>
        <p className="lt-about-client-reassurance-emphasis">For clients, that means LionTech approaches AI not simply as technology to deploy, but as an operational capability that should be understandable, reviewable and responsibly governed.</p>
      </div>
      <div className="lt-about-development" aria-labelledby="founder-development-title">
        <h4 className="lt-about-credential-label" id="founder-development-title">AREAS OF PROFESSIONAL DEVELOPMENT</h4>
        <ul className="lt-about-development-grid">
          {professionalDevelopmentAreas.map(area => (
            <li className="lt-standard-card lt-about-development-box" key={area}>
              <FounderProofIcon />
              <p className="lt-evidence-title">{area}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function FounderCredentialCard() {
  if (!FOUNDER_CREDENTIAL_EMBED_ENABLED) {
    return (
      <a
        className="lt-about-credential-card lt-about-credential-linked"
        href={FOUNDER_CREDENTIAL_VERIFICATION_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View verified credential: AI, Justice, and the Rule of Law (opens in a new tab)"
      >
        <FounderCredentialDetails />
        <span className="lt-about-credential-verify">View verified credential <span aria-hidden="true">↗</span></span>
      </a>
    );
  }

  return (
    <article className="lt-about-credential-card" aria-labelledby="founder-credential-title">
      <FounderCredentialDetails />
      <iframe
        className="lt-about-credential-frame"
        src={FOUNDER_CREDENTIAL_EMBED_URL}
        title="Freejoy Masimba Chimbizi — AI, Justice, and the Rule of Law credential"
        loading="lazy"
        allowFullScreen
      />
      <a
        className="lt-route-text-link lt-about-credential-verify"
        href={FOUNDER_CREDENTIAL_VERIFICATION_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View verified credential (opens in a new tab)"
      >
        View verified credential <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}

export function AboutPage() {
  useSeo(routeSeo['/about']);

  const principles = [
    { title: 'Evidence before hype', description: 'Start with observed outputs, facts and practical buyer questions.', icon: Eye },
    { title: 'Human-reviewed findings', description: 'Apply judgement before a result becomes a recommendation.', icon: FileCheck2 },
    { title: 'Model-independent thinking', description: 'Build useful company capability without depending on one AI vendor.', icon: Network },
    { title: 'Production implementation capability', description: 'Turn agreed findings into controlled, working changes.', icon: Wrench },
    { title: 'Privacy and access discipline', description: 'Keep information, roles and operational boundaries explicit.', icon: LockKeyhole },
    { title: 'Manchester-based, UK-wide delivery', description: 'Work remotely with UK businesses from Manchester.', icon: MapPin },
  ];

  return (
    <>
      <PageHero eyebrow="ABOUT LIONTECH" title="Evidence-led readiness. Production engineering." description={`${company.legalName} is ${company.location}.`}>
        <PrimaryCta />
        <RouteLink className="lt-button lt-button-secondary" href="/ai-business-readiness">See the readiness path</RouteLink>
      </PageHero>

      <RouteSection>
        <div className="lt-route-about-intro">
          <RouteHeading eyebrow="PRACTICAL BY DESIGN" title="Built for practical decisions" description="LionTech helps businesses understand what customer-facing AI systems currently say, then turns material gaps into a controlled implementation plan." />
          <p>
            Lion Tech Innovations Ltd is registered in England and Wales under company number <strong>{company.companiesHouseNumber}</strong>.{' '}
            <a href={company.companiesHouseUrl} target="_blank" rel="noreferrer">Verify the company record on Companies House</a>.
          </p>
          <RouteLink className="lt-route-text-link" href="/industries">Explore the industry guides <ArrowRight size={15} aria-hidden="true" /></RouteLink>
        </div>
      </RouteSection>

      <RouteSection id="founder-credentials" tone="navy" className="lt-about-founder">
        <RouteHeading
          eyebrow="FOUNDER & PROFESSIONAL CREDENTIALS"
          title="Built with practical experience. Grounded in responsible AI."
          description="LionTech is founded by Freejoy Masimba Chimbizi, whose background includes more than seven years in the British Army as a Supply Chain Specialist, where discipline, accountability and reliable operational delivery were fundamental. He combines that experience with practical AI implementation, production engineering and professional development in responsible AI and governance. Together, these experiences shape LionTech’s approach to building useful AI systems with clear controls, human oversight and operational discipline."
        />
        <div className="lt-about-founder-grid">
          <div className="lt-about-founder-column">
          <article className="lt-about-founder-card" aria-labelledby="founder-profile-title">
            <h3 id="founder-profile-title">Freejoy Masimba Chimbizi</h3>
            <p className="lt-about-founder-role">Founder &amp; CEO</p>
            <p className="lt-about-founder-company">Lion Tech Innovations Ltd</p>
            <p className="lt-about-founder-summary">Operational experience, practical engineering and responsible AI governance applied to LionTech’s work.</p>
            {FOUNDER_LINKEDIN_URL ? (
              <a
                className="lt-button lt-button-secondary lt-about-founder-link"
                href={FOUNDER_LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View LinkedIn Profile (opens in a new tab)"
              >
                <span>View LinkedIn Profile</span><ExternalLink size={16} aria-hidden="true" />
              </a>
            ) : (
              <>
                <button
                  className="lt-button lt-button-secondary lt-about-founder-link"
                  type="button"
                  disabled
                  aria-describedby="founder-linkedin-status"
                >
                  <span>View LinkedIn Profile</span><ExternalLink size={16} aria-hidden="true" />
                </button>
                <p className="lt-about-founder-link-note" id="founder-linkedin-status">Profile link awaiting confirmation.</p>
              </>
            )}
          </article>
            <div className="lt-about-capabilities" aria-labelledby="founder-capabilities-title">
              <h3 className="lt-about-credential-label" id="founder-capabilities-title">FOUNDER CAPABILITY</h3>
              <ul className="lt-about-capability-grid">
                {founderCapabilities.map(capability => (
                  <li className="lt-standard-card lt-about-capability-box" key={capability.title}>
                    <FounderProofIcon />
                    <div>
                      <h4>{capability.title}</h4>
                      <p>{capability.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <FounderCredentialCard />
        </div>
      </RouteSection>

      <RouteSection tone="navy">
        <RouteHeading eyebrow="PLATFORM PROOF" title="Production systems, not presentation concepts" description="Four existing LionTech platforms demonstrate the ability to build and operate real customer journeys." />
        <div className="lt-route-platform-grid">
          {platforms.map((platform) => (
            <RouteLink className="lt-route-platform-card" href={platform.href} key={platform.name}>
              <div className="lt-route-platform-image"><img src={platform.image} alt={`${platform.name} platform preview`} /></div>
              <div>
                <h3>{platform.name}</h3>
                <p>{platform.description}</p>
                <span>View platform</span>
              </div>
            </RouteLink>
          ))}
        </div>
      </RouteSection>

      <RouteSection>
        <RouteHeading eyebrow="OPERATING PRINCIPLES" title="The standard behind the work" description="A practical set of constraints for useful AI readiness and production delivery." />
        <div className="lt-route-principles-grid">
          {principles.map((principle) => (
            <FeatureCard key={principle.title} title={principle.title} icon={principle.icon}><p>{principle.description}</p></FeatureCard>
          ))}
        </div>
      </RouteSection>

      <RouteCta
        title="Start with what customer-facing AI can see now."
        description="The AI Visibility Snapshot gives the evidence, priority gaps and 30-day action plan needed for a practical first decision."
        primaryLabel="Request a Founding Snapshot"
        secondaryHref="/contact"
        secondaryLabel="Contact LionTech"
      />
    </>
  );
}
