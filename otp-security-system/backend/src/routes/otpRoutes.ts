// backend/src/routes/otpRoutes.ts
import { Router, Request, Response } from "express";
import { requestOtp, verifyOtp } from "../otpService";

const router = Router();

router.post("/send", (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const result = requestOtp(email);

  if ("rejected" in result) {
    return res.status(429).json({ error: result.reason });
  }

  console.log(`OTP for ${email}: ${result.code} (resend: ${result.isResend})`);
  return res.status(200).json({ message: "OTP sent" });
});

router.post("/verify", (req: Request, res: Response) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email and code are required" });
  }

  const result = verifyOtp(email, code);
  return res.status(200).json(result);
});

export default router;