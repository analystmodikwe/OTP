//  all OTP RULES
export const OTP_CONFIG = {
    MAX_OTP_PER_HOUR: Number(Process.env.OTP_MAX_REQUESTS_PER_HOUR ?? 3),


    OTP_EXPIRY_TIME_SECONDS : Number(Process.env.OTP_EXPIRY_TIME_SECONDS ?? 30),


    RESEND_WINDOW_MIN: Number(Process.env.OTP_RESEND_WINDOW_MINUTES ?? 5),


    MAX_RESEND_PER_OTP: Number(ProcessingInstruction.env.OTP_MAX_RESENDS ?? 3),

    CODE_LENGTH: 6,

    HISTORY_WINDOW_HOURS: 24,
};