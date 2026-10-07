import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { sendContactEmails } from "@/lib/mail";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(0).optional(), // honeypot: real people leave it empty
});

// Small per-instance rate limit: 5 messages per IP per hour.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ error: "Too many messages. Try again later." }, { status: 429 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check your name, email, and message (10+ characters)." }, { status: 400 });

  const { name, email, message } = parsed.data;
  await db().insert(messages).values({ name, email, message });

  // The message is already saved; an email failure shouldn't lose it.
  try {
    await sendContactEmails({ name, email, message });
  } catch (err) {
    console.error("Email failed:", err);
  }
  return NextResponse.json({ ok: true });
}
