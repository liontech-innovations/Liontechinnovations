import type { TenderCatalogEntry } from './types';

export const tenderCatalog = [
  {
    "id": "T01",
    "slug": "cleaning-tender-support",
    "path": "/tenders/cleaning-tender-support",
    "type": "sector",
    "cohort": 1,
    "h1": "Cleaning tender support",
    "title": "Cleaning tender support | LionTech",
    "intent": "Cleaning-specific evidence readiness, mobilisation and quality records; not a generic FM article.",
    "audience": "Cleaning contractor with a public-sector opportunity",
    "utility": {
      "name": "Cleaning bid evidence checklist",
      "fields": [
        "staff coverage",
        "site specification",
        "supervision",
        "COSHH evidence",
        "inspection records",
        "mobilisation approvals"
      ]
    },
    "related": [
      "/tenders/tender-evidence-register-template",
      "/tenders/90-day-mobilisation-plan-template",
      "/tenders/bid-review-checklist"
    ]
  },
  {
    "id": "T02",
    "slug": "facilities-management-tender-support",
    "path": "/tenders/facilities-management-tender-support",
    "type": "sector",
    "cohort": 1,
    "h1": "Facilities management tender support",
    "title": "Facilities management tender support | LionTech",
    "intent": "Define service boundaries, subcontractor responsibilities and a consolidated reporting plan; distinguish hard and soft FM.",
    "audience": "FM provider coordinating several services or sites",
    "utility": {
      "name": "FM responsibility and service-boundary matrix",
      "fields": [
        "service interfaces",
        "hard versus soft FM",
        "subcontractors",
        "escalation",
        "KPIs",
        "asset information"
      ]
    },
    "related": [
      "/tenders/cleaning-tender-support",
      "/tenders/building-maintenance-tender-support",
      "/tenders/tender-compliance-matrix-template"
    ]
  },
  {
    "id": "T03",
    "slug": "construction-tender-support",
    "path": "/tenders/construction-tender-support",
    "type": "sector",
    "cohort": 1,
    "h1": "Construction tender support",
    "title": "Construction tender support | LionTech",
    "intent": "Programme evidence, relevant works experience and supply-chain responsibilities; do not become a technical design/costing service.",
    "audience": "Construction SME assessing a public works tender",
    "utility": {
      "name": "Construction evidence readiness worksheet",
      "fields": [
        "programme",
        "relevant projects",
        "delivery roles",
        "subcontractors",
        "quality records",
        "H&S documentation"
      ]
    },
    "related": [
      "/tenders/tender-case-study-template",
      "/tenders/tender-document-checklist",
      "/tenders/bid-no-bid-checklist"
    ]
  },
  {
    "id": "T04",
    "slug": "grounds-maintenance-tender-support",
    "path": "/tenders/grounds-maintenance-tender-support",
    "type": "sector",
    "cohort": 2,
    "h1": "Grounds maintenance tender support",
    "title": "Grounds maintenance tender support | LionTech",
    "intent": "Seasonal scheduling, machinery competence and service-continuity evidence.",
    "audience": "Grounds contractor bidding for seasonal and public-space work",
    "utility": {
      "name": "Seasonal service plan and evidence matrix",
      "fields": [
        "seasonal visits",
        "equipment",
        "public access",
        "weather contingency",
        "waste",
        "inspection records"
      ]
    },
    "related": [
      "/tenders/90-day-mobilisation-plan-template",
      "/tenders/tender-case-study-template",
      "/tenders/tender-deadline-planner"
    ]
  },
  {
    "id": "T05",
    "slug": "security-services-tender-support",
    "path": "/tenders/security-services-tender-support",
    "type": "sector",
    "cohort": 2,
    "h1": "Security services tender support",
    "title": "Security services tender support | LionTech",
    "intent": "Role-specific licence evidence, rostering and incident escalation; distinguish statutory duties from buyer requirements.",
    "audience": "Security provider considering guarding or patrol work",
    "utility": {
      "name": "Security bid evidence and escalation checklist",
      "fields": [
        "role/licence mapping",
        "roster resilience",
        "incident reporting",
        "supervision",
        "training records",
        "contract boundaries"
      ]
    },
    "related": [
      "/tenders/tender-document-checklist",
      "/tenders/client-commitment-register-template",
      "/tenders/bid-review-checklist"
    ]
  },
  {
    "id": "T06",
    "slug": "catering-tender-support",
    "path": "/tenders/catering-tender-support",
    "type": "sector",
    "cohort": 2,
    "h1": "Catering tender support",
    "title": "Catering tender support | LionTech",
    "intent": "Menu/service scope, food-safety evidence, supply continuity and cost ownership without universal school-specific requirements.",
    "audience": "Catering operator responding to a public-sector specification",
    "utility": {
      "name": "Catering response evidence checklist",
      "fields": [
        "service scope",
        "food safety",
        "allergen processes",
        "staffing",
        "supplier continuity",
        "performance records"
      ]
    },
    "related": [
      "/tenders/tender-compliance-matrix-template",
      "/tenders/tender-evidence-register-template",
      "/tenders/social-value-response-planner"
    ]
  },
  {
    "id": "T07",
    "slug": "building-maintenance-tender-support",
    "path": "/tenders/building-maintenance-tender-support",
    "type": "sector",
    "cohort": 2,
    "h1": "Building maintenance tender support",
    "title": "Building maintenance tender support | LionTech",
    "intent": "Planned versus reactive services, response commitments and competent-person evidence; not broad integrated FM.",
    "audience": "Repair and maintenance contractor bidding for reactive/planned work",
    "utility": {
      "name": "Reactive response and planned-maintenance matrix",
      "fields": [
        "job priority",
        "response versus resolution",
        "competence",
        "subcontractors",
        "planned schedule",
        "reporting"
      ]
    },
    "related": [
      "/tenders/facilities-management-tender-support",
      "/tenders/client-commitment-register-template",
      "/tenders/tender-case-study-template"
    ]
  },
  {
    "id": "T08",
    "slug": "it-services-tender-support",
    "path": "/tenders/it-services-tender-support",
    "type": "sector",
    "cohort": 2,
    "h1": "IT services tender support",
    "title": "IT services tender support | LionTech",
    "intent": "Support model, security evidence, transition and service levels; scheme claims must match actual scope.",
    "audience": "IT managed-service or software supplier preparing a public bid",
    "utility": {
      "name": "IT tender evidence and service-level worksheet",
      "fields": [
        "support hours",
        "service levels",
        "security evidence",
        "data handling",
        "transition",
        "technical reference projects"
      ]
    },
    "related": [
      "/tenders/client-commitment-register-template",
      "/tenders/tender-evidence-register-template",
      "/tenders/framework-agreements-and-call-offs"
    ]
  },
  {
    "id": "T09",
    "slug": "bid-no-bid-checklist",
    "path": "/tenders/bid-no-bid-checklist",
    "type": "guide",
    "cohort": 1,
    "h1": "Bid/no-bid checklist for a UK tender",
    "title": "Bid/no-bid checklist for a UK tender | LionTech",
    "intent": "Separate disqualifying constraints from weighted preferences. Explain that a planning score is not win probability.",
    "audience": "SME owner deciding whether to invest time in a tender",
    "utility": {
      "name": "Printable go / clarify / no-go worksheet",
      "fields": [
        "eligibility",
        "capacity",
        "evidence",
        "deadline",
        "commercial fit",
        "decision owner"
      ]
    },
    "related": [
      "/tenders/tender-document-checklist",
      "/tenders/tender-compliance-matrix-template",
      "/tenders/tender-deadline-planner"
    ]
  },
  {
    "id": "T10",
    "slug": "how-to-find-uk-tenders",
    "path": "/tenders/how-to-find-uk-tenders",
    "type": "guide",
    "cohort": 2,
    "h1": "How to find UK public-sector tenders",
    "title": "How to find UK public-sector tenders | LionTech",
    "intent": "Explain official free search routes, search filters and country differences; do not sell government registration.",
    "audience": "Supplier looking for genuine opportunities rather than consultancy",
    "utility": {
      "name": "Official-source search log",
      "fields": [
        "Find a Tender",
        "Contracts Finder",
        "devolved portals",
        "keywords",
        "filters",
        "opportunity tracking"
      ]
    },
    "related": [
      "/tenders/preparing-your-first-tender",
      "/tenders/bid-no-bid-checklist",
      "/tenders/framework-agreements-and-call-offs"
    ]
  },
  {
    "id": "T11",
    "slug": "tender-document-checklist",
    "path": "/tenders/tender-document-checklist",
    "type": "guide",
    "cohort": 2,
    "h1": "Tender document checklist: what to gather",
    "title": "Tender document checklist: what to gather | LionTech",
    "intent": "Separate the buyer tender pack, supplier statements, proof documents and authorised future commitments.",
    "audience": "Bid owner assembling the actual evidence pack",
    "utility": {
      "name": "Document inventory with evidence status",
      "fields": [
        "ITT",
        "specification",
        "response workbook",
        "certificates",
        "insurance",
        "confirmation letters"
      ]
    },
    "related": [
      "/tenders/tender-evidence-register-template",
      "/tenders/client-commitment-register-template",
      "/tenders/bid-review-checklist"
    ]
  },
  {
    "id": "T12",
    "slug": "how-to-write-tender-method-statements",
    "path": "/tenders/how-to-write-tender-method-statements",
    "type": "guide",
    "cohort": 2,
    "h1": "How to write a tender method statement",
    "title": "How to write a tender method statement | LionTech",
    "intent": "Teach who/what/when/how checked, directly against the buyer question, with a before/after fictional example.",
    "audience": "Subject expert turning an operating method into a scored answer",
    "utility": {
      "name": "Annotated method-statement skeleton",
      "fields": [
        "buyer question",
        "responsibility",
        "delivery steps",
        "monitoring",
        "source links",
        "word limit"
      ]
    },
    "related": [
      "/tenders/tender-scoring-and-evaluation-criteria",
      "/tenders/tender-case-study-template",
      "/tenders/client-commitment-register-template"
    ]
  },
  {
    "id": "T13",
    "slug": "tender-scoring-and-evaluation-criteria",
    "path": "/tenders/tender-scoring-and-evaluation-criteria",
    "type": "guide",
    "cohort": 2,
    "h1": "Understanding tender scoring and evaluation criteria",
    "title": "Understanding tender scoring and evaluation criteria | LionTech",
    "intent": "Explain published weights and score descriptors using a clearly invented worked calculation; never infer an unpublished buyer rubric.",
    "audience": "Bid manager allocating response effort",
    "utility": {
      "name": "Worked weighted-score example",
      "fields": [
        "published criteria",
        "weighting",
        "mandatory gates",
        "word allocation",
        "evidence strength",
        "review checks"
      ]
    },
    "related": [
      "/tenders/how-to-write-tender-method-statements",
      "/tenders/tender-compliance-matrix-template",
      "/tenders/bid-review-checklist"
    ]
  },
  {
    "id": "T14",
    "slug": "framework-agreements-and-call-offs",
    "path": "/tenders/framework-agreements-and-call-offs",
    "type": "guide",
    "cohort": 2,
    "h1": "Framework agreements and call-offs: a supplier guide",
    "title": "Framework agreements and call-offs: a supplier guide | LionTech",
    "intent": "Distinguish framework admission from an actual contract or guaranteed work. Source current rules and nation scope.",
    "audience": "Supplier deciding whether a framework opportunity is commercially sensible",
    "utility": {
      "name": "Framework opportunity decision worksheet",
      "fields": [
        "admission",
        "call-off",
        "competition",
        "scope",
        "commercial costs",
        "no guaranteed volume"
      ]
    },
    "related": [
      "/tenders/how-to-find-uk-tenders",
      "/tenders/bid-no-bid-checklist",
      "/tenders/preparing-your-first-tender"
    ]
  },
  {
    "id": "T15",
    "slug": "tender-clarification-questions",
    "path": "/tenders/tender-clarification-questions",
    "type": "guide",
    "cohort": 3,
    "h1": "How to ask useful tender clarification questions",
    "title": "How to ask useful tender clarification questions | LionTech",
    "intent": "Prioritise evidence-backed neutral questions and track official replies/addenda; do not use informal buyer contacts.",
    "audience": "Bid owner facing ambiguity before the question deadline",
    "utility": {
      "name": "Clarification log with example wording",
      "fields": [
        "ambiguity",
        "source reference",
        "question deadline",
        "portal",
        "response log",
        "version updates"
      ]
    },
    "related": [
      "/tenders/tender-deadline-planner",
      "/tenders/tender-compliance-matrix-template",
      "/tenders/tender-document-checklist"
    ]
  },
  {
    "id": "T16",
    "slug": "ai-assisted-bid-writing-human-review",
    "path": "/tenders/ai-assisted-bid-writing-human-review",
    "type": "guide",
    "cohort": 3,
    "h1": "AI-assisted bid writing: what needs human review",
    "title": "AI-assisted bid writing: what needs human review | LionTech",
    "intent": "Explain provenance, incomplete evidence, client promises and final accountability without claiming multiple models prove correctness.",
    "audience": "SME comparing DIY AI with managed bid support",
    "utility": {
      "name": "AI draft verification checklist",
      "fields": [
        "facts",
        "citations",
        "future promises",
        "privacy",
        "error review",
        "final approval"
      ]
    },
    "related": [
      "/tenders/client-commitment-register-template",
      "/tenders/tender-evidence-register-template",
      "/tenders/bid-review-checklist"
    ]
  },
  {
    "id": "T17",
    "slug": "preparing-your-first-tender",
    "path": "/tenders/preparing-your-first-tender",
    "type": "guide",
    "cohort": 3,
    "h1": "Preparing your first UK tender response",
    "title": "Preparing your first UK tender response | LionTech",
    "intent": "Provide an ordered beginner workflow and realistic ownership/deadline planning; no duplicate deep-dive scoring guide.",
    "audience": "First-time bidder planning the whole process",
    "utility": {
      "name": "First-bid action plan",
      "fields": [
        "opportunity selection",
        "pack review",
        "evidence owners",
        "draft schedule",
        "review",
        "submission responsibility"
      ]
    },
    "related": [
      "/tenders/bid-no-bid-checklist",
      "/tenders/tender-document-checklist",
      "/tenders/tender-deadline-planner"
    ]
  },
  {
    "id": "T18",
    "slug": "tender-compliance-matrix-template",
    "path": "/tenders/tender-compliance-matrix-template",
    "type": "template",
    "cohort": 1,
    "h1": "Tender compliance matrix template",
    "title": "Tender compliance matrix template | LionTech",
    "intent": "A usable requirement-to-response matrix with source page, mandatory flag, owner, evidence and status.",
    "audience": "Bid lead mapping every buyer requirement to an answer and proof",
    "utility": {
      "name": "Downloadable compliance matrix",
      "fields": [
        "requirement ID",
        "source page",
        "requirement text",
        "mandatory/weighted",
        "owner",
        "evidence",
        "response location",
        "status"
      ]
    },
    "related": [
      "/tenders/tender-document-checklist",
      "/tenders/tender-evidence-register-template",
      "/tenders/tender-scoring-and-evaluation-criteria"
    ]
  },
  {
    "id": "T19",
    "slug": "tender-evidence-register-template",
    "path": "/tenders/tender-evidence-register-template",
    "type": "template",
    "cohort": 3,
    "h1": "Tender evidence register template",
    "title": "Tender evidence register template | LionTech",
    "intent": "Document-level provenance, exact supporting passage, scope, dates and limitations; distinguish from a requirements matrix.",
    "audience": "Business gathering reusable proof without losing context",
    "utility": {
      "name": "Downloadable evidence register",
      "fields": [
        "evidence ID",
        "document",
        "issuer",
        "page",
        "quote",
        "scope",
        "expiry",
        "standing",
        "owner"
      ]
    },
    "related": [
      "/tenders/tender-compliance-matrix-template",
      "/tenders/client-commitment-register-template",
      "/tenders/tender-case-study-template"
    ]
  },
  {
    "id": "T20",
    "slug": "90-day-mobilisation-plan-template",
    "path": "/tenders/90-day-mobilisation-plan-template",
    "type": "template",
    "cohort": 3,
    "h1": "90-day mobilisation plan template for a tender",
    "title": "90-day mobilisation plan template for a tender | LionTech",
    "intent": "An adaptable example, not a universal requirement: milestones, owners, dependencies and approval status.",
    "audience": "Service supplier writing a contract transition plan",
    "utility": {
      "name": "Downloadable 90-day milestone planner",
      "fields": [
        "day/week",
        "milestone",
        "owner",
        "dependency",
        "proof",
        "contingency",
        "client approval"
      ]
    },
    "related": [
      "/tenders/cleaning-tender-support",
      "/tenders/facilities-management-tender-support",
      "/tenders/client-commitment-register-template"
    ]
  },
  {
    "id": "T21",
    "slug": "social-value-response-planner",
    "path": "/tenders/social-value-response-planner",
    "type": "template",
    "cohort": 3,
    "h1": "Social value tender response planner",
    "title": "Social value tender response planner | LionTech",
    "intent": "Define outcome, activity, metric, baseline, owner and reporting; use the buyer method, not assumed universal weights.",
    "audience": "Supplier proposing measurable tender-specific commitments",
    "utility": {
      "name": "Downloadable social-value commitment planner",
      "fields": [
        "buyer outcome",
        "proposed activity",
        "baseline",
        "target",
        "measurement",
        "owner",
        "cost",
        "approval"
      ]
    },
    "related": [
      "/tenders/client-commitment-register-template",
      "/tenders/tender-scoring-and-evaluation-criteria",
      "/tenders/catering-tender-support"
    ]
  },
  {
    "id": "T22",
    "slug": "tender-case-study-template",
    "path": "/tenders/tender-case-study-template",
    "type": "template",
    "cohort": 3,
    "h1": "Tender case study template",
    "title": "Tender case study template | LionTech",
    "intent": "Separate actual scope and attributable outcomes from future promises; no fabricated client names, endorsements or causation.",
    "audience": "SME translating delivered work into substantiated experience",
    "utility": {
      "name": "Downloadable experience case-study outline",
      "fields": [
        "client permission",
        "actual scope",
        "dates",
        "challenge",
        "action",
        "measured outcome",
        "source",
        "relevance"
      ]
    },
    "related": [
      "/tenders/construction-tender-support",
      "/tenders/building-maintenance-tender-support",
      "/tenders/tender-evidence-register-template"
    ]
  },
  {
    "id": "T23",
    "slug": "client-commitment-register-template",
    "path": "/tenders/client-commitment-register-template",
    "type": "template",
    "cohort": 3,
    "h1": "Client commitment register for tender promises",
    "title": "Client commitment register for tender promises | LionTech",
    "intent": "Make the difference between current practice and future contractual obligation explicit and auditable.",
    "audience": "Owner approving contractual promises made in a bid",
    "utility": {
      "name": "Downloadable commitment register",
      "fields": [
        "commitment ID",
        "exact promise",
        "contract scope",
        "cost owner",
        "approver",
        "approval date",
        "source",
        "conditions"
      ]
    },
    "related": [
      "/tenders/social-value-response-planner",
      "/tenders/90-day-mobilisation-plan-template",
      "/tenders/ai-assisted-bid-writing-human-review"
    ]
  },
  {
    "id": "T24",
    "slug": "bid-review-checklist",
    "path": "/tenders/bid-review-checklist",
    "type": "template",
    "cohort": 3,
    "h1": "Bid review checklist before final approval",
    "title": "Bid review checklist before final approval | LionTech",
    "intent": "A pre-submission check covering completeness, claims, versions, word limits, pricing, attachments and owner sign-off.",
    "audience": "Bid owner reviewing a substantially completed draft",
    "utility": {
      "name": "Downloadable red-team and release checklist",
      "fields": [
        "requirement coverage",
        "proof",
        "promises",
        "word limits",
        "pricing consistency",
        "attachments",
        "sign-off",
        "portal readiness"
      ]
    },
    "related": [
      "/tenders/tender-compliance-matrix-template",
      "/tenders/tender-deadline-planner",
      "/tenders/ai-assisted-bid-writing-human-review"
    ]
  },
  {
    "id": "T25",
    "slug": "tender-deadline-planner",
    "path": "/tenders/tender-deadline-planner",
    "type": "template",
    "cohort": 3,
    "h1": "Tender deadline and review planner",
    "title": "Tender deadline and review planner | LionTech",
    "intent": "Work back from actual portal times with separate clarification, evidence, review, upload and approval checkpoints.",
    "audience": "Team planning backwards from a submission deadline",
    "utility": {
      "name": "Downloadable deadline and responsibility planner",
      "fields": [
        "milestone",
        "date",
        "timezone",
        "owner",
        "dependency",
        "review time",
        "upload buffer",
        "status"
      ]
    },
    "related": [
      "/tenders/tender-clarification-questions",
      "/tenders/preparing-your-first-tender",
      "/tenders/bid-review-checklist"
    ]
  }
] satisfies TenderCatalogEntry[];
