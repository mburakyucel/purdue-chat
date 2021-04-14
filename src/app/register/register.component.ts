import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RouteService } from '../services/route.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  passwordHide = true;
  loading = false;
  cachedRoute = '';
  registerForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  constructor(
    public authService: AuthService,
    private routeService: RouteService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  async register() {
    this.loading = true;
    (
      await this.authService.register(this.email.value, this.password.value)
    ).subscribe(
      () => {
        this._snackBar.open('Registration successful', 'Close', {
          duration: 2000,
        });
        this.loading = false;
        this.routeService.routeUser();
      },
      (error) => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            this.email.setErrors({ existingUser: true });
            break;
          default:
            this.email.setErrors(null);
            break;
        }
        this.loading = false;
      }
    );
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  getEmailErrorMsg() {
    if (this.email.hasError('required')) {
      return 'Email is required';
    } else if (this.email.hasError('pattern')) {
      return 'Enter a valid email';
    } else if (this.email.hasError('existingUser')) {
      return 'Email address is already in use by another account';
    } else return 'An error occurred';
  }

  getPasswordErrorMsg() {
    if (this.password.hasError('required')) {
      return 'Password is required';
    } else if (this.password.hasError('minlength')) {
      return 'Enter a 6 or more character password';
    } else return 'An error occurred';
  }
}
