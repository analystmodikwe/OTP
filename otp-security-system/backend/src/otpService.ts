function canRequestOtp(email: string): { allowed: boolean; reason?: string }

// this will loop against history internally
function generateUniqueCode(email: string): string  

// this will ensure whether this is a fresh otp or a resend
function requestOtp(email: string): { code: string; isResend: boolean }

function verifyOtp(email: string, submittedCode: string): { valid: boolean; reason?: string }