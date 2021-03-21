import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appMustNotMatch]',
  providers: [{provide: NG_VALIDATORS, useExisting: MustNotMatchDirective, multi: true}]
})
export class MustNotMatchDirective implements Validator{
  validate(control: AbstractControl): ValidationErrors {
    return MustNotMatch(control);
  }
}

// Custom validator to check that two fields match
export const MustNotMatch: ValidatorFn = (control: AbstractControl): 
ValidationErrors | null =>{
  return control.value.old_password !== control.value.new_password ? null : {match: true};
};