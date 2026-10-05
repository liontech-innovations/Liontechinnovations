import { useEffect, useRef, useState } from 'react';
import { budgets, devRequestLimits, projectTypes, timescales } from '../content/devRequest';
import { devFixPackageInterests, devFixRequestLimits, devFixUrgencies } from '../content/devFix';
import { normalizeWebsiteUrl } from '../lib/normalizeWebsiteUrl.js';
import { RouteLink } from './ui/RouteLink';

export function DevRequestForm({ variant = 'development' }: { variant?: 'development' | 'dev-fix' }) {
  const isDevFix = variant === 'dev-fix';
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const busy = useRef(false);
  const attempt = useRef<{ fingerprint: string; requestId: string; submittedAt: string } | null>(null);
  const success = useRef<HTMLDivElement>(null);
  useEffect(() => { if (state === 'success') success.current?.focus(); }, [state]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as Record<string, string>;
    for (const key of isDevFix ? ['websiteUrl'] : ['websiteUrl', 'referenceUrl']) {
      const field = form.elements.namedItem(key) as HTMLInputElement;
      const url = values[key].trim() ? normalizeWebsiteUrl(values[key]) : '';
      field.setCustomValidity(url === null ? 'Enter a valid website or domain, such as example.co.uk.' : '');
      if (!field.reportValidity()) return;
      values[key] = url || '';
    }
    if (isDevFix) {
      const phone = form.elements.namedItem('phone') as HTMLInputElement;
      phone.setCustomValidity(values.phone.trim() && !/^[+0-9(). -]{6,40}$/.test(values.phone.trim()) ? 'Enter a valid phone number.' : '');
      if (!phone.reportValidity()) return;
      const field = form.elements.namedItem('referenceLinks') as HTMLTextAreaElement;
      const links = values.referenceLinks.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map(normalizeWebsiteUrl);
      field.setCustomValidity(links.some((link) => link === null) ? 'Enter one valid URL or domain per line.' : '');
      if (!field.reportValidity()) return;
      values.referenceLinks = links.join('\n');
      values.requestType = 'dev-fix';
    }
    const fingerprint = JSON.stringify(values);
    // Preserve the same payload/key after a timeout so retries cannot send duplicate mail.
    if (!attempt.current || attempt.current.fingerprint !== fingerprint || Date.now() - Date.parse(attempt.current.submittedAt) > 22 * 60 * 60_000) {
      attempt.current = { fingerprint, requestId: crypto.randomUUID(), submittedAt: new Date().toISOString() };
    }
    busy.current = true;
    setState('submitting');
    setError('');
    try {
      const response = await fetch('/api/dev-request', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(20_000),
        body: JSON.stringify({ ...values, requestId: attempt.current.requestId, submittedAt: attempt.current.submittedAt }),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        setError(response.status === 429 ? 'Too many requests. Please try again in 10 minutes.' : 'We could not confirm delivery. Retry, or email contact@liontechinnovations.co.uk.');
        setState('error');
        return;
      }
      setState('success');
    } catch {
      setError('We could not confirm delivery. Retry, or email contact@liontechinnovations.co.uk.');
      setState('error');
    } finally { busy.current = false; }
  }

  if (state === 'success') return <div className="lt-form-success" role="status" tabIndex={-1} ref={success}><h2>Request received.</h2><p>{isDevFix ? 'LionTech will review the issue and reply with the next step.' : "We'll review the scope and reply with the next practical step."}</p></div>;

  return (
    <form className="lt-enquiry-form lt-dev-form" onSubmit={submit} aria-label={isDevFix ? 'Dev Fix request' : 'Development request'} aria-busy={state === 'submitting'}>
      <fieldset className="lt-form-section" disabled={state === 'submitting'}>
        <legend>{isDevFix ? 'Request a Dev Fix' : 'Your development request'}</legend>
        {isDevFix ? <div className="lt-form-grid">
          <label>Name<input name="name" required autoComplete="name" maxLength={devFixRequestLimits.name} /></label>
          <label>Email<input name="email" required type="email" autoComplete="email" maxLength={devFixRequestLimits.email} /></label>
          <label>Phone / WhatsApp (optional)<input name="phone" type="tel" autoComplete="tel" maxLength={devFixRequestLimits.phone} onChange={(event) => event.currentTarget.setCustomValidity('')} /></label>
          <label>Business name<input name="company" required autoComplete="organization" maxLength={devFixRequestLimits.company} /></label>
          <label className="lt-form-span">Website or app URL<input name="websiteUrl" required inputMode="url" maxLength={devFixRequestLimits.websiteUrl} onChange={(event) => event.currentTarget.setCustomValidity('')} /></label>
          <label className="lt-form-span">What is broken?<textarea name="description" required rows={5} maxLength={devFixRequestLimits.description} /></label>
          <label className="lt-form-span">What should happen instead?<textarea name="expectedOutcome" required rows={4} maxLength={devFixRequestLimits.expectedOutcome} /></label>
          <label className="lt-form-span">What tools/stack are involved?<textarea name="tools" required rows={3} maxLength={devFixRequestLimits.tools} placeholder="WordPress, Shopify, Webflow, Next.js, Vercel, Supabase, Stripe, Wix, Make, Zapier, Airtable, etc." /></label>
          <label>Urgency<select name="urgency" required defaultValue=""><option value="" disabled>Select urgency</option>{devFixUrgencies.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label>Package interest<select name="packageInterest" required defaultValue=""><option value="" disabled>Select package</option>{devFixPackageInterests.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="lt-form-span">Links to screenshots, Loom, repo, or error logs (optional)<textarea name="referenceLinks" rows={3} maxLength={devFixRequestLimits.referenceLinks} aria-describedby="dev-reference-help" onChange={(event) => event.currentTarget.setCustomValidity('')} /><span className="lt-dev-help" id="dev-reference-help">One public URL per line.</span></label>
        </div> : <div className="lt-form-grid">
          <label>Name<input name="name" required autoComplete="name" maxLength={devRequestLimits.name} /></label>
          <label>Email<input name="email" required type="email" autoComplete="email" maxLength={devRequestLimits.email} /></label>
          <label>Business / organisation name<input name="company" required autoComplete="organization" maxLength={devRequestLimits.company} /></label>
          <label>Website or existing app URL (optional)<input name="websiteUrl" inputMode="url" maxLength={devRequestLimits.websiteUrl} onChange={(event) => event.currentTarget.setCustomValidity('')} /></label>
          <label className="lt-form-span">What do you need?<select name="projectType" required defaultValue=""><option value="" disabled>Select project type</option>{projectTypes.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="lt-form-span">Describe what you need built or fixed<textarea name="description" required rows={6} maxLength={devRequestLimits.description} aria-describedby="dev-description-help" /><span id="dev-description-help" className="lt-dev-help">Tell us what is broken, unfinished or what you want the system to do. You do not need to write a technical specification.</span></label>
          <label>Budget range<select name="budget" required defaultValue=""><option value="" disabled>Select budget range</option>{budgets.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label>Desired timescale<select name="timescale" required defaultValue=""><option value="" disabled>Select timescale</option>{timescales.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="lt-form-span">Existing repository / demo / reference URL (optional)<input name="referenceUrl" inputMode="url" maxLength={devRequestLimits.referenceUrl} onChange={(event) => event.currentTarget.setCustomValidity('')} /></label>
        </div>}
        <label className="lt-honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" maxLength={devRequestLimits.website} /></label>
        <p className="lt-dev-help lt-dev-notice">Please do not include passwords, API keys, customer data or private access links.</p>
        {isDevFix ? <label className="lt-consent"><input name="consent" type="checkbox" value="on" required /><span>I confirm LionTech may contact me about this request. <RouteLink href="/privacy-policy">Privacy Policy</RouteLink>.</span></label> : <p className="lt-dev-help lt-dev-notice">By submitting this form, you agree that Lion Tech Innovations Ltd may use the information provided to review and respond to your enquiry. <RouteLink href="/privacy-policy">Privacy Policy</RouteLink>.</p>}
        {error && <p className="lt-form-error" role="alert">{error}</p>}
        <button className="lt-button lt-button-primary" type="submit" disabled={state === 'submitting'}>{state === 'submitting' ? 'Sending request' : 'REQUEST A DEV FIX'}</button>
      </fieldset>
    </form>
  );
}
