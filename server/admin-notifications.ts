import "server-only";

type NotificationType = "contact" | "demo" | "franchise";

type NotificationData = {
  details?: string | null;
  email?: string | null;
  message?: string | null;
  name?: string | null;
  phone?: string | null;
};

function getEnv(name: string) {
  return process.env[name]?.trim() ?? "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatFieldValue(value: string | null | undefined) {
  return value?.trim() ? value.trim() : "Not provided";
}

function getEmailSubject(type: NotificationType, name: string) {
  const label =
    type === "demo"
      ? "Book Demo"
      : type === "contact"
        ? "Contact"
        : "Franchise";

  return `New ${label} lead from ${name}`;
}

function getResendPayload(type: NotificationType, data: NotificationData) {
  const name = formatFieldValue(data.name);
  const phone = formatFieldValue(data.phone);
  const email = formatFieldValue(data.email);
  const message = formatFieldValue(data.message);
  const details = formatFieldValue(data.details);
  const typeLabel =
    type === "demo" ? "Book Demo" : type === "contact" ? "Contact" : "Franchise";

  return {
    html: `
      <div style="font-family:Arial,sans-serif;background:#fffaf1;padding:24px;color:#10253d;">
        <h1 style="margin:0 0 16px;font-size:24px;">New ${escapeHtml(typeLabel)} lead</h1>
        <table style="width:100%;border-collapse:collapse;background:#ffffff;border:1px solid #efe6d5;border-radius:16px;">
          <tbody>
            <tr><td style="padding:8px 12px 8px 0;font-weight:600;color:#10253d;">Name</td><td style="padding:8px 0;color:#384559;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:8px 12px 8px 0;font-weight:600;color:#10253d;">Phone</td><td style="padding:8px 0;color:#384559;">${escapeHtml(phone)}</td></tr>
            <tr><td style="padding:8px 12px 8px 0;font-weight:600;color:#10253d;">Email</td><td style="padding:8px 0;color:#384559;">${escapeHtml(email)}</td></tr>
            <tr><td style="padding:8px 12px 8px 0;font-weight:600;color:#10253d;">Type</td><td style="padding:8px 0;color:#384559;">${escapeHtml(typeLabel)}</td></tr>
            <tr><td style="padding:8px 12px 8px 0;font-weight:600;color:#10253d;">Message</td><td style="padding:8px 0;color:#384559;">${escapeHtml(message)}</td></tr>
            <tr><td style="padding:8px 12px 8px 0;font-weight:600;color:#10253d;">Details</td><td style="padding:8px 0;color:#384559;">${escapeHtml(details)}</td></tr>
          </tbody>
        </table>
      </div>
    `,
    subject: getEmailSubject(type, name),
    text: [
      `New ${typeLabel} lead`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Type: ${typeLabel}`,
      `Message: ${message}`,
      `Details: ${details}`,
    ].join("\n"),
  };
}

export async function sendAdminNotification(
  type: NotificationType,
  data: NotificationData,
) {
  const apiKey = getEnv("RESEND_API_KEY");
  const adminEmail = getEnv("ADMIN_EMAIL");
  const fromEmail = getEnv("RESEND_FROM_EMAIL") || "onboarding@resend.dev";

  if (!apiKey || !adminEmail) {
    return false;
  }

  const payload = getResendPayload(type, data);
  const response = await fetch("https://api.resend.com/emails", {
    body: JSON.stringify({
      from: fromEmail,
      html: payload.html,
      subject: payload.subject,
      text: payload.text,
      to: [adminEmail],
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Resend notification failed with status ${response.status}`);
  }

  return true;
}
