//  this file will do nothing at run time its just Shared shapes used across storage and service layers.

// e.g OtpRecord says "here's exactly what fields an OTP has." VerifyOtpResult says "here's exactly what a verify check returns." this is where mistakes are caught like forgetting a field, or misspelling one

export interface OtpRecord {
    code:string;
    createdAt: number;
    firstSentAt: number;
    expiresAt: number;
    used: boolean;
    resendCount: number;
}

export interface HistoryEntry {
    code: string;
    createdAt: number;
}

export interface RequestOtpResult {
    code: string;
    isResend: boolean;
}

export interface VerifyOtpResult {
    valid: boolean;
    reason?: string;
}

export interface CanRequestResult {
  allowed: boolean;
  reason?: string;
}