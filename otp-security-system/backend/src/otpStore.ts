// This is where the the actual data will live instead of a real data base 

// Each email maps to:
//  one active OTP record
//  a history of past codes (for 24h duplicate avoidance)
//  a log of request timestamps (for the hourly rate limit)

import { OtpRecord, HistoryEntry } from "./types";
import { OTP_CONFIG } from "./config";

const activeOtps = new Map<string, OtpRecord>();
const otpHistory = new Map<string, HistoryEntry[]>();
const requestTimestamps = new Map<string, number[]>()

// returning the email with rules from otpRecords
function getActiveOtp(email: string): OtpRecord | undefined {
    return activeOtps.get(email)
}


function setActiveOtp(email: string, record: OtpRecord): void {
    activeOtps.set(email, record);
}

// convets 24 hours to milliseconds 
// give current time in milliseconds anything created befor the cutoff is old to count
// check if email exist or not if not ?? falls back to an empty array
// prune while reading, so that old entries dont accumulate foreverr
// writing the trimmed-down array back into the Map, replacing the old one. So every time i read history, i also quietly cleaning it up
function getRecentHistory(email: string): HistoryEntry[] {
    const windowMs = OTP_CONFIG.HISTORY_WINDOW_HOURS * 60 * 60 * 1000;
    const cutoff = Date.now() - windowMs;
    const entries = otpHistory.get(email) ?? [];
    const fresh = entries.filter((entry) => entry.createdAt >= cutoff);
    otpHistory.set(email, fresh);
    return fresh
}

function addToHistory(email: string, code: string): void {
    const entries = otpHistory.get(email) ?? [];
    entries.push({ code, createdAt: Date.now() });
    otpHistory.set(email, entries);
}

// for hourly rate limit gives the "one hour ago"
function getRequestTimestampsLastHour(email: string): number[] {
    const cutoff = Date.now () - 60 * 60 * 1000;
    const timestamps = requestTimestamps.get(email) ?? [];
    const recent = timestamps.filter((ts) => ts >= cutoff);
    requestTimestamps.set(email, recent);
    return recent;
} 


function recordRequestTimestamp(email: string): void {
    const timestamps = requestTimestamps.get(email) ?? [];
    timestamps.push(Date.now());
    requestTimestamps.set(email, timestamps);
}