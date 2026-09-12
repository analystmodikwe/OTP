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

function getRecentHistory(email: string): { code: string; createdAt: number }[]

function addToHistory(email: string, code: string): void

// for hourly rate limit
function getRequestTimestamps(email: string): number[]  

function recordRequestTimestamp(email: string): void