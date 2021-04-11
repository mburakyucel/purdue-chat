import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  passwordHide = true;
  loading = false;
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(
    public authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async login() {
    this.loading = true;
    (await this.authService.login(this.email.value, this.password.value)
    ).subscribe(
      () => {
        this._snackBar.open('Login successful', 'Close', {
          duration: 2000,
        });
        this.loading = false;
        this.router.navigate(['']);
      },
      (error) => {
        switch (error.code) {
          case 'auth/user-not-found':
            this.email.setErrors({ noUser: true });
            break;
          case 'auth/wrong-password':
            this.password.setErrors({ incorrectPassword: true });
            break;
          case 'auth/too-many-requests':
            this.password.setErrors({ toManyIncorrectAttempts: true });
            break;
          default:
            this.email.setErrors(null);
            this.password.setErrors(null);
            break;
          }
        this.loading = false;
        }
      );
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  getEmailErrorMsg() {
    if (this.email.hasError('required')) {
      return 'Email is required';
    } else if (this.email.hasError('pattern')) {
      return 'Enter a valid email';
    } else if (this.email.hasError('noUser')) {
      return 'There is no user record corresponding to this email address';
    } else return 'An error occurred';
  }

  getPasswordErrorMsg() {
    if (this.password.hasError('required')) {
      return 'Password is required';
    } else if (this.password.hasError('minlength')) {
      return 'Enter a 6 or more character password';
    } else if (this.password.hasError('incorrectPassword')) {
      return 'Incorrect Password';
    } else if (this.password.hasError('toManyIncorrectAttempts')) {
      return 'Too many login attempts. Try again later';
    } else return 'An error occurred';
  }
}
