const express = require('express');
const router = express.Router();
const { generateOtp, setOtp, verifyOtp } = require('../utils/otpStore');

// identifier = email or phone string

router.post('/send-otp', (req, res) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: 'identifier (email/phone) required' });
  }

  const otp = generateOtp();
  setOtp(identifier, otp);

  console.log(`OTP for ${identifier}: ${otp} (send via SMS/email in prod)`);

  res.json({
    success: true,
    message: 'OTP generated. (In demo, check server console.)'
  });
});

router.post('/verify-otp', (req, res) => {
  const { identifier, otp } = req.body;
  if (!identifier || !otp) {
    return res.status(400).json({ error: 'identifier and otp required' });
  }

  const ok = verifyOtp(identifier, otp);
  if (!ok) {
    return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
  }

  res.json({
    success: true,
    message: 'OTP verified successfully',
    identifier // frontend can store this as user id
  });
});

module.exports = router;
