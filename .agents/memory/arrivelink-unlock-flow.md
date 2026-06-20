---
name: ArriveLink unlock flow
description: Contact unlock is in test mode by default; real Paystack payments need PAYSTACK_SECRET_KEY env var.
---

The unlock flow (`POST /api/unlocks/initiate`) checks for `PAYSTACK_SECRET_KEY`. If not set, it returns `test_mode: true` and the frontend shows a "Simulate Payment (Test Mode)" button instead of a real Paystack checkout link.

**Why:** Allows the MVP to work end-to-end without payment integration configured.

**How to apply:** To enable real payments, add `PAYSTACK_SECRET_KEY` via the environment-secrets skill. The mock-db `initiateUnlock` function handles both modes — check it before modifying the payment flow.
