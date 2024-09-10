import * as EmailValidator from "email-validator";

export function isEmail(value) {
  return EmailValidator.validate(value);
}

export function isNotEmpty(value) {
  return value.trim() !== "";
}

export function hasMinLength(value, minLength) {
  return value.length >= minLength;
}

export function hasMaxLength(value, maxLength) {
  return value.length <= maxLength;
}
