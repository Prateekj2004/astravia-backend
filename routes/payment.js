const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const generateReport = require('../nim/reportGenerator');
const { saveReport } = require('../utils/memoryStore');
const { sendReportEmail } = require('../utils/mailer');

const router = express.Router();

const razor = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
// body: { amount }
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ error: 'amount required' });
    }

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: 'nim_' + Date.now()
    };

    const order = await razor.orders.create(options);
    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.post("/free-generate", (req, res) => {
  try {
    const { identifier, name, dob } = req.body;

    if (!identifier || !name || !dob) {
      return res.status(400).json({ error: "identifier, name, dob required" });
    }

    const report = generateReport(name, dob);
    saveReport(identifier, report);

    // Optional email
    if (identifier.includes("@")) {
      sendReportEmail(identifier, report);
    }

    res.json({
      success: true,
      message: "Free report generated",
      report
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal error" });
  }
});

// Verify payment + generate/save/email report
// body: { identifier, name, dob, razorpay_order_id, razorpay_payment_id, razorpay_signature }
router.post('/verify', async (req, res) => {
  try {
    const {
      identifier,
      name,
      dob,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!identifier || !name || !dob) {
      return res.status(400).json({ error: 'identifier, name, dob required' });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Razorpay order/payment/signature required' });
    }

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Invalid payment signature' });
    }

    // Payment ok – generate report
    const report = generateReport(name, dob);

    // Save in memory DB for dashboard
    saveReport(identifier, report);

    // Send to email if identifier is email
    try {
      if (identifier.includes('@')) {
        await sendReportEmail(identifier, report);
      } else {
        console.log('Identifier looks like phone, skipped email send.');
      }
    } catch (mailErr) {
      console.error('Error sending email:', mailErr);
    }

    res.json({
      success: true,
      message: 'Payment verified & report generated',
      report
    });
  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ error: 'Verification error' });
  }
});

module.exports = router;
