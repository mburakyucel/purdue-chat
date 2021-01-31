import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';

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
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  async register() {
    (await this.authService.register(this.email.value, this.password.value)).subscribe(
      () => {
        console.log("Success");
      },
      (error) => {
        console.log(error)
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
