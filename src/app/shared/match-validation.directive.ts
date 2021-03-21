import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom validators to check that two fields match
export const MustMatch: ValidatorFn = (control: AbstractControl): 
ValidationErrors | null =>{
  return control.value.confirm_password === control.value.new_password ? null : {noMatch: true};
};

export const MustNotMatch: ValidatorFn = (control: AbstractControl): 
ValidationErrors | null =>{
  return control.value.old_password !== control.value.new_password ? null : {match: true};
};