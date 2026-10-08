# DataFlow NG — Paystack TEST mode

## Deploy (no coding)
1. Unzip `dataflow-paystack.zip` on your computer (or use the folder as is).
2. Go to github.com → New repository → "Add file → Upload files" → drag in ALL files and the `api` and `lib` folders (keep the folder structure) → Commit.
3. Go to vercel.com → Add New → Project → Import your GitHub repo.
   Framework Preset: **Other**. Leave Build/Output settings empty. Do NOT click Deploy yet.
4. Open **Environment Variables** on that screen and add two:
   - Name `PAYSTACK_PUBLIC_KEY`  → paste your `pk_test_...` key
   - Name `PAYSTACK_SECRET_KEY`   → paste your `sk_test_...` key
   (Paste the secret ONLY into Vercel's box. Never into code or chat.)
5. Click **Deploy**.
6. If you add or change a variable later: Project → Settings → Environment Variables, then Deployments → ⋯ → **Redeploy**.

## Test checklist
- Open your Vercel URL → Home → pick network/plan → name + phone → Review → PAY WITH PAYSTACK (TEST).
- Success: Paystack test card 4084 0840 8408 4081, any future expiry, CVV 408, PIN 0000, OTP 123456 → order shows Paid, then data "Sent (Demo)".
- Failure/other outcomes: see Paystack's test cards page for failing cards.
- Close the payment window → order stays Pending → "CHECK PAYMENT STATUS" or "PAY NOW (TEST)".
- Admin page: counts update; table columns unchanged.
- Visit `/api/config` → should show only `pk_test_...`. The secret key must never appear anywhere.

## Notes
- Prices live in two places: `index.html` and `lib/prices.js`. Change both together. The server uses its own prices to check the amount Paystack received.
- Orders are still stored in the browser (this device only), as before. A shared database is needed before going live.
- Data delivery (VTU) is still simulated.
- Only `pk_test_`/`sk_test_` keys are accepted. Going live later needs a small code change on purpose.
- Customers don't enter an email, so a placeholder email is sent to Paystack.
