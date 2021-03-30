import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom validators to check that two fields match
export const ConfirmPasswordMustMatch: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  return control.value.confirmPassword === control.value.newPassword
    ? null
    : { noMatch: true };
};

export const OldPasswordMustNotMatch: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  return control.value.oldPassword !== control.value.newPassword
    ? null
    : { match: true };
};
