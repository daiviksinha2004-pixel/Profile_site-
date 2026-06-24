import { NextResponse } from "next/server";
import { Resend } from "resend";
import { profile } from "@/data/profile";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { name?: string; email?: string; message?: string; company?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  // Honeypot — bots fill hidden fields; humans don't.
  if (body.company) return NextResponse.json({ ok: true });

  if (name.length < 2 || message.length < 10 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a name, valid email, and a short message." }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: `Mail isn't configured yet — please email ${profile.email} directly.` },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    // `from` must be a Resend-verified domain; onboarding@resend.dev works for sending to your own account email.
    const from = process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>";
    // Delivery inbox. With the test sender this MUST be the Resend account owner's address;
    // once a domain is verified you can drop CONTACT_TO and it falls back to your public email.
    const to = process.env.CONTACT_TO ?? profile.email;
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Portfolio contact — ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    if (error) {
      console.error("Resend send failed:", error);
      return NextResponse.json({ error: "Could not send right now — please email directly." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not send right now — please email directly." }, { status: 502 });
  }
}
