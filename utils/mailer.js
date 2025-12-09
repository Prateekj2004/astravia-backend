// utils/mailer.js
const nodemailer = require("nodemailer");

// Create SMTP transporter (Brevo)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // smtp-relay.brevo.com
  port: parseInt(process.env.SMTP_PORT, 10), // 587
  secure: false,                     // MUST be false for port 587
  auth: {
    user: process.env.SMTP_USER,     // 9db260001@smtp-brevo.com
    pass: process.env.SMTP_PASS      // your brevo password
  }
});

// Convert report → HTML
function generateReportHTML(report) {
  return `
    <h2>Your Astravia Numerology Report</h2>
    <p>Your report for <strong>${report.meta.name}</strong> (DOB: ${report.meta.dob}) is ready.</p>

    <h3>Core Numbers</h3>
    <p><strong>Life Path:</strong> ${report.coreNumbers.lifePath.value}</p>
    <p><strong>Destiny:</strong> ${report.coreNumbers.destiny.value}</p>
    <p><strong>Soul Urge:</strong> ${report.coreNumbers.soulUrge.value}</p>
    <p><strong>Personality:</strong> ${report.coreNumbers.personality.value}</p>

    <h3>Summary</h3>
    <p><strong>${report.summary.headline}</strong></p>
    <p>${report.summary.comboSummary}</p>

    <p>You can read the full detailed report anytime in Astravia.</p>
  `;
}

async function sendReportEmail(recipient, report) {
  if (!recipient) return { success: false, error: "Recipient missing" };

  const mailOptions = {
    from: process.env.MAIL_FROM, // "Astravia <9db260001@smtp-brevo.com>"
    to: recipient,
    subject: `Your Astravia Numerology Report – ${report.meta.name}`,
    html: generateReportHTML(report)
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📨 Email sent successfully:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("❌ Email send error:", error);
    return { success: false, error };
  }
}

module.exports = { sendReportEmail };
