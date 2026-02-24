// ─── Regex Patterns ───

export const PHONE_REGEX = /^\+?[1-9]\d{6,14}$/
export const COUPON_CODE_REGEX = /^[A-Z0-9]{3,20}$/
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
export const NAME_REGEX = /^[A-Za-z\s'-]{2,50}$/
export const URL_REGEX = /^https?:\/\/.+/
export const GROWTH_REGEX = /^[+-]\d+%$/