import nodemailer from "nodemailer";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").slice(0, 100);

export async function sendContactEmails(m: { name: string; email: string; message: string }) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return;

  const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });

  await transporter.sendMail({
    from: `"Portfolio" <${user}>`,
    to: user,
    replyTo: m.email,
    subject: `New message from ${oneLine(m.name)}`,
    html: `<p><b>${esc(m.name)}</b> (${esc(m.email)})</p><p style="white-space:pre-wrap">${esc(m.message)}</p>`,
  });

  await transporter.sendMail({
    from: `"Muhammad Ali" <${user}>`,
    to: m.email,
    subject: "Thanks for your message",
    html: `<p>Hi ${esc(oneLine(m.name))},</p><p>Thanks for reaching out. I got your message and will reply within a couple of days.</p><p>Muhammad Ali</p>`,
  });
}
