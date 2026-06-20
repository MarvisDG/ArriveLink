import { Router, type IRouter } from "express";
import { initiateUnlock, verifyUnlock } from "../lib/mock-db";

const router: IRouter = Router();

router.post("/unlocks/initiate", (req, res) => {
  try {
    const result = initiateUnlock(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Failed to initiate unlock" });
  }
});

router.post("/unlocks/verify", (req, res) => {
  try {
    const result = verifyUnlock(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Verification failed" });
  }
});

export default router;
