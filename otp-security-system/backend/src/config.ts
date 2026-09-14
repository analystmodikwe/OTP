//  all OTP RULES that holds rate limit, expiry time, resend window, max resends

export const OTP_CONFIG = {
  MAX_OTP_PER_HOUR: Number(process.env.OTP_MAX_REQUESTS_PER_HOUR ?? 3),

  EXPIRY_SECONDS: Number(process.env.OTP_EXPIRY_TIME_SECONDS ?? 30),

  RESEND_WINDOW_MINUTES: Number(process.env.OTP_RESEND_WINDOW_MINUTES ?? 5),

  MAX_RESENDS: Number(process.env.OTP_MAX_RESENDS ?? 3),
  CODE_LENGTH: 6,
  
  HISTORY_WINDOW_HOURS: 24,
};