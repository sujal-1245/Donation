import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";

// Load environment variables from .env
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // needed for PayU POST form callbacks

// ✅ Proper CORS setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL?.split(",") || "*",
    credentials: true,
  })
);

const { PAYU_KEY, PAYU_SALT, PAYU_BASE_URL, FRONTEND_URL } = process.env;

// Generate unique transaction ID
function makeTxnId() {
  return `txn_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
}

// Hash utility
function sha512(str) {
  return crypto.createHash("sha512").update(str).digest("hex");
}

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Create PayU payment payload
app.post("/api/payment", (req, res) => {
  try {
    const { amount, firstname, email, phone, productinfo = "Donation" } =
      req.body || {};

    // Basic validation
    if (!amount || Number(amount) <= 0)
      return res.status(400).json({ error: "Invalid amount" });
    if (!firstname || !email || !phone)
      return res.status(400).json({ error: "Missing donor fields" });

    const txnid = makeTxnId();

    // Hash sequence (with empty UDFs)
    const hashSeq = `${PAYU_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${PAYU_SALT}`;
    const hash = sha512(hashSeq);

    const surl = `${FRONTEND_URL}/success`;
    const furl = `${FRONTEND_URL}/failure`;

    return res.json({
      action: `${PAYU_BASE_URL}/_payment`,
      params: {
        key: PAYU_KEY,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        phone,
        surl,
        furl,
        hash,
        service_provider: "payu_paisa",
      },
    });
  } catch (err) {
    console.error("/api/payment error", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ✅ PayU Response Verification (Success/Failure)
app.post("/api/payment/verify", (req, res) => {
  try {
    const {
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      status,
      hash,
    } = req.body;

    // PayU sends reverse hash format: SALT|status|||||||||||email|firstname|productinfo|amount|txnid|key
    const reverseSeq = `${PAYU_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    const expectedHash = sha512(reverseSeq);

    if (expectedHash !== hash) {
      console.error("❌ Hash mismatch for txn:", txnid);
      return res.status(400).json({ success: false, error: "Invalid hash" });
    }

    // If hash matches & status is success
    if (status === "success") {
      console.log(`✅ Verified successful payment: ${txnid}`);
      return res.json({ success: true, txnid, amount });
    } else {
      console.log(`⚠️ Payment failed: ${txnid}`);
      return res.json({ success: false, txnid, amount });
    }
  } catch (err) {
    console.error("/api/payment/verify error", err);
    return res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
