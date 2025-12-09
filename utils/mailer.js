const { Resend } = require("resend");

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Convert report → HTML email
function generateReportHTML(report) {
  return `
    <h2>Your Astravia Numerology Report</h2>
    <p>Hi,</p>
    <p>Your report for <strong>${report.meta.name}</strong> (DOB: ${report.meta.dob}) has been generated.</p>

    <h3>Core Numbers</h3>
    <p><strong>Life Path:</strong> ${report.coreNumbers.lifePath.value}</p>
    <p><strong>Destiny:</strong> ${report.coreNumbers.destiny.value}</p>
    <p><strong>Soul Urge:</strong> ${report.coreNumbers.soulUrge.value}</p>
    <p><strong>Personality:</strong> ${report.coreNumbers.personality.value}</p>

    <h3>Summary</h3>
    <p><strong>${report.summary.headline}</strong></p>
    <p>${report.summary.comboSummary}</p>

    <p>You can read the full detailed report inside Astravia.</p>
  `;
}

async function sendReportEmail(recipient, report) {
  if (!recipient) return { success: false, error: "Recipient missing" };

  const subject = `Your Astravia Numerology Report – ${report.meta.name}`;
  const html = generateReportHTML(report);

  try {
    const response = await resend.emails.send({
      from: process.env.MAIL_FROM || "Astravia <noreply@astravia.com>",
      to: recipient,
      subject,
      html,
    });

    console.log("📨 Email sent:", response);
    return { success: true };
  } catch (error) {
    console.error("❌ Email error:", error);
    return { success: false, error };
  }
}

module.exports = {
  sendReportEmail,
};
