import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loading = false;
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    public authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async login() {
    if(this.email && this.password) { 
      this.loading = true;
      (
        await this.authService.login(this.email, this.password)
      ).subscribe(
        () => {
          this._snackBar.open('Login successful', 'Close', {
            duration: 2000,
          });
          this.loading = false;
          this.router.navigate(['']);
        },
        (error) => {
          if(error.code == "auth/user-not-found")
          {
            this._snackBar.open('There is no user record corresponding to this email address', 'Close', {
              duration: 3000,
            });
          }
          else if (error.code == "auth/wrong-password") {
            this._snackBar.open('The password is invalid', 'Close', {
              duration: 3000,
            });
          }
          else {
            this._snackBar.open(error.message, 'Close', {
              duration: 3000,
            });
          }
          this.loading = false;
        }
      );
    }
  }

  get email() {
    var mailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.loginForm.get('email').value.match(mailformat)) {
      return this.loginForm.get('email').value
    }
    else {
      this._snackBar.open('The email address is badly formatted', 'Close', {
        duration: 3000,
      });
    }
  }

  get password() {
    if (this.loginForm.get('password').value.length >= 6) {
      return this.loginForm.get('password').value
    }
    else {
      this._snackBar.open('The password is invalid', 'Close', {
        duration: 3000,
      });
    }
  }
}
