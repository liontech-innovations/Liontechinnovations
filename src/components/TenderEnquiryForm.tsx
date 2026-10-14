import { useEffect, useRef, useState } from 'react';
import { tenderEnquiryLimits as limits, tenderSectors, tenderSupport } from '../content/tenders/enquiry';
import { tenderSourcePaths } from '../content/tenders';
import { normalizeWebsiteUrl } from '../lib/normalizeWebsiteUrl.js';
import { RouteLink } from './ui/RouteLink';
export function TenderEnquiryForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const busy = useRef(false);
  const attempt = useRef<{ fingerprint: string; requestId: string; submittedAt: string } | null>(null);
  const success = useRef<HTMLDivElement>(null);
  const query = new URLSearchParams(window.location.search);
  const requested = query.get('source') ? `/tenders/${query.get('source')}` : '/tenders';
  const source = tenderSourcePaths.includes(requested) ? requested : '/tenders';
  useEffect(() => { if (state === 'success') success.current?.focus(); }, [state]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const urlField = form.elements.namedItem('publicTenderUrl') as HTMLInputElement;
    const url = values.publicTenderUrl.trim() ? normalizeWebsiteUrl(values.publicTenderUrl) : '';
    urlField.setCustomValidity(url === null ? 'Use a public website URL without credentials.' : '');
    if (!urlField.reportValidity()) return;
    const timezone = form.elements.namedItem('timezone') as HTMLInputElement;
    try { new Intl.DateTimeFormat('en-GB', { timeZone: values.timezone }); timezone.setCustomValidity(''); }
    catch { timezone.setCustomValidity('Use a valid timezone, such as Europe/London or UTC.'); }
    if (!timezone.reportValidity()) return;
    values.publicTenderUrl = url || '';
    const fingerprint = JSON.stringify({ ...values, source });
    if (!attempt.current || attempt.current.fingerprint !== fingerprint || Date.now() - Date.parse(attempt.current.submittedAt) > 22 * 3_600_000) attempt.current = { fingerprint, requestId: crypto.randomUUID(), submittedAt: new Date().toISOString() };
    busy.current = true; setState('sending'); setError('');
    try {
      const response = await fetch('/api/tender-enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(20_000), body: JSON.stringify({ ...values, source, requestId: attempt.current.requestId, submittedAt: attempt.current.submittedAt }) });
      const result = await response.json();
      setState(response.ok && result.ok === true ? 'success' : 'error');
      if (!response.ok || result.ok !== true) setError(response.status === 429 ? 'Too many requests. Try again in 10 minutes.' : response.status === 400 ? 'Check the required fields, deadline, timezone and public link, then try again.' : 'We could not confirm receipt. Retry, or email admin@liontechinnovations.co.uk.');
    } catch { setState('error'); setError('We could not confirm receipt. Retry, or email admin@liontechinnovations.co.uk.'); }
    finally { busy.current = false; }
  }
  if (state === 'success') return <div className="lt-tender-success" role="status" tabIndex={-1} ref={success}><h3>Your enquiry has been received.</h3><p>We will review the opportunity and contact you about scope and availability.</p></div>;
  return <form className="lt-enquiry-form lt-tender-form lt-standard-card" onSubmit={submit} aria-label="Tender enquiry" aria-busy={state === 'sending'}>
    <fieldset disabled={state === 'sending'}>
      <legend>Request Tender Support</legend>
      <div className="lt-tender-form-grid">
        <label>Name<input name="name" required autoComplete="name" maxLength={limits.name} /></label>
        <label>Work email<input name="email" required type="email" autoComplete="email" maxLength={limits.email} /></label>
        <label>Company<input name="company" required autoComplete="organization" maxLength={limits.company} /></label>
        <label>Public tender link (optional)<input name="publicTenderUrl" inputMode="url" maxLength={limits.publicTenderUrl} onChange={e => e.currentTarget.setCustomValidity('')} /></label>
        <label>Submission deadline<input name="deadline" required type="datetime-local" /></label>
        <label>Deadline timezone<input name="timezone" required defaultValue="Europe/London" maxLength={limits.timezone} onChange={e => e.currentTarget.setCustomValidity('')} /></label>
        <label>Sector<select name="sector" required defaultValue=""><option value="" disabled>Select sector</option>{tenderSectors.map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Support needed<select name="support" required defaultValue=""><option value="" disabled>Select support</option>{tenderSupport.map(value => <option key={value}>{value}</option>)}</select></label>
        <label className="lt-tender-form-wide">Opportunity and support details<textarea name="message" required rows={5} maxLength={limits.message} placeholder="Opportunity title or reference, and what you need help with." /></label>
      </div>
      <label className="lt-honeypot" aria-hidden="true">Leave empty<input name="website" tabIndex={-1} autoComplete="off" maxLength={limits.website} /></label>
      <p>Please do not include sensitive personal information, passwords, private access links or confidential documents in this initial form.</p>
      <label className="lt-tender-consent"><input name="consent" type="checkbox" required value="on" /><span>LionTech may contact me about this enquiry. <RouteLink href="/privacy-policy">Privacy Policy</RouteLink>.</span></label>
      {state === 'error' && <p className="lt-tender-error" role="alert">{error}</p>}
      <button className="lt-button lt-button-primary" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending enquiry' : 'Send tender enquiry'}</button>
    </fieldset>
  </form>;
}
