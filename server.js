const express = require("express");
const path = require("path");
// const fetch = require("node-fetch"); // no need for this, since in Node 18.20.5 I already have the global fetch API built in!
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(path.join(__dirname, "public"))); // Serve index.html & script.js
app.use(express.json());

// API route
app.post("/api/get-payment-session", async (req, res) => {
  const { amount } = req.body;

  try {
    const sessionReq = {
      amount,
      currency: "EUR",
      billing: {
        address: {
          country: "NL",
        },
      },
      success_url: "https://example.com/success",
      failure_url: "https://example.com/failure",
      processing_channel_id: "pc_w2njpb6jbjjujgcz5dgzxdn5mm",
    };

    const ckoRes = await fetch(
      "https://api.sandbox.checkout.com/payment-sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CKO_SECRET_KEY}`,
        },
        body: JSON.stringify(sessionReq),
      }
    );

    const result = await ckoRes.json();
    res.status(200).json(result);
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/submit-payment-session", async (req, res) => {
  const { amount, session_data, paymentSessionId } = req.body;
  const sessionReq = {
    amount,
    session_data,
  };
  try {
    const ckoRes = await fetch(
      `https://api.sandbox.checkout.com/payment-sessions/${paymentSessionId}/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CKO_SECRET_KEY}`,
        },
        body: JSON.stringify(sessionReq),
      }
    );

    const result = await ckoRes.json();
    res.status(200).json(result);
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
