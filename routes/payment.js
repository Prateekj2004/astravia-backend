const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const generateReport = require("../nim/reportGenerator");
const { saveReport } = require("../utils/memoryStore");
const { sendReportEmail } = require("../utils/mailer");

const router = express.Router();

const razor = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ---------------------------------------------
   📌 CREATE RAZORPAY ORDER
--------------------------------------------- */
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "amount required" });
    }

    const order = await razor.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "astravia_" + Date.now(),
    });

    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

/* ---------------------------------------------
   📌 FREE REPORT GENERATION (NO PAYMENT)
--------------------------------------------- */
router.post("/free-generate", async (req, res) => {
  try {
    const { identifier, name, dob } = req.body;

    if (!identifier || !name || !dob) {
      return res.status(400).json({
        error: "identifier, name, dob required",
      });
    }

    const report = generateReport(name, dob);
    saveReport(identifier, report);

    // Send email asynchronously (does not block response)
    if (identifier.includes("@")) {
      sendReportEmail(identifier, report).catch((e) =>
        console.error("Email error:", e)
      );
    }

    res.json({
      success: true,
      message: "Free report generated",
      report,
    });
  } catch (err) {
    console.error("❌ Free generate error:", err);
    res.status(500).json({ error: "Internal error" });
  }
});

/* ---------------------------------------------
   📌 VERIFY PAYMENT → GENERATE REPORT
--------------------------------------------- */
router.post("/verify", async (req, res) => {
  try {
    const {
      identifier,
      name,
      dob,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!identifier || !name || !dob) {
      return res.status(400).json({
        error: "identifier, name, dob required",
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        error: "Razorpay order/payment/signature required",
      });
    }

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: "Invalid payment signature",
      });
    }

    // Payment is valid → generate report
    const report = generateReport(name, dob);
    saveReport(identifier, report);

    // Send mail asynchronously
    if (identifier.includes("@")) {
      sendReportEmail(identifier, report).catch((e) =>
        console.error("Email send error:", e)
      );
    }

    res.json({
      success: true,
      message: "Payment verified & report generated",
      report,
    });
  } catch (err) {
    console.error("❌ Payment verify error:", err);
    res.status(500).json({ error: "Verification error" });
  }
});

module.exports = router;
