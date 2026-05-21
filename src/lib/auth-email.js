import { buildAppUrl } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendVerificationEmail({ email, name, token }) {
  const verificationUrl = buildAppUrl(`/api/auth/verify-email?token=${token}`);
  const safeName = escapeHtml(name || email);

  await sendMail({
    to: email,
    subject: "Valida tu cuenta de KAREH",
    text: [
      `Hola ${name || email},`,
      "",
      "Recibimos tu registro en KAREH.",
      "Haz clic en este enlace para validar tu correo y activar tu cuenta:",
      verificationUrl,
      "",
      "Si no creaste esta cuenta, ignora este mensaje.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2>Valida tu cuenta</h2>
        <p>Hola ${safeName},</p>
        <p>Recibimos tu registro en KAREH. Para activar tu cuenta, valida tu correo desde este enlace:</p>
        <p>
          <a href="${verificationUrl}" style="display:inline-block;padding:12px 18px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;">
            Validar cuenta
          </a>
        </p>
        <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
        <p>${verificationUrl}</p>
        <p>Si no creaste esta cuenta, ignora este mensaje.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail({ email, name, token }) {
  const resetUrl = buildAppUrl(`/restablecer-contrasena?token=${token}`);
  const safeName = escapeHtml(name || email);

  await sendMail({
    to: email,
    subject: "Restablece tu contraseña de KAREH",
    text: [
      `Hola ${name || email},`,
      "",
      "Recibimos una solicitud para cambiar tu contraseña.",
      "Usa este enlace para crear una nueva contraseña:",
      resetUrl,
      "",
      "Si no hiciste esta solicitud, ignora este mensaje.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2>Restablece tu contraseña</h2>
        <p>Hola ${safeName},</p>
        <p>Recibimos una solicitud para cambiar tu contraseña. Usa este enlace para crear una nueva:</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;">
            Crear nueva contraseña
          </a>
        </p>
        <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
        <p>${resetUrl}</p>
        <p>Si no hiciste esta solicitud, ignora este mensaje.</p>
      </div>
    `,
  });
}
