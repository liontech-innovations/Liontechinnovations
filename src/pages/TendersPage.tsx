import { RouteLink } from '../components/ui/RouteLink';
import { RouteHeading, RouteSection } from '../components/sections/RoutePageSections';
import { TenderEnquiryForm } from '../components/TenderEnquiryForm';
import { tenderVisiblePages, tendersPreview } from '../content/tenders';
import { tenderPricing, formatTenderMoney } from '../content/tenders/pricing';
import { tenderHubSeo } from '../content/tenders/seo';
import { useSeo } from '../lib/seo';
import '../styles/tenders.css';
const illustrationCaption = "AI-generated illustration, not a photograph of LionTech staff or premises. LionTech is independent and is not affiliated with the UK government.";
export function TenderImage({ supporting = false }: { supporting?: boolean }) {
  const name = supporting ? 'tender-support-illustration' : 'tender-hero-meeting';
  return <img src={`/assets/tenders/${name}-960.webp`} srcSet={[640,960,1440,1672].map(width => `/assets/tenders/${name}-${width}.webp ${width}w`).join(', ')} sizes="100vw" width="1672" height="941" alt={supporting ? 'AI-generated UK tender illustration with documents, laptop and a Union flag; not LionTech premises.' : 'AI-generated scene of fictional professionals reviewing documents, with Westminster and a Union flag in the background.'} loading={supporting ? 'lazy' : 'eager'} fetchPriority={supporting ? 'auto' : 'high'} decoding="async" />;
}
const workflow = [
  ['Share the opportunity', 'Start with its public link, deadline and the support you need. Confidential documents follow through an agreed channel.'],
  ['Agree the scope', 'We confirm fit, capacity, deliverables, fee and a practical timeline before any deposit is requested.'],
  ['Map requirements and evidence', 'Missing proof and unconfirmed commitments become clear actions, not invented text.'],
  ['Prepare and review', 'AI assists organisation and drafting. Human review checks the proposed response against the source material.'],
  ['You approve', 'Your business confirms facts, delivery commitments and commercial decisions before using the final work.'],
];
const faq = [
  ['Do you guarantee that we will win?', 'No. The buyer decides the outcome. We help prepare a clearer, evidence-led response; a contract award cannot be guaranteed.'],
  ['Can you help with an existing draft?', 'A review or defined set of revisions can be scoped around your existing draft. We first check the pack, timing and what needs attention.'],
  ['Will you write the whole submission?', 'Only the sections and deliverables in the written scope. You provide and confirm the technical solution, evidence, prices and commitments. Additional sections or lots are separately quoted.'],
  ['How quickly can we start?', 'Availability is confirmed after reviewing the opportunity and deadline. Any delivery target starts from the agreed date, complete inputs and required payment, not simply a button click.'],
  ['What happens when evidence is missing?', 'We identify what is missing and who must supply or approve it. We do not invent certificates, experience, policies or future promises.'],
  ['Is AI used?', 'AI may assist analysis, organisation and drafting. It does not replace human review or client approval. Document handling must be agreed before confidential material is supplied.'],
  ['Do you submit the tender for us?', 'Submission is not included by default. Your business retains control of its portal account and final submission unless separately agreed in writing.'],
];
export function TendersPage() {
  useSeo(tenderHubSeo);
  return <div className="lt-tender-page">
    {tendersPreview && <aside className="lt-tender-review" role="note">Review draft. Content, commercial scope and prices await founder approval. No checkout is active.</aside>}
    <section className="lt-tender-hero">
      <figure className="lt-tender-hero-image"><TenderImage /></figure>
      <div className="lt-shell lt-tender-hero-copy"><p className="lt-kicker">TENDER SPRINT · UK BUSINESS BID SUPPORT</p><h1>UK Tender Support</h1><p><strong>Your expertise. A stronger tender response.</strong></p><p>Evidence-led tender support for UK businesses, with AI assistance and human review. LionTech helps turn a tender pack and company evidence into a clear, organised response. Identify requirements, surface missing proof and develop a draft before client approval.</p><div className="lt-tender-actions"><RouteLink className="lt-button lt-button-primary" href="#enquiry">Discuss your tender</RouteLink><RouteLink className="lt-button lt-button-secondary" href="#pricing">View scope and pricing</RouteLink></div><p>Clear scope · Evidence-led preparation · Human review · No win guarantees</p></div>
    </section>
    <p className="lt-shell lt-tender-caption">{illustrationCaption}</p>
    <RouteSection><RouteHeading eyebrow="THE WORK BEHIND THE WORDS" title="A tender asks for more than good writing." /><p>A polished answer still needs to address the question, fit the word limit and be supported by the right documents. Current practice and future contractual promises are not the same thing.</p><p>What does the buyer ask for? What can your business evidence? What needs confirmation before the answer is final?</p>
      <ul className="lt-tender-deliverables"><li><strong>Requirements and response map.</strong> Questions, mandatory points, deadlines, owners and references.</li><li><strong>Evidence and gap register.</strong> Available proof, its scope and the information still needed.</li><li><strong>Scoped draft responses.</strong> Structured around the instructions and your approved delivery approach.</li><li><strong>Review notes and checklist.</strong> Issues to resolve, agreed revisions and handover for your approval.</li></ul><p>Deliverables depend on accepted scope. We do not manufacture proof, set your tender price or promise buyer acceptance.</p></RouteSection>
    <RouteSection id="process"><RouteHeading eyebrow="ONE CLEAR PROCESS" title="You bring the expertise. We bring structure." /><ol className="lt-tender-workflow">{workflow.map(([title,text]) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ol></RouteSection>
    <figure className="lt-shell lt-tender-illustration"><TenderImage supporting /><figcaption>{illustrationCaption} The embedded promotional wording is illustrative, not proof of a government relationship or an award outcome. <a href="/assets/tenders/tender-support-illustration-1672.webp" target="_blank" rel="noopener noreferrer">View full illustration ↗</a></figcaption></figure>
    <RouteSection><RouteHeading eyebrow="FIT AND BOUNDARIES" title="For businesses with an opportunity they can stand behind." /><p>Best suited to UK SMEs with a real opportunity, an approved delivery approach and access to relevant evidence. The sector guidance below is not a claim of completed client work in each field.</p><p>Not a fit for fake qualifications, bypassing rules, submission without approval or award guarantees. Short deadlines, multiple lots and unusual technical or legal requirements need a specific scope discussion.</p><RouteLink href="/about">About LionTech</RouteLink></RouteSection>
    <RouteSection id="pricing"><RouteHeading eyebrow="CLEAR SCOPE, AGREED FEE" title="Confirm the opportunity before committing." />
      <p className="lt-tender-review">Proposed preview amounts only. Tax treatment, scope, capacity and payment terms are not yet approved. These are not final checkout totals.</p>
      <div className="lt-tender-offers">{tenderPricing.offers.map(offer => <article className="lt-tender-offer" key={offer.code}><h3>{offer.name}</h3><p className="lt-tender-price">Proposed {formatTenderMoney(offer.fullFee)}</p><p>{offer.initialPayment === offer.fullFee ? 'One-off full payment after acceptance.' : `${formatTenderMoney(offer.initialPayment)} initial deposit after acceptance; ${formatTenderMoney(offer.fullFee-offer.initialPayment)} balance under agreed terms. No automatic second debit.`}</p><p>{offer.scope}</p><p>{offer.delivery}</p><RouteLink className="lt-button lt-button-primary" href="#enquiry">{offer.action}</RouteLink></article>)}</div>
      <p>Clear scope, an agreed fee and no subscription. All tiers exclude: {tenderPricing.exclusions.join('; ')}.</p>
    </RouteSection>
    <RouteSection><RouteHeading eyebrow="PRACTICAL ANSWERS" title="Before you enquire" /><div className="lt-tender-faq">{faq.map(([question,answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></RouteSection>
    <RouteSection id="guides"><RouteHeading eyebrow="USEFUL RESOURCES" title="Find the guidance or worksheet you need." />{(['sector','guide','template'] as const).map(type => <section className="lt-tender-directory" key={type}><h3>{type === 'sector' ? 'Sector preparation' : type === 'guide' ? 'Practical guides' : 'Templates and planners'}</h3><ul>{tenderVisiblePages.filter(page => page.type===type).map(page => <li key={page.slug}><RouteLink href={page.path}>{page.h1} ↗</RouteLink></li>)}</ul></section>)}</RouteSection>
    <RouteSection id="enquiry"><RouteHeading eyebrow="YOUR NEXT STEP" title="Have a tender in front of you?" description="Tell us the deadline, public opportunity link and where you need support. We will review the request and confirm an appropriate next step." /><TenderEnquiryForm /></RouteSection>
  </div>;
}
