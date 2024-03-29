import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CroppieOptions } from 'croppie';
import { ImageUploadService } from '../services/image-upload.service';

import {
  ConfirmPasswordMustMatch,
  OldPasswordMustNotMatch,
} from '../shared/match-validation.directive';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public imageURL: string;
  public email: string;
  public subscription: Subscription;
  public displayName: any = new FormControl('', [
    Validators.required,
    Validators.maxLength(32),
  ]);
  public currentDisplayName: any;
  public passwordForm: any = new FormGroup(
    {
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    },
    { validators: [ConfirmPasswordMustMatch, OldPasswordMustNotMatch] }
  );
  public oldPasswordHide = true;
  public newPasswordHide = true;
  public confirmPasswordHide = true;

  public croppieOptions: CroppieOptions = {
    viewport: { width: 100, height: 100, type: 'circle' },
    boundary: { width: 300, height: 300 },
    showZoomer: true,
    enableOrientation: true,
    enableZoom: true,
  };

  public selectEditName = false;
  public selectEditPassword = false;
  public imageUploadDialogRef: MatDialogRef<ImageUploadComponent>;

  constructor(
    public profileService: ProfileService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    public uploadService: ImageUploadService
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe((doc: any) => {
      this.imageURL = doc.profileImage;
      this.email = doc.email;
      this.displayName.setValue(doc.displayName);
      this.currentDisplayName = doc.displayName;
    });
  }

  onImageClick() {
    this.imageUploadDialogRef = this.dialog.open(ImageUploadComponent, {
      maxWidth: '95vw',
      panelClass: 'zero-padding-dialog',
      data: { croppieOptions: this.croppieOptions, isCroppedImage: true },
    });
    this.imageUploadDialogRef.afterClosed().subscribe((imageurl) => {
      if (imageurl) {
        this.uploadService
          .uploadProfileImage(imageurl, this.authService.getUid())
          .then(() => {
            this._snackBar.open('Image uploaded successfully', 'Close', {
              duration: 2000,
            });
          })
          .catch((error) => console.log(error));
      }
    });
  }

  onDisplayNameClick() {
    this.profileService
      .changeDisplayName(this.displayName.value)
      .then(() => {
        this._snackBar.open('Display Name Change Successful', 'Close', {
          duration: 2000,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async onPasswordChange() {
    (
      await this.authService.resetPassword(
        this.email,
        this.passwordForm.value.oldPassword,
        this.passwordForm.value.newPassword
      )
    )
      .pipe(take(1))
      .subscribe(
        () => {
          this._snackBar.open('Password Change Successful', 'Close', {
            duration: 2000,
          });
          this.passwordForm.setValue({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        },
        (error) => {
          console.log(error);
          this._snackBar.open('Incorrect Password', 'Close', {
            duration: 5000,
          });
        }
      );
    this.oldPasswordHide = true;
    this.newPasswordHide = true;
    this.confirmPasswordHide = true;
  }

  cancelPassword() {
    this.oldPasswordHide = true;
    this.newPasswordHide = true;
    this.confirmPasswordHide = true;
    this.passwordForm.setValue({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  }

  cancelDisplayName() {
    this.displayName.setValue(this.currentDisplayName);
  }

  getPasswordErrorMsg() {
    if (this.passwordForm.hasError('match')) {
      return 'Same new and old passwords';
    } else if (this.passwordForm.hasError('noMatch')) {
      return 'New passwords do not match';
    } else if (this.passwordForm.get('newPassword').hasError('minlength')) {
      return 'Enter a 6 or more character password';
    } else return 'An error occurred';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
