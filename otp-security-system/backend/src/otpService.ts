// my routes will call this file

import { OTP_CONFIG } from "./config"

import {
    getActiveOtp,
    setActiveOtp,
    getRecentHistory,
    addToHistory,
    getRequestTimestampsLastHour,
    recordRequestTimestamp,
} from "./otpStore";

import {
  OtpRecord,
  CanRequestResult,
  RequestOtpResult,
  VerifyOtpResult,
} from "./types";

// this is where my 6digit string willbe and the otp will be able to start with zero
function generateCandidateCode(): string {
    const n = Math.floor(Math.random() * 1_000_000);
    return n.toString().padStart(OTP_CONFIG.CODE_LENGTH, "0");
}

// generating the unique code
// this will loop against history internally
function generateUniqueCode(email: string): string {
    const recentCodes = new Set(
        getRecentHistory(email).map((entry) => entry.code
    );

    // loop to regenerating the OTP silently
    let code = generateCandidateCode();
    while (recentCodes.has(code)) {
        code = generateCandidateCode();
    }
    return code;
}

// a function to be able to request another OTP
export function canRequestOtp(email: string): CanRequestResult { 
    const recentRequests = getRequestTimestampsLastHour(email);
    if (recentRequests.length >= OTP_CONFIG.MAX_OTP_PER_HOUR) {
        return { allowed: false, reason: "TOO MANY OTP REQUESTS. TRY AGAIN LATER"}
    }
    return { allowed: true };
 }

// function to check if its eligible to resend
 function isEligibleForResend(record: OtpRecord | undefined): record is OtpRecord {
    if (!record) return false;
    if (record.used) return false;
    if (record.resendCount >= OTP_CONFIG.MAX_RESENDS) return false;

    const winndowMs = OTP_CONFIG.RESEND_WINDOW_MINUTES * 60 * 1000;
    const withinWindow = Date.now() - record.firstSentAt < winndowMs;
    return withinWindow;
 }



// this will ensure whether this is a fresh otp or a resend
export function requestOtp(email: string): RequestOtpResult | { rejected: true; reason: string } {
  const check = canRequestOtp(email);
  if (!check.allowed) {
    return { rejected: true, reason: check.reason! };
  }

   // Every attempt counts toward the hourly limit, resend or not.
  recordRequestTimestamp(email);

  const existing = getActiveOtp(email);

  if (isEligibleForResend(existing)) {
    const updated: OtpRecord = {
      ...existing,
      resendCount: existing.resendCount + 1,
      expiresAt: Date.now() + OTP_CONFIG.EXPIRY_SECONDS * 1000,
      // firstSentAt is intentionally left unchanged
    };
    setActiveOtp(email, updated);
    return { code: updated.code, isResend: true };
  }

  // No eligible existing OTP — generate a fresh one.
  const code = generateUniqueCode(email);
  const now = Date.now();
  const record: OtpRecord = {
    code,
    createdAt: now,
    firstSentAt: now,
    expiresAt: now + OTP_CONFIG.EXPIRY_SECONDS * 1000,
    used: false,
    resendCount: 0,
  };

  setActiveOtp(email, record);
  addToHistory(email, code);

  return { code, isResend: false };
}


// verifyng the OTP
export function verifyOtp(email: string, submittedCode: string): VerifyOtpResult {
  const record = getActiveOtp(email);

  if (!record) {
    return { valid: false, reason: "No OTP found for this email." };
  }
  if (record.used) {
    return { valid: false, reason: "This OTP has already been used." };
  }
  if (Date.now() > record.expiresAt) {
    return { valid: false, reason: "This OTP has expired." };
  }
  if (record.code !== submittedCode) {
    return { valid: false, reason: "Incorrect OTP." };
  }

  // Mark used — "only latest OTP valid" + "cannot be used more than once"
  // are both satisfied since this record IS the latest active one.
  setActiveOtp(email, { ...record, used: true });
  return { valid: true };
}