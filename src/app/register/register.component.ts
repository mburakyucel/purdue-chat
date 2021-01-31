import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });
  loading = false;
  constructor(
    public authService: AuthService,
    private router: Router, 
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  async register() {
    this.loading = true;
    (await this.authService.register(this.email.value, this.password.value)).subscribe(
      () => {
        this._snackBar.open('Registration successful', 'Close', {
          duration: 2000,
        });
        this.loading = false;
        this.router.navigate(['login']);
      },
      (error) => {
        console.log(error)
        this.loading = false
      }
    )
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

}
