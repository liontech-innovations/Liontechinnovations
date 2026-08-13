import { Braces, BrainCircuit, Cloud, Code2, CreditCard, Database, Server, Sparkles } from 'lucide-react';

const stack = [
  { name: 'Anthropic', icon: BrainCircuit },
  { name: 'NVIDIA', icon: Sparkles },
  { name: 'Vercel', icon: Braces },
  { name: 'AWS', icon: Server },
  { name: 'Supabase', icon: Database },
  { name: 'Stripe', icon: CreditCard },
  { name: 'OpenAI', icon: BrainCircuit },
  { name: 'Microsoft Azure', icon: Cloud },
  { name: 'Google Cloud', icon: Cloud },
  { name: 'GitHub', icon: Code2 },
] as const;

export function StackStrip() {
  return (
    <section className="lt-stack-strip" aria-label="Our Stack">
      <div className="lt-shell lt-stack-inner">
        <h2>Our Stack</h2>
        <div className="lt-stack-list" role="list">
          {stack.map(({ name, icon: Icon }) => (
            <div key={name} className="lt-stack-item" role="listitem" aria-label={name}>
              <Icon aria-hidden="true" size={17} strokeWidth={1.5} />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
