import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';
import { ChatInfoComponent } from '../chat-info/chat-info.component';
import { SubscriptionService } from '../services/subscription.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  passwordHide = true;
  registerForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  loading = false;
  constructor(
    public authService: AuthService,
    private subService: SubscriptionService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

  inviteId: string;
  inviteMetadata: any;
  dialogRef: any;
  ngOnInit(): void {
    this.route.queryParams.subscribe(
      (params) => (this.inviteId = params['inviteId'])
    );

    //Don't fetch data below if you login without an invitation
    if (this.inviteId != null) {
      this.chatService
        .getChatMetadata(this.inviteId)
        .subscribe((chatMetadata) => (this.inviteMetadata = chatMetadata));
    }
  }

  async register() {
    this.loading = true;
    (await this.authService.register(this.email.value, this.password.value))
      .pipe(switchMap(() => this.subService.getSubscriptions()))
      .subscribe(
        (subscriptions) => {
          this._snackBar.open('Login successful', 'Close', {
            duration: 2000,
          });
          this.loading = false;
          //User gets invited to a group they are not subscribed to -> route to chat info dialog
          if (this.inviteId != null && !subscriptions.includes(this.inviteId)) {
            //Prevent multiple dialogs from opening
            if (!this.dialogRef) {
              this.dialogRef = this.dialog.open(ChatInfoComponent, {
                data: this.inviteMetadata,
              });
              this.router.navigate(['/groups']);
            }
          }
          //Register with no invite -> route to main page
          else {
            this.router.navigate(['']);
          }
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
