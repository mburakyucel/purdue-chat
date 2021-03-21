import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appMustMatch]',
  providers: [{provide: NG_VALIDATORS, useExisting: MustMatchDirective, multi: true}]
})
export class MustMatchDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors {
    return MustMatch(control);
  }
}

// Custom validator to check that two fields match
export const MustMatch: ValidatorFn = (control: AbstractControl): 
ValidationErrors | null =>{
  return control.value.confirm_password === control.value.new_password ? null : {noMatch: true};
};