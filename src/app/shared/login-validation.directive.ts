import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom validators to check that two fields match
export function existingUser(afsUser: boolean): ValidatorFn {
  console.log(afsUser);
  return (control: AbstractControl): {[key: string]: any} | null => {
    return afsUser ? null : {noUser: true};
  };
};

export const correctPassword: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  return control.value.old_password !== control.value.new_password
    ? null
    : { match: true };
};
