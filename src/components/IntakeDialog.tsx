import { useEffect, useRef, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import './IntakeDialog.css';

type Message = { role: 'user' | 'assistant'; content: string };
type State = 'idle' | 'streaming' | 'awaiting-user' | 'brief-ready' | 'submitting' | 'submitted' | 'declined' | 'error';

interface Brief {
  project: string;
  problem: string;
  current_state: string;
  capabilities_required: string[];
  constraints: string | null;
  urgency: string;
  suggested_next_step: string;
}

interface Contact {
  name: string;
  email: string;
  company: string;
  role: string;
}

interface ReadyPayload {
  ready: true;
  declined?: boolean;
  reason?: string;
  brief?: Brief;
}

const OPENER = "Welcome to LionTech. What are you building, fixing, or scaling today? Describe it in as much detail as you'd like — I'll structure it into a brief for the engineering team.";
const emptyBrief: Brief = {
  project: '',
  problem: '',
  current_state: '',
  capabilities_required: [],
  constraints: null,
  urgency: 'exploratory',
  suggested_next_step: 'technical scoping',
};
const emptyContact: Contact = { name: '', email: '', company: '', role: '' };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function tryParseReadyPayload(content: string): ReadyPayload | null {
  try {
    const parsed = JSON.parse(content.trim()) as Partial<ReadyPayload>;
    if (parsed?.ready === true) return parsed as ReadyPayload;
  } catch {
    return null;
  }
  return null;
}

function normaliseBrief(brief: Brief): Brief {
  return {
    project: brief.project || '',
    problem: brief.problem || '',
    current_state: brief.current_state || '',
    capabilities_required: Array.isArray(brief.capabilities_required) ? brief.capabilities_required : [],
    constraints: brief.constraints || null,
    urgency: brief.urgency || 'exploratory',
    suggested_next_step: brief.suggested_next_step || 'technical scoping',
  };
}

export default function IntakeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [state, setState] = useState<State>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [brief, setBrief] = useState<Brief>(emptyBrief);
  const [contact, setContact] = useState<Contact>(emptyContact);
  const [emailTouched, setEmailTouched] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  const hasConversation = messages.length > 0 || input.trim().length > 0 || state === 'brief-ready' || state === 'streaming';
  const emailValid = emailPattern.test(contact.email.trim());
  const canSubmit = state !== 'streaming' && input.trim().length > 0;

  useEffect(() => {
    if (!open) return;
    setState((current) => current === 'idle' ? 'awaiting-user' : current);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => textareaRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, streamingText, state]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = '0px';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [input]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll('a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])')
      ) as HTMLElement[];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!open) return null;

  function requestClose() {
    if (state === 'streaming' || hasConversation) {
      const confirmed = window.confirm('Close this intake? Your current conversation will be cleared.');
      if (!confirmed) return;
    }
    setMessages([]);
    setInput('');
    setStreamingText('');
    setBrief(emptyBrief);
    setContact(emptyContact);
    setEmailTouched(false);
    setState('idle');
    onClose();
  }

  async function sendMessage() {
    const content = input.trim();
    if (!content || state === 'streaming') return;

    const newMessages: Message[] = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setInput('');
    setStreamingText('');
    setState('streaming');

    let accumulated = '';
    let isJsonMode: boolean | null = null;
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      if (!res.ok || !res.body) { setState('error'); return; }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        if (isJsonMode === null) {
          const trimmed = accumulated.trimStart();
          if (trimmed.length > 0) isJsonMode = trimmed[0] === '{';
        }
        setStreamingText(isJsonMode === true ? 'Structuring your brief…' : accumulated);
      }
    } catch {
      setStreamingText('');
      setState('error');
      return;
    }

    const readyPayload = tryParseReadyPayload(accumulated);
    setStreamingText('');

    if (isJsonMode === true && !readyPayload) {
      setState('error');
      return;
    }

    if (readyPayload?.declined) {
      setMessages(newMessages);
      setState('declined');
      return;
    }
    if (readyPayload?.brief) {
      setMessages(newMessages);
      setBrief(normaliseBrief(readyPayload.brief));
      setState('brief-ready');
      return;
    }

    setMessages([...newMessages, { role: 'assistant', content: accumulated }]);
    setState('awaiting-user');
    window.setTimeout(() => textareaRef.current?.focus(), 20);
  }

  async function submitBrief() {
    setEmailTouched(true);
    if (!contact.name.trim() || !emailValid || state !== 'brief-ready') return;
    setState('submitting');
    try {
      const res = await fetch('/api/intake-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief,
          contact: {
            name: contact.name.trim(),
            email: contact.email.trim(),
            company: contact.company.trim() || undefined,
            role: contact.role.trim() || undefined,
          },
          transcript: messages,
        }),
      });
      setState(res.ok ? 'submitted' : 'error');
    } catch {
      setState('error');
    }
  }

  function updateBriefField(field: keyof Brief, value: string) {
    setBrief((current) => ({
      ...current,
      [field]: field === 'capabilities_required'
        ? value.split(',').map((item) => item.trim()).filter(Boolean)
        : field === 'constraints'
          ? value || null
          : value,
    }));
  }

  const renderComposer = () => (
    <form
      className="intake-dialog-composer"
      onSubmit={(event) => {
        event.preventDefault();
        void sendMessage();
      }}
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (canSubmit) void sendMessage();
          }
        }}
        disabled={state === 'streaming'}
        placeholder="Type your message"
        rows={1}
      />
      <button type="submit" disabled={!canSubmit}>Send <ArrowRight size={15} /></button>
    </form>
  );

  const renderBriefPreview = () => (
    <div className="intake-dialog-preview">
      <div className="intake-dialog-preview-grid">
        <label>Project<input value={brief.project} onChange={(event) => updateBriefField('project', event.target.value)} /></label>
        <label>Urgency<input value={brief.urgency} onChange={(event) => updateBriefField('urgency', event.target.value)} /></label>
        <label>Problem<textarea value={brief.problem} onChange={(event) => updateBriefField('problem', event.target.value)} /></label>
        <label>Current state<textarea value={brief.current_state} onChange={(event) => updateBriefField('current_state', event.target.value)} /></label>
        <label>Capabilities required<textarea value={brief.capabilities_required.join(', ')} onChange={(event) => updateBriefField('capabilities_required', event.target.value)} /></label>
        <label>Constraints<textarea value={brief.constraints || ''} onChange={(event) => updateBriefField('constraints', event.target.value)} /></label>
        <label>Suggested next step<input value={brief.suggested_next_step} onChange={(event) => updateBriefField('suggested_next_step', event.target.value)} /></label>
        <label>Name<input value={contact.name} onChange={(event) => setContact((current) => ({ ...current, name: event.target.value }))} required /></label>
        <label>Email<input type="email" value={contact.email} onBlur={() => setEmailTouched(true)} onChange={(event) => setContact((current) => ({ ...current, email: event.target.value }))} required /></label>
        <label>Company<input value={contact.company} onChange={(event) => setContact((current) => ({ ...current, company: event.target.value }))} /></label>
        <label>Role<input value={contact.role} onChange={(event) => setContact((current) => ({ ...current, role: event.target.value }))} /></label>
      </div>
      {emailTouched && !emailValid && <p className="intake-dialog-error">Enter a valid email address.</p>}
      <button className="intake-dialog-submit" type="button" onClick={() => void submitBrief()} disabled={state === 'submitting' || !contact.name.trim() || !emailValid}>
        {state === 'submitting' ? 'Submitting' : 'Submit Brief'}
      </button>
    </div>
  );

  return (
    <div className="intake-dialog-overlay">
      <section className="intake-dialog" role="dialog" aria-modal="true" aria-labelledby="intake-dialog-title" ref={dialogRef}>
        <header className="intake-dialog-header">
          <div className="intake-dialog-lockup">
            <img src="/assets/liontechlogo.png" alt="LionTech Innovations" />
            <span id="intake-dialog-title">Submit a Brief</span>
          </div>
          <button type="button" className="intake-dialog-close" aria-label="Close intake" onClick={requestClose}><X size={20} /></button>
        </header>

        {state === 'submitted' ? (
          <div className="intake-dialog-terminal">
            <p>Brief received. A founding engineer will respond within one business day from admin@liontechinnovations.co.uk.</p>
            <button type="button" onClick={requestClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="intake-dialog-thread" ref={threadRef}>
              <div className="intake-dialog-message intake-dialog-message-assistant">
                <span>LionTech</span>
                <p>{OPENER}</p>
              </div>
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`intake-dialog-message intake-dialog-message-${message.role}`}>
                  {message.role === 'assistant' && <span>LionTech</span>}
                  <p>{message.content}</p>
                </div>
              ))}
              {state === 'streaming' && (
                <div className="intake-dialog-message intake-dialog-message-assistant">
                  <span>LionTech <em>...</em></span>
                  <p>{streamingText}</p>
                </div>
              )}
            </div>

            {state === 'brief-ready' && renderBriefPreview()}
            {state === 'declined' && (
              <div className="intake-dialog-terminal">
                <p>This isn't a fit for our current engagement mix. For other enquiries: admin@liontechinnovations.co.uk.</p>
                <button type="button" onClick={requestClose}>Close</button>
              </div>
            )}
            {state === 'error' && (
              <div className="intake-dialog-terminal">
                <p>Connection issue. Email us directly: admin@liontechinnovations.co.uk.</p>
                <a href="mailto:admin@liontechinnovations.co.uk">Email LionTech</a>
              </div>
            )}
            {(state === 'awaiting-user' || state === 'streaming' || state === 'idle') && renderComposer()}
          </>
        )}
      </section>
    </div>
  );
}
