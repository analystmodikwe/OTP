// shapes for the functions to make it easier to do bodies

function getActiveOtp(email: string): OtpRecord | undefined

function setActiveOtp(email: string, record: OtpRecord): void

function getRecentHistory(email: string): { code: string; createdAt: number }[]

function addToHistory(email: string, code: string): void

// for hourly rate limit
function getRequestTimestamps(email: string): number[]  

function recordRequestTimestamp(email: string): void