import type { SeoConfig } from '../lib/seo';

export const SIGNATURE_IMAGE_URL = 'https://liontechinnovations.co.uk/brand/liontech-email-signature-20260815.png';
export const SIGNATURE_DESTINATION_URL = 'https://liontechinnovations.co.uk/contact#snapshot-enquiry';
export const SIGNATURE_HOMEPAGE_URL = 'https://liontechinnovations.co.uk';

export const SIGNATURE_PLAIN_TEXT = `Kind regards,

Freejoy Chimbizi
Founder & CEO
Lion Tech Innovations Ltd
admin@liontechinnovations.co.uk
liontechinnovations.co.uk
+44 7305 824321`;

export const SIGNATURE_HTML = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;color:#263746;">
  <div style="margin:0 0 12px;">Kind regards,</div>
  <div style="font-size:15px;font-weight:700;color:#071426;">Freejoy Chimbizi</div>
  <div>Founder &amp; CEO</div>
  <div style="font-weight:700;color:#071426;">Lion Tech Innovations Ltd</div>
  <div><a href="mailto:admin@liontechinnovations.co.uk" style="color:#8a6a20;text-decoration:none;">admin@liontechinnovations.co.uk</a></div>
  <div><a href="https://liontechinnovations.co.uk" target="_blank" rel="noopener noreferrer" style="color:#8a6a20;text-decoration:none;">liontechinnovations.co.uk</a></div>
  <div><a href="tel:+447305824321" style="color:#8a6a20;text-decoration:none;">+44 7305 824321</a></div>
  <a href="https://liontechinnovations.co.uk/contact#snapshot-enquiry" target="_blank" rel="noopener noreferrer" style="display:block;width:600px;max-width:100%;margin-top:16px;text-decoration:none;">
    <img src="https://liontechinnovations.co.uk/brand/liontech-email-signature-20260815.png" width="600" alt="LionTech Innovations — See what AI says about your business" style="display:block;border:0;outline:none;text-decoration:none;max-width:100%;height:auto;" />
  </a>
</div>`;

export const signatureInstallSeo = {
  title: 'Install the LionTech Gmail Signature',
  description: 'Internal LionTech utility for copying the approved Gmail signature with its linked banner.',
  path: '/email/signature-install',
  robots: 'noindex,follow',
} satisfies SeoConfig;
