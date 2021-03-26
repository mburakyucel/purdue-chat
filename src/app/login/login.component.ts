import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { existingUser, correctPassword } from '../shared/login-validation.directive';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  afsUser = true;
  afsWrongPassword = false;
  passwordHide = true;
  loading = false;
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      existingUser(this.afsUser)
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
    (
      await this.authService.login(this.email.value, this.password.value)
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
            this.afsUser = false;
            break;
          case 'auth/wrong-password': 
            this.afsWrongPassword = false;
            break
          default:
            this.afsUser = true;
            this.afsWrongPassword = true;
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
      this.afsUser = false;
      return 'Email is required';
    }
    else if(this.email.hasError('pattern')) {
      this.afsUser = false;
      return 'Enter a valid email';
    }
    else if(this.email.hasError('noUser')) {
      return 'There is no user record corresponding to this email address'
    }
    else return '';
  }

  getPasswordErrorMsg() {
    if (this.password.hasError('required')) {
      return 'Password is required';
    }
    return this.password.hasError('minlength')
      ? 'Enter a 6 or more character password'
      : '';
  }
}
