import { useEffect, useRef, useState } from 'react';
import { zimbabwe, zimbabweCompanySizes, zimbabweDepartments, zimbabweInterests } from '../content/zimbabwe';
import { normalizeWebsiteUrl } from '../lib/normalizeWebsiteUrl.js';
import { RouteLink } from './ui/RouteLink';

const initialValues = { name: '', email: '', company: '', websiteUrl: '', jobTitle: '', department: '', companySize: '', primaryLocation: '', interest: '', context: '', consent: false, website: '' };
type FormState = 'idle' | 'submitting' | 'success' | 'error' | 'website-error';

export function ZimbabweEnquiryForm() {
  const [values, setValues] = useState(initialValues);
  const [state, setState] = useState<FormState>('idle');
  const successRef = useRef<HTMLHeadingElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (state === 'success') successRef.current?.focus();
    if (state === 'website-error') websiteRef.current?.focus();
  }, [state]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'submitting') return;
    const websiteUrl = normalizeWebsiteUrl(values.websiteUrl);
    if (!websiteUrl) { setState('website-error'); return; }
    setState('submitting');
    try {
      const response = await fetch('/api/zimbabwe-enquiry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, websiteUrl }),
      });
      const result = await response.json();
      if (response.ok && result.ok === true) { setValues(initialValues); setState('success'); }
      else setState('error');
    } catch { setState('error'); }
  }

  if (state === 'success') return (
    <div className="lt-form-success" role="status">
      <h2 tabIndex={-1} ref={successRef}>Request received.</h2>
      <p>LionTech will review the business details and reply by email.</p>
      <button type="button" className="lt-button lt-button-secondary" onClick={() => setState('idle')}>Send another request</button>
    </div>
  );

  return (
    <form className="lt-enquiry-form lt-zimbabwe-form" onSubmit={submit} aria-label="Zimbabwe executive review enquiry" aria-busy={state === 'submitting'}>
      <div className="lt-form-sections">
        <fieldset className="lt-form-section">
          <legend>Your details</legend>
          <div className="lt-form-grid">
            <label>Full name<input name="name" required maxLength={100} autoComplete="name" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} /></label>
            <label>Work email<input name="email" type="email" required maxLength={180} autoComplete="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} /></label>
          </div>
        </fieldset>
        <fieldset className="lt-form-section">
          <legend>Company</legend>
          <div className="lt-form-grid">
            <label>Company name<input name="company" required maxLength={160} autoComplete="organization" value={values.company} onChange={(e) => setValues({ ...values, company: e.target.value })} /></label>
            <label>Website/domain<input ref={websiteRef} name="websiteUrl" required type="text" inputMode="url" maxLength={500} autoCapitalize="none" spellCheck={false} placeholder="example.co.zw" aria-invalid={state === 'website-error'} aria-describedby={state === 'website-error' ? 'zw-website-error' : undefined} value={values.websiteUrl} onChange={(e) => { setValues({ ...values, websiteUrl: e.target.value }); if (state === 'website-error') setState('idle'); }} /></label>
            <label>Job title / role<input name="jobTitle" required maxLength={160} autoComplete="organization-title" value={values.jobTitle} onChange={(e) => setValues({ ...values, jobTitle: e.target.value })} /></label>
            <label>Department<select name="department" required value={values.department} onChange={(e) => setValues({ ...values, department: e.target.value })}><option value="" disabled>Select department</option>{zimbabweDepartments.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Company size<select name="companySize" required value={values.companySize} onChange={(e) => setValues({ ...values, companySize: e.target.value })}><option value="" disabled>Select company size</option>{zimbabweCompanySizes.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Primary operating location<input name="primaryLocation" required maxLength={180} autoComplete="address-level2" value={values.primaryLocation} onChange={(e) => setValues({ ...values, primaryLocation: e.target.value })} /></label>
          </div>
        </fieldset>
        <fieldset className="lt-form-section">
          <legend>Your enquiry</legend>
          <div className="lt-form-grid">
            <label className="lt-form-span">Area of interest<select name="interest" required value={values.interest} onChange={(e) => setValues({ ...values, interest: e.target.value })}><option value="" disabled>Select an area of interest</option>{zimbabweInterests.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="lt-form-span">Short context / what would you like us to look at? (optional)<textarea name="context" rows={4} maxLength={2000} aria-describedby="zw-data-warning" value={values.context} onChange={(e) => setValues({ ...values, context: e.target.value })} /></label>
          </div>
          <p id="zw-data-warning" className="lt-zimbabwe-form-note">Do not include passwords, customer records, financial information or other confidential data in this form.</p>
        </fieldset>
        <label className="lt-honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => setValues({ ...values, website: e.target.value })} /></label>
      </div>
      <label className="lt-consent"><input name="consent" required type="checkbox" checked={values.consent} onChange={(e) => setValues({ ...values, consent: e.target.checked })} /><span>I agree that LionTech may use these details to review and respond to this enquiry. <RouteLink href="/privacy-policy">See the Privacy Policy</RouteLink>.</span></label>
      {state === 'website-error' && <p id="zw-website-error" className="lt-form-error" role="alert">Enter a valid website or domain, such as example.co.zw.</p>}
      {state === 'error' && <p className="lt-form-error" role="alert">We could not send the request. Email <a href={`mailto:${zimbabwe.email}`}>{zimbabwe.email}</a> instead.</p>}
      <button className="lt-button lt-button-primary" type="submit" disabled={state === 'submitting'}>{state === 'submitting' ? 'Sending request' : 'Request an Executive Review'}</button>
    </form>
  );
}
