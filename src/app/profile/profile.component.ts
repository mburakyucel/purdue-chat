import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public imageURL: string;
  public email: string;
  public subscription: Subscription;
  public displayName: any = new FormControl('');
  public passwordForm: any = new FormGroup({
    old_password: new FormControl(''),
    new_password: new FormControl(''),
    confirm_password: new FormControl(''),
  });

  public toggle: any = true;
  public toggle_password: any = true;

  constructor(
    public profileService: ProfileService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe((doc: any) => {
      this.imageURL = doc.profileImage;
      this.email = doc.email;
      this.displayName.setValue(doc.displayName);
    });
  }

  onImageClick() {
    this.dialog.open(ImageUploadComponent);
  }

  onDisplayNameClick() {
    // TODO: Maybe add a snackbar or something
    this.profileService.changeDisplayName(this.displayName.value).catch((error) => {
      console.log(error);
    })
    this.toggle = true;
  }

  async onPasswordChange() {
    (
      await this.authService.resetPassword(
        this.email,
        this.passwordForm.value.old_password,
        this.passwordForm.value.new_password
      )
    )
      .pipe(take(1))
      .subscribe(
        () => {
          this._snackBar.open('Password Change Successful', 'Close', {
            duration: 2000,
          });
          this.toggle_password = true;
          this.passwordForm.setValue({
            old_password: '',
            new_password: '',
            confirm_password: '',
          });
        },
        (error) => {
          console.log(error);
          this._snackBar.open('Incorrect Password', 'Close', {
            duration: 5000,
          });
        }
      );
  }

  cancelPassword() {
    this.toggle_password = true;
    this.passwordForm.setValue({
      old_password: '',
      new_password: '',
      confirm_password: '',
    });
  }

  cancelDisplayName() {
    this.toggle = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
