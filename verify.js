// Verifies a Paystack transaction using the SECRET key (server-side only).
const { PRICES } = require("../lib/prices");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(500).json({ error: "Server is not configured: PAYSTACK_SECRET_KEY is missing." });
  if (!secret.startsWith("sk_test_")) return res.status(500).json({ error: "Only Paystack TEST keys (sk_test_...) are allowed right now." });

  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};
  const { reference, network, plan } = b;

  if (typeof reference !== "string" || !/^DFNG-[A-Z0-9]{1,12}(-[A-Z0-9]{1,12})?$/.test(reference))
    return res.status(400).json({ error: "Invalid payment reference." });
  if (!PRICES[network] || PRICES[network][plan] === undefined)
    return res.status(400).json({ error: "Unknown network or plan." });

  const expectedKobo = PRICES[network][plan] * 100;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  let r, j;
  try {
    r = await fetch("https://api.paystack.co/transaction/verify/" + encodeURIComponent(reference), {
      headers: { Authorization: "Bearer " + secret },
      signal: ctrl.signal,
    });
    j = await r.json().catch(() => ({}));
  } catch (e) {
    return res.status(502).json({ error: "Could not reach Paystack. Your order is saved as Pending. Please check again in a moment." });
  } finally {
    clearTimeout(timer);
  }

  if (r.status === 404)
    return res.status(200).json({ payment_status: "Pending", message: "Paystack has no completed payment for this order yet." });
  if (r.status === 401)
    return res.status(502).json({ error: "Paystack rejected the server's key. Check PAYSTACK_SECRET_KEY in Vercel." });
  if (!r.ok || !j || j.status !== true || !j.data)
    return res.status(502).json({ error: "Paystack verification failed" + (j && j.message ? ": " + j.message : ".") + " Order kept as Pending." });

  const d = j.data;
  const ps = String(d.status || "").toLowerCase();

  if (ps === "success") {
    const md = d.metadata && typeof d.metadata === "object" ? d.metadata : null;
    if (d.amount !== expectedKobo || d.currency !== "NGN" || (md && (md.network !== network || md.plan !== plan)))
      return res.status(200).json({ payment_status: "Failed", paystack_status: ps, message: "Payment amount or details did not match this order. Not marked as paid." });
    return res.status(200).json({ payment_status: "Paid", paystack_status: ps, message: "Payment confirmed by Paystack.", paid_at: d.paid_at || null });
  }
  if (ps === "failed" || ps === "reversed")
    return res.status(200).json({ payment_status: "Failed", paystack_status: ps, message: "Paystack reports the payment " + ps + "." });

  // abandoned, pending, ongoing, processing, queued, anything else
  return res.status(200).json({ payment_status: "Pending", paystack_status: ps, message: "Payment is not complete yet (Paystack status: " + ps + ")." });
};
