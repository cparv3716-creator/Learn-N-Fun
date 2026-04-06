import "server-only";

import nodemailer from "nodemailer";

type NotificationField = {
  label: string;
  value: string | null | undefined;
};

type NotificationPayload = {
  fields: NotificationField[];
  subject: string;
  title: string;
};

const globalForNotifications = globalThis as unknown as {
  adminNotificationTransporter?: ReturnType<typeof nodemailer.createTransport>;
};

function getEnv(name: string) {
  return process.env[name]?.trim() ?? "";
}

function isSecureTransport(port: number) {
  const secure = getEnv("SMTP_SECURE");

  if (secure) {
    return secure === "true";
  }

  return port === 465;
}

function getTransporter() {
  if (globalForNotifications.adminNotificationTransporter) {
    return globalForNotifications.adminNotificationTransporter;
  }

  const host = getEnv("SMTP_HOST");
  const port = Number.parseInt(getEnv("SMTP_PORT") || "587", 10);
  const user = getEnv("SMTP_USER");
  const pass = getEnv("SMTP_PASSWORD");

  if (!host || !port || !user || !pass) {
    return null;
  }

  const transporter = nodemailer.createTransport({
    auth: {
      pass,
      user,
    },
    host,
    port,
    secure: isSecureTransport(port),
  });

  globalForNotifications.adminNotificationTransporter = transporter;
  return transporter;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getAdminDashboardUrl() {
  const baseUrl = getEnv("APP_BASE_URL");

  if (!baseUrl) {
    return null;
  }

  return `${baseUrl.replace(/\/$/, "")}/admin`;
}

function formatFieldValue(value: string | null | undefined) {
  return value?.trim() ? value.trim() : "Not provided";
}

export function areAdminNotificationsConfigured() {
  return Boolean(
    getTransporter() &&
      getEnv("ADMIN_NOTIFICATION_EMAIL") &&
      (getEnv("SMTP_FROM_EMAIL") || getEnv("SMTP_USER")),
  );
}

export async function sendAdminNotification({
  fields,
  subject,
  title,
}: NotificationPayload) {
  const transporter = getTransporter();
  const to = getEnv("ADMIN_NOTIFICATION_EMAIL");
  const fromEmail = getEnv("SMTP_FROM_EMAIL") || getEnv("SMTP_USER");
  const fromName = getEnv("SMTP_FROM_NAME") || "Learn 'N' Fun Abacus";

  if (!transporter || !to || !fromEmail) {
    return false;
  }

  const adminUrl = getAdminDashboardUrl();
  const textLines = fields.map(
    ({ label, value }) => `${label}: ${formatFieldValue(value)}`,
  );
  const htmlLines = fields
    .map(
      ({ label, value }) =>
        `<tr><td style="padding:8px 12px 8px 0;font-weight:600;color:#10253d;vertical-align:top;">${escapeHtml(
          label,
        )}</td><td style="padding:8px 0;color:#384559;">${escapeHtml(
          formatFieldValue(value),
        )}</td></tr>`,
    )
    .join("");

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    html: `
      <div style="font-family:Arial,sans-serif;background:#fffaf1;padding:24px;color:#10253d;">
        <h1 style="margin:0 0 16px;font-size:24px;">${escapeHtml(title)}</h1>
        <table style="width:100%;border-collapse:collapse;background:#ffffff;border:1px solid #efe6d5;border-radius:16px;">
          <tbody>${htmlLines}</tbody>
        </table>
        ${
          adminUrl
            ? `<p style="margin:20px 0 0;"><a href="${escapeHtml(
                adminUrl,
              )}" style="color:#10253d;font-weight:600;">Open admin dashboard</a></p>`
            : ""
        }
      </div>
    `,
    subject,
    text: [
      title,
      "",
      ...textLines,
      adminUrl ? "" : null,
      adminUrl ? `Admin dashboard: ${adminUrl}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
    to,
  });

  return true;
}
