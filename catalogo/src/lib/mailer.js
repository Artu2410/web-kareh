import nodemailer from "nodemailer";

let transporterPromise;

function getMailerConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return {
    host,
    port,
    secure: process.env.SMTP_SECURE !== "false",
    auth: {
      user,
      pass,
    },
    from: process.env.MAIL_FROM || user,
  };
}

export function isMailerConfigured() {
  return Boolean(getMailerConfig());
}

async function getTransporter() {
  const config = getMailerConfig();

  if (!config) {
    throw new Error(
      "SMTP no configurado. Define SMTP_HOST, SMTP_PORT, SMTP_USER y SMTP_PASS."
    );
  }

  if (!transporterPromise) {
    transporterPromise = Promise.resolve(
      nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: config.auth,
      })
    );
  }

  return transporterPromise;
}

export async function sendMail({ to, subject, text, html }) {
  const transporter = await getTransporter();
  const config = getMailerConfig();

  await transporter.sendMail({
    from: config.from,
    to,
    subject,
    text,
    html,
  });
}
