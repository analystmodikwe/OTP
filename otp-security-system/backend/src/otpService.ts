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
        getRecentHistory(email).map((entry)) => entry.code
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



// this will ensure whether this is a fresh otp or a resend
function requestOtp(email: string): { code: string; isResend: boolean }

function verifyOtp(email: string, submittedCode: string): { valid: boolean; reason?: string }