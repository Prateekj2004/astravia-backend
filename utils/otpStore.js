// Simple in-memory OTP store – replace with Redis/DB in production
const otpMap = new Map(); // key: identifier, value: { otp, expiresAt }

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function setOtp(identifier, otp, ttlMs = 5 * 60 * 1000) {
  const expiresAt = Date.now() + ttlMs;
  otpMap.set(identifier, { otp, expiresAt });
}

function verifyOtp(identifier, otp) {
  const data = otpMap.get(identifier);
  if (!data) return false;
  if (Date.now() > data.expiresAt) {
    otpMap.delete(identifier);
    return false;
  }
  const ok = data.otp === otp;
  if (ok) otpMap.delete(identifier);
  return ok;
}

module.exports = {
  generateOtp,
  setOtp,
  verifyOtp
};
