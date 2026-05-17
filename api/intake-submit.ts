import { Resend } from "resend";

export const config = { runtime: "edge" };

interface Brief {
  project: string;
  problem: string;
  current_state: string;
  capabilities_required: string[];
  constraints: string | null;
  urgency: string;
  suggested_next_step: string;
}

interface Submission {
  brief: Brief;
  contact: { name: string; email: string; company?: string; role?: string };
  transcript: Array<{ role: string; content: string }>;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  let body: Submission;
  try { body = await req.json(); } catch { return new Response("Invalid JSON", { status: 400 }); }

  if (!body?.brief || !body?.contact?.name || !body?.contact?.email || !isEmail(body.contact.email)) {
    return new Response("Invalid submission", { status: 400 });
  }

  const recipient = process.env.INTAKE_RECIPIENT_EMAIL || "admin@liontechinnovations.co.uk";
  const from = process.env.INTAKE_FROM_EMAIL || "onboarding@resend.dev";
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return new Response("Server misconfigured", { status: 500 });

  const b = body.brief;
  const c = body.contact;
  const subject = `New brief — ${b.project} (${b.urgency})`;

  const html = `
    <h2 style="font-family:system-ui">${escapeHtml(b.project)}</h2>
    <p><strong>From:</strong> ${escapeHtml(c.name)} &lt;${escapeHtml(c.email)}&gt;${c.company ? ` — ${escapeHtml(c.company)}` : ""}${c.role ? `, ${escapeHtml(c.role)}` : ""}</p>
    <p><strong>Urgency:</strong> ${escapeHtml(b.urgency)}</p>
    <p><strong>Suggested next step:</strong> ${escapeHtml(b.suggested_next_step)}</p>
    <h3>Problem</h3><p>${escapeHtml(b.problem)}</p>
    <h3>Current state</h3><p>${escapeHtml(b.current_state)}</p>
    <h3>Capabilities required</h3>
    <ul>${b.capabilities_required.map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul>
    ${b.constraints ? `<h3>Constraints</h3><p>${escapeHtml(b.constraints)}</p>` : ""}
    <hr/>
    <details><summary>Full transcript</summary>
      <pre style="white-space:pre-wrap;font-family:ui-monospace,monospace;font-size:12px">${body.transcript.map(m => `[${m.role}] ${escapeHtml(m.content)}`).join("\n\n")}</pre>
    </details>
  `;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: `LionTech Intake <${from}>`,
    to: recipient,
    replyTo: c.email,
    subject,
    html
  });

  if (error) return new Response("Send failed", { status: 502 });
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
}
