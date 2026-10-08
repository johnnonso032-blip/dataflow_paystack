// Returns ONLY the public key. The secret key is never exposed here.
module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const pk = process.env.PAYSTACK_PUBLIC_KEY || "";
  if (!pk) return res.status(500).json({ error: "Payments are not configured yet: PAYSTACK_PUBLIC_KEY is missing on the server." });
  if (!pk.startsWith("pk_test_")) return res.status(500).json({ error: "Only Paystack TEST keys (pk_test_...) are allowed right now." });
  res.status(200).json({ publicKey: pk, mode: "test" });
};
