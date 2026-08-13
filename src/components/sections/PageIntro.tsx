import type { ReactNode } from 'react';

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageIntro({ eyebrow, title, description, children }: PageIntroProps) {
  return (
    <section className="lt-page-intro">
      <div className="lt-shell lt-page-intro-inner">
        {eyebrow && <p className="lt-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        <p className="lt-page-lede">{description}</p>
        {children}
      </div>
    </section>
  );
}
