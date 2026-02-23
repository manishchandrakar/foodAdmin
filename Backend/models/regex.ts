// ─── Regex ────────────────────────────────────────────────────────────────────
const PHONE_REGEX = /^\+?[1-9]\d{6,14}$/;
const COUPON_CODE_REGEX = /^[A-Z0-9]{3,20}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
const NAME_REGEX = /^[A-Za-z\s'-]{2,50}$/;