import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";

// Load environment variables from .env
dotenv.config();

const app = express();
app.use(express.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
