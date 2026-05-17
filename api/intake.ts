import OpenAI from "openai";
import { INTAKE_SYSTEM_PROMPT } from "./_lib/system-prompt";

export const config = { runtime: "edge" };

const MAX_TURNS = 12;          // 6 exchanges = 12 messages
const MAX_INPUT_CHARS = 4000;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  let body: { messages: Array<{ role: "user" | "assistant"; content: string }> };
  try { body = await req.json(); } catch { return new Response("Invalid JSON", { status: 400 }); }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0 || messages.length > MAX_TURNS) {
    return new Response("Invalid conversation length", { status: 400 });
  }
  for (const m of messages) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") {
      return new Response("Invalid message shape", { status: 400 });
    }
    if (m.content.length > MAX_INPUT_CHARS) {
      return new Response("Message too long", { status: 413 });
    }
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return new Response("Server misconfigured", { status: 500 });

  const client = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "https://liontechinnovations.co.uk",
      "X-Title": "LionTech Innovations"
    }
  });

  const stream = await client.chat.completions.create({
    model: "anthropic/claude-sonnet-4.6",
    max_tokens: 1024,
    stream: true,
    messages: [
      { role: "system", content: INTAKE_SYSTEM_PROMPT },
      ...messages
    ]
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices?.[0]?.delta?.content;
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    }
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
