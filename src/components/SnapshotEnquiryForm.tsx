import { useState } from 'react';
import { normalizeWebsiteUrl } from '../lib/normalizeWebsiteUrl.js';
import { RouteLink } from './ui/RouteLink';

type FormState = 'idle' | 'submitting' | 'success' | 'error' | 'website-error';

const initialValues = {
  name: '',
  email: '',
  company: '',
  websiteUrl: '',
  primaryService: '',
  primaryLocation: '',
  competitor: '',
  consent: false,
  website: '',
};

export function SnapshotEnquiryForm() {
  const [values, setValues] = useState(initialValues);
  const [state, setState] = useState<FormState>('idle');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const websiteUrl = normalizeWebsiteUrl(values.websiteUrl);
    if (!websiteUrl) {
      setState('website-error');
      return;
    }

    setState('submitting');

    try {
      const response = await fetch('/api/snapshot-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, websiteUrl }),
      });
      setState(response.ok ? 'success' : 'error');
      if (response.ok) setValues(initialValues);
    } catch {
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div className="lt-form-success" role="status">
        <h2>Request received.</h2>
        <p>LionTech will review the business details and reply by email within one business day.</p>
        <button type="button" className="lt-button lt-button-secondary" onClick={() => setState('idle')}>
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form className="lt-enquiry-form" onSubmit={submit}>
      <div className="lt-form-grid">
        <label>
          Name
          <input name="name" required autoComplete="name" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} />
        </label>
        <label>
          Email
          <input name="email" required type="email" autoComplete="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} />
        </label>
        <label>
          Company
          <input name="company" required autoComplete="organization" value={values.company} onChange={(event) => setValues({ ...values, company: event.target.value })} />
        </label>
        <label>
          Website or domain
          <input name="websiteUrl" required type="text" inputMode="url" placeholder="example.co.uk" value={values.websiteUrl} onChange={(event) => setValues({ ...values, websiteUrl: event.target.value })} />
        </label>
        <label>
          Primary service
          <input name="primaryService" required value={values.primaryService} onChange={(event) => setValues({ ...values, primaryService: event.target.value })} />
        </label>
        <label>
          Primary location
          <input name="primaryLocation" required autoComplete="address-level2" value={values.primaryLocation} onChange={(event) => setValues({ ...values, primaryLocation: event.target.value })} />
        </label>
        <label className="lt-form-span">
          Optional competitor
          <input name="competitor" value={values.competitor} onChange={(event) => setValues({ ...values, competitor: event.target.value })} />
        </label>
        <label className="lt-honeypot" aria-hidden="true">
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => setValues({ ...values, website: event.target.value })} />
        </label>
      </div>

      <label className="lt-consent">
        <input
          name="consent"
          required
          type="checkbox"
          checked={values.consent}
          onChange={(event) => setValues({ ...values, consent: event.target.checked })}
        />
        <span>I agree that LionTech may use these details to respond to this request. <RouteLink href="/privacy-policy">See the Privacy Policy</RouteLink>.</span>
      </label>

      {state === 'error' && (
        <p className="lt-form-error" role="alert">
          We could not send the request. Email contact@liontechinnovations.co.uk instead.
        </p>
      )}

      {state === 'website-error' && (
        <p className="lt-form-error" role="alert">
          Enter a valid website or domain, such as example.co.uk.
        </p>
      )}

      <button className="lt-button lt-button-primary" type="submit" disabled={state === 'submitting'}>
        {state === 'submitting' ? 'Sending request' : 'Request a Founding Snapshot'}
      </button>
    </form>
  );
}
