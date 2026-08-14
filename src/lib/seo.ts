import { useEffect } from 'react';
import { company } from '../content/company';

export type SeoConfig = {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
};

function setMeta(selector: string, attribute: 'content' | 'href', value: string) {
  const element = document.querySelector(selector);
  element?.setAttribute(attribute, value);
}

export function useSeo({ title, description, path, type = 'website', schema }: SeoConfig) {
  useEffect(() => {
    const canonical = new URL(path, company.website).toString();
    document.title = title;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:type"]', 'content', type);
    setMeta('meta[property="og:url"]', 'content', canonical);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('link[rel="canonical"]', 'href', canonical);

    const id = 'route-structured-data';
    document.getElementById(id)?.remove();
    if (schema) {
      const script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => document.getElementById(id)?.remove();
  }, [description, path, schema, title, type]);
}
