import { PageIntro } from '../components/sections/PageIntro';
import { PrimaryCta } from '../components/ui/PrimaryCta';
import { company } from '../content/company';
import { platforms } from '../content/platforms';
import { breadcrumbSchema, organizationSchema } from '../lib/schema';
import { useSeo } from '../lib/seo';

export function AboutPage() {
  useSeo({ title: 'About LionTech Innovations | Manchester, UK', description: `${company.legalName} is a Manchester-based AI Business Readiness and production systems company.`, path: '/about', schema: [organizationSchema, breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])] });
  return <><PageIntro eyebrow="ABOUT LIONTECH" title="Evidence-led readiness. Production engineering." description={`${company.legalName} is based in Manchester and serves UK businesses remotely.`}><PrimaryCta /></PageIntro><section className="lt-section"><div className="lt-shell lt-about-copy"><h2>Built for practical decisions.</h2><p>LionTech helps businesses understand what customer-facing AI systems currently say, then turns material gaps into a controlled implementation plan.</p><p>The operating proof is a portfolio of live platforms across visa risk intelligence, fee calculation, care operations and local-services lead recovery.</p><div className="lt-about-platforms">{platforms.map((platform) => <span key={platform.name}>{platform.name}</span>)}</div></div></section></>;
}
