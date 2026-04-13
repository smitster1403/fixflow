export function tenantWelcomeEmail({
  tenantName,
  unitLabel,
  propertyName,
  portalUrl,
}: {
  tenantName: string;
  unitLabel: string;
  propertyName: string;
  portalUrl: string;
}) {
  return {
    subject: `Your maintenance portal is ready — ${propertyName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#09090b;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;">
              <span style="font-size:18px;font-weight:600;color:#fafafa;letter-spacing:-0.02em;">FixFlow</span>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background-color:#111113;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:32px;">
              <h1 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#fafafa;">
                Welcome, ${tenantName}!
              </h1>
              <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#a1a1aa;">
                Your landlord has set up a maintenance request portal for your unit. Use it anytime something needs fixing.
              </p>

              <!-- Unit info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#18181b;border-radius:8px;padding:16px;margin-bottom:24px;">
                <tr>
                  <td style="padding:12px 16px;">
                    <p style="margin:0 0 2px;font-size:12px;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.05em;">Your Unit</p>
                    <p style="margin:0;font-size:14px;font-weight:500;color:#fafafa;">${unitLabel} · ${propertyName}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <a href="${portalUrl}" style="display:block;text-align:center;background-color:#6d5ff5;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:8px;margin-bottom:24px;">
                Open Your Portal
              </a>

              <!-- What you can do -->
              <h2 style="margin:0 0 12px;font-size:14px;font-weight:600;color:#fafafa;">What you can do:</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#a1a1aa;">
                    <span style="color:#6d5ff5;margin-right:8px;">✓</span> Submit maintenance requests anytime
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#a1a1aa;">
                    <span style="color:#6d5ff5;margin-right:8px;">✓</span> Track the status of your requests
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#a1a1aa;">
                    <span style="color:#6d5ff5;margin-right:8px;">✓</span> No account or login required
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#a1a1aa;">
                Bookmark the link above — it's your personal portal.
              </p>
              <p style="margin:0;font-size:11px;color:#52525b;">
                Powered by FixFlow
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}
