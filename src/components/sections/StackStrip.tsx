import { BrandMark } from '../brand/BrandMark';

const stack = [
  'Anthropic',
  'NVIDIA',
  'Vercel',
  'AWS',
  'Supabase',
  'Stripe',
  'OpenAI',
  'Microsoft Azure',
  'Google Cloud',
  'GitHub',
] as const;

export function StackStrip() {
  return (
    <section className="lt-stack-strip lt-stack-strip-restored" aria-label="Our Stack">
      <div className="lt-shell lt-stack-inner">
        <h2>Our Stack</h2>
        <div className="lt-stack-list" role="list">
          {stack.map((name) => (
            <div key={name} className="brand-logo" role="listitem" aria-label={name} title={name}>
              <BrandMark name={name} />
              <span className="brand-wordmark">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
