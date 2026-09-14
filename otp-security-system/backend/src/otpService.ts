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




function canRequestOtp(email: string): { allowed: boolean; reason?: string }

// this will loop against history internally
function generateUniqueCode(email: string): string  

// this will ensure whether this is a fresh otp or a resend
function requestOtp(email: string): { code: string; isResend: boolean }

function verifyOtp(email: string, submittedCode: string): { valid: boolean; reason?: string }