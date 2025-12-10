// utils/mailer.js
require("dotenv").config();
const nodemailer = require("nodemailer");

/* -------------------------------------------
   1) CREATE PRODUCTION GRADE SMTP TRANSPORTER
-------------------------------------------- */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,     // smtp-relay.brevo.com
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,                  // Brevo MUST use false for port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* -------------------------------------------
   2) REUSABLE UNIVERSAL MAIL FUNCTION
-------------------------------------------- */
async function sendEmail({ to, subject, html }) {
  if (!to) {
    return { success: false, error: "Recipient missing" };
  }

  const mailOptions = {
    from: process.env.MAIL_FROM || '"Astravia" <no-reply@astravia.in>',
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📨 Email sent:", info.messageId);
    return { success: true };
  } catch (err) {
    console.error("❌ Mail error:", err);
    return { success: false, error: err };
  }
}

/* -------------------------------------------
   3) REPORT TEMPLATE — Beautiful + Clean
-------------------------------------------- */
function generateReportHTML(report) {
  const { meta, coreNumbers, summary } = report;

  return `
    <div style="font-family: Arial, sans-serif; padding:20px;">
      <h2>Your Astravia Numerology Report</h2>
      <p>Your personalized numerology profile is ready!</p>

      <h3>User Details</h3>
      <p><strong>Name:</strong> ${meta.name}</p>
      <p><strong>Date of Birth:</strong> ${meta.dob}</p>

      <h3>Core Numbers</h3>
      <ul>
        <li><strong>Life Path:</strong> ${coreNumbers.lifePath.value}</li>
        <li><strong>Destiny:</strong> ${coreNumbers.destiny.value}</li>
        <li><strong>Soul Urge:</strong> ${coreNumbers.soulUrge.value}</li>
        <li><strong>Personality:</strong> ${coreNumbers.personality.value}</li>
      </ul>

      <h3>Summary</h3>
      <p><strong>${summary.headline}</strong></p>
      <p>${summary.comboSummary}</p>

      <p>You can access your full detailed report anytime in Astravia.</p>
    </div>
  `;
}

/* -------------------------------------------
   4) FINAL API USED BY YOUR SERVER
-------------------------------------------- */
async function sendReportEmail(recipient, report) {
  const html = generateReportHTML(report);

  return await sendEmail({
    to: recipient,
    subject: `Your Astravia Numerology Report – ${report.meta.name}`,
    html,
  });
}

module.exports = {
  sendEmail,
  sendReportEmail,
};
