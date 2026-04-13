import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

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
    await transporter.sendMail({
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
