import { useEffect, useState, type ReactNode } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { RouteLink } from '../components/ui/RouteLink';
import { TenderEnquiryForm } from '../components/TenderEnquiryForm';
import { tenderVisiblePages, tendersPreview } from '../content/tenders';
import { tenderHubSeo } from '../content/tenders/seo';
import { useSeo } from '../lib/seo';
import '../styles/tenders.css';
const illustrationCaption = "AI-generated illustration, not a photograph of LionTech staff or premises. LionTech is independent and is not affiliated with the UK government.";
export function TenderImage({ supporting = false }: { supporting?: boolean }) {
  const name = supporting ? 'tender-support-illustration' : 'tender-hero-meeting';
  return <img src={`/assets/tenders/${name}-960.webp`} srcSet={[640,960,1440,1672].map(width => `/assets/tenders/${name}-${width}.webp ${width}w`).join(', ')} sizes={supporting ? '(max-width: 800px) 80vw, 640px' : '(max-width: 1100px) 768px, 80vw'} width="1672" height="941" alt={supporting ? 'AI-generated UK tender illustration with documents, laptop and a Union flag; not LionTech premises.' : 'AI-generated scene of fictional professionals reviewing documents, with Westminster and a Union flag in the background.'} loading={supporting ? 'lazy' : 'eager'} fetchPriority={supporting ? 'auto' : 'high'} decoding="async" />;
}
const workflow = [
  ['Share the opportunity', 'Start with its public link, deadline and the support you need. Confidential documents follow through an agreed channel.'],
  ['Agree the scope', 'We confirm fit, capacity, deliverables and a practical timeline in writing before work begins.'],
  ['Map requirements and evidence', 'Missing proof and unconfirmed commitments become clear actions, not invented text.'],
  ['Prepare and review', 'AI assists organisation and drafting. Human review checks the proposed response against the source material.'],
  ['You approve', 'Your business confirms facts, delivery commitments and commercial decisions before using the final work.'],
];
const faq = [
  ['Do you guarantee that we will win?', 'No. The buyer decides the outcome. We help prepare a clearer, evidence-led response; a contract award cannot be guaranteed.'],
  ['Can you help with an existing draft?', 'A review or defined set of revisions can be scoped around your existing draft. We first check the pack, timing and what needs attention.'],
  ['Will you write the whole submission?', 'Only the sections and deliverables in the written scope. You provide and confirm the technical solution, evidence, prices and commitments. Additional sections or lots are separately quoted.'],
  ['How quickly can we start?', 'Availability is confirmed after reviewing the opportunity and deadline. Any delivery target starts from the agreed date and complete inputs, not simply a button click.'],
  ['What happens when evidence is missing?', 'We identify what is missing and who must supply or approve it. We do not invent certificates, experience, policies or future promises.'],
  ['Is AI used?', 'AI may assist analysis, organisation and drafting. It does not replace human review or client approval. Document handling must be agreed before confidential material is supplied.'],
  ['Do you submit the tender for us?', 'Submission is not included by default. Your business retains control of its portal account and final submission unless separately agreed in writing.'],
];
function TenderSection({ eyebrow, title, id, tone = 'section-dark-connected', children }: { eyebrow: string; title: string; id?: string; tone?: string; children: ReactNode }) {
  return <section id={id} className={`lt-tender-section lt-typography-polish ${tone} py-12 sm:py-14`}>
    <div className="lt-shell"><div className="max-w-3xl"><span className="section-eyebrow">{eyebrow}</span><h2 className="mt-3 text-3xl font-semibold sm:text-[40px]">{title}</h2></div>{children}</div>
  </section>;
}
export function TendersPage() {
  useSeo(tenderHubSeo);
  const [source, setSource] = useState<string | null>(null);
  useEffect(() => {
    const update = () => {
      const value = new URLSearchParams(window.location.search).get('source');
      setSource(value && tenderVisiblePages.some(page => page.slug === value) ? value : null);
    };
    update();
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  const tenderPath = `/tenders${source ? `?source=${encodeURIComponent(source)}` : ''}`;
  return <div className="lt-tender-page lt-tender-hub">
    {tendersPreview && <aside className="lt-tender-review" role="note">Enquiry-only review draft. Publication awaits founder editorial approval. No checkout is active.</aside>}
    <section className="lt-tender-hero">
      <figure className="lt-tender-hero-image"><TenderImage /></figure>
      <div className="lt-shell lt-tender-hero-copy"><p className="lt-kicker">TENDER SPRINT · UK BUSINESS BID SUPPORT</p><h1>UK Tender Support</h1><p><strong>Your expertise. A stronger tender response.</strong></p><p>Evidence-led tender support for UK businesses, with AI assistance and human review. LionTech helps turn a tender pack and company evidence into a clear, organised response. Identify requirements, surface missing proof and develop a draft before client approval.</p><div className="lt-tender-actions"><RouteLink className="lt-button lt-button-primary" href={`${tenderPath}#enquiry`}>Request Tender Support</RouteLink><RouteLink className="lt-button lt-button-secondary" href={`${tenderPath}#process`}>How support works</RouteLink></div><p>Clear scope · Evidence-led preparation · Human review · No win guarantees</p></div>
    </section>
    <p className="lt-shell lt-tender-caption">{illustrationCaption}</p>
    <TenderSection eyebrow="THE WORK BEHIND THE WORDS" title="A tender asks for more than good writing.">
      <div className="mt-4 max-w-3xl space-y-3"><p>A polished answer still needs to address the question, fit the word limit and be supported by the right documents. Current practice and future contractual promises are not the same thing.</p><p>What does the buyer ask for? What can your business evidence? What needs confirmation before the answer is final?</p></div>
      <ul className="lt-tender-deliverables lt-uniform-grid lt-fix-cards mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <li className="lt-standard-card light-card p-5"><h3>Requirements and response map.</h3><p className="mt-3 text-sm leading-6">Questions, mandatory points, deadlines, owners and references.</p></li>
        <li className="lt-standard-card light-card p-5"><h3>Evidence and gap register.</h3><p className="mt-3 text-sm leading-6">Available proof, its scope and the information still needed.</p></li>
        <li className="lt-standard-card light-card p-5"><h3>Scoped draft responses.</h3><p className="mt-3 text-sm leading-6">Structured around the instructions and your approved delivery approach.</p></li>
        <li className="lt-standard-card light-card p-5"><h3>Review notes and checklist.</h3><p className="mt-3 text-sm leading-6">Issues to resolve, agreed revisions and handover for your approval.</p></li>
      </ul><p className="mt-5">Deliverables depend on accepted scope. We do not manufacture proof, set your tender price or promise buyer acceptance.</p>
    </TenderSection>
    <TenderSection id="process" eyebrow="ONE CLEAR PROCESS" title="You bring the expertise. We bring structure." tone="section-light-connected">
      <ol className="lt-restored-gates mt-8">{workflow.map(([title,text], index) => <li key={title} className="lt-standard-card light-card p-5"><span className="section-eyebrow">0{index + 1}</span><h3 className="mt-3 text-xl font-medium">{title}</h3><p className="mt-3 text-sm leading-6">{text}</p></li>)}</ol>
    </TenderSection>
    <TenderSection eyebrow="FIT AND BOUNDARIES" title="For businesses with an opportunity they can stand behind.">
      <div className="lt-tender-fit-layout mt-8">
        <div className="lt-fix-cards grid gap-4">
          <article className="lt-standard-card light-card p-5"><h3>A real opportunity</h3><p className="mt-3 text-sm leading-6">Best suited to UK SMEs with a real opportunity, an approved delivery approach and access to relevant evidence. The sector guidance below is not a claim of completed client work in each field.</p></article>
          <article className="lt-standard-card light-card p-5"><h3>Scope and boundaries</h3><p className="mt-3 text-sm leading-6">Not a fit for fake qualifications, bypassing rules, submission without approval or award guarantees. Short deadlines, multiple lots and unusual technical or legal requirements need a specific scope discussion.</p><RouteLink className="lt-tender-resource-link mt-4" href="/about">About LionTech <ArrowRight size={15} aria-hidden="true" /></RouteLink></article>
        </div>
        <figure className="lt-tender-illustration"><TenderImage supporting /><figcaption>{illustrationCaption} The embedded promotional wording is illustrative, not proof of a government relationship or an award outcome. <a href="/assets/tenders/tender-support-illustration-1672.webp" target="_blank" rel="noopener noreferrer">View full illustration ↗</a></figcaption></figure>
      </div>
    </TenderSection>
    <TenderSection id="scope" eyebrow="CLEAR SCOPE" title="Confirm the opportunity before committing." tone="section-light-connected">
      <div className="lt-commercial-card lt-tender-scope-panel mt-8 p-6"><div className="space-y-3"><p>Send the opportunity, deadline and support you need. We review fit and availability, then confirm a written scope and next steps. Sending an enquiry does not commit you to a purchase or start work.</p><p>No award guarantees, fabricated evidence or automatic portal submission. Your business retains approval of its technical approach, commercial commitments and final response.</p></div><RouteLink className="lt-button lt-button-primary" href={`${tenderPath}#enquiry`}>Request Tender Support <ArrowRight size={15} aria-hidden="true" /></RouteLink></div>
    </TenderSection>
    <TenderSection eyebrow="PRACTICAL ANSWERS" title="Before you enquire">
      <div className="lt-faq mt-6" data-tender-faq>{faq.map(([question,answer]) => <details key={question}><summary>{question}<ChevronDown size={18} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div>
    </TenderSection>
    <TenderSection id="guides" eyebrow="USEFUL RESOURCES" title="Find the guidance or worksheet you need." tone="section-light-connected">
      <div className="lt-tender-resources lt-uniform-grid lt-fix-cards mt-8 grid gap-4 md:grid-cols-3">{(['sector','guide','template'] as const).map(type => <article className="lt-standard-card light-card p-5" key={type}><h3>{type === 'sector' ? 'Sector preparation' : type === 'guide' ? 'Practical guides' : 'Templates and planners'}</h3><ul className="mt-4">{tenderVisiblePages.filter(page => page.type===type).map(page => <li key={page.slug}><RouteLink className="lt-tender-resource-link" href={page.path}>{page.h1}<ArrowRight size={16} aria-hidden="true" /></RouteLink></li>)}</ul></article>)}</div>
    </TenderSection>
    <TenderSection id="enquiry" eyebrow="YOUR NEXT STEP" title="Have a tender in front of you?">
      <p className="mt-4 max-w-3xl">Tell us the deadline, public opportunity link and where you need support. We will review the request and confirm an appropriate next step.</p><TenderEnquiryForm />
    </TenderSection>
  </div>;
}
