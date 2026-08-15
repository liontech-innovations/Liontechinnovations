import { Check, ClipboardCopy } from 'lucide-react';
import { useState } from 'react';
import {
  SIGNATURE_HTML,
  SIGNATURE_IMAGE_URL,
  SIGNATURE_PLAIN_TEXT,
  signatureInstallSeo,
} from '../content/emailSignature';
import { useSeo } from '../lib/seo';

type CopyStatus = 'ready' | 'copying' | 'formatted' | 'plain' | 'error';

const copyStatusMessage: Record<CopyStatus, string> = {
  ready: 'Ready to copy.',
  copying: 'Copying the signature...',
  formatted: 'Copied with formatting. Paste it into Gmail Signature settings.',
  plain: 'Formatting was unavailable. The plain-text signature was copied instead.',
  error: 'Clipboard access failed. Check browser permissions and try again.',
};

const signaturePreviewHtml = SIGNATURE_HTML.replace(SIGNATURE_IMAGE_URL, new URL(SIGNATURE_IMAGE_URL).pathname);

export function SignatureInstallPage() {
  useSeo(signatureInstallSeo);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('ready');

  async function copyPlainTextFallback() {
    if (!navigator.clipboard?.writeText) throw new Error('Plain-text clipboard access is unavailable');
    await navigator.clipboard.writeText(SIGNATURE_PLAIN_TEXT);
    setCopyStatus('plain');
  }

  async function copySignature() {
    setCopyStatus('copying');

    try {
      if (typeof ClipboardItem !== 'function' || !navigator.clipboard?.write) {
        await copyPlainTextFallback();
        return;
      }

      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([SIGNATURE_HTML], { type: 'text/html' }),
        'text/plain': new Blob([SIGNATURE_PLAIN_TEXT], { type: 'text/plain' }),
      });
      await navigator.clipboard.write([clipboardItem]);
      setCopyStatus('formatted');
    } catch {
      try {
        await copyPlainTextFallback();
      } catch {
        setCopyStatus('error');
      }
    }
  }

  return (
    <div className="marketing-site lt-signature-site">
      <a className="lt-skip-link" href="#main-content">Skip to content</a>
      <header className="lt-signature-header">
        <a href="/" aria-label="LionTech Innovations home">
          <img src="/assets/liontechlogo.png" alt="LionTech Innovations" />
        </a>
        <span>Internal email utility</span>
      </header>

      <main id="main-content" className="lt-signature-main">
        <div className="lt-signature-intro">
          <p className="lt-eyebrow">GMAIL SIGNATURE INSTALLER</p>
          <h1>Install the approved LionTech signature.</h1>
          <p>Copy the formatted signature once, paste it into Gmail and save. The image and every required link are already configured.</p>
        </div>

        <div className="lt-signature-layout">
          <section className="lt-signature-instructions" aria-labelledby="signature-instructions-title">
            <h2 id="signature-instructions-title">Three actions in Gmail</h2>
            <ol>
              <li><strong>Copy</strong><span>Use the button below to copy the complete formatted signature.</span></li>
              <li><strong>Paste into Gmail Settings → Signature</strong><span>Create or select your signature, then paste into the editor.</span></li>
              <li><strong>Save changes</strong><span>The banner is already linked. No image upload or manual hyperlink is needed.</span></li>
            </ol>
            <button
              type="button"
              className="lt-button lt-button-primary lt-signature-copy-button"
              onClick={copySignature}
              disabled={copyStatus === 'copying'}
            >
              {copyStatus === 'formatted' ? <Check aria-hidden="true" /> : <ClipboardCopy aria-hidden="true" />}
              COPY SIGNATURE FOR GMAIL
            </button>
            <p className={`lt-signature-copy-status is-${copyStatus}`} role="status" aria-live="polite">
              {copyStatusMessage[copyStatus]}
            </p>
          </section>

          <section className="lt-signature-preview-section" aria-labelledby="signature-preview-title">
            <div className="lt-signature-preview-heading">
              <h2 id="signature-preview-title">Signature preview</h2>
              <p>The full banner is clickable and opens the Snapshot enquiry form.</p>
            </div>
            <div className="lt-signature-preview" aria-label="Rendered LionTech email signature preview">
              <div dangerouslySetInnerHTML={{ __html: signaturePreviewHtml }} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
