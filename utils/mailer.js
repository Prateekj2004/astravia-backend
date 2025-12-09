const nodemailer = require('nodemailer');

let transporter = null;

// Create transporter if SMTP config present
if (
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS
) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
} else {
  console.log('Mailer: SMTP config not set – emails will be logged only.');
}

/**
 * Send report email (simple HTML)
 * recipient = user email (identifier)
 */
async function sendReportEmail(recipient, report) {
  if (!recipient) return;

  const subject = `Your NIM Numerology Report – ${report.meta.name}`;
  const html = `
    <h2>Your NIM Numerology Report</h2>
    <p>Hi,</p>
    <p>Your report for <strong>${report.meta.name}</strong> (DOB: ${
    report.meta.dob
  }) has been generated.</p>
    <p><strong>Life Path:</strong> ${report.coreNumbers.lifePath.value}</p>
    <p><strong>Destiny:</strong> ${report.coreNumbers.destiny.value}</p>
    <p><strong>Soul Urge:</strong> ${report.coreNumbers.soulUrge.value}</p>
    <p><strong>Personality:</strong> ${report.coreNumbers.personality.value}</p>
    <p>${report.summary.headline}</p>
    <p>${report.summary.comboSummary}</p>
    <p>You can also view this report inside the app.</p>
  `;

  if (!transporter) {
    console.log('EMAIL (mock): To:', recipient, 'Subject:', subject);
    return;
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: recipient,
    subject,
    html
  });
}

module.exports = {
  sendReportEmail
};
