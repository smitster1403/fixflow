import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

let transporter: Transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ error?: string }> {
  try {
    await getTransporter().sendMail({
      from: `FixFlow <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown email error" };
  }
}
