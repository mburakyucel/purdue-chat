import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CroppieOptions } from 'croppie';
import { ImageUploadService } from '../services/image-upload.service';

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

  public toggle_displayName: any = true;
  public toggle_password: any = true;
  public croppieOptions: CroppieOptions = {
    viewport: { width: 100, height: 100, type: 'circle' },
    boundary: { width: 300, height: 300 },
    showZoomer: true,
    enableOrientation: true,
    enableZoom: true,
  };

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
    });
  }

  onImageClick() {
    this.imageUploadDialogRef = this.dialog.open(ImageUploadComponent, {data: {croppieOptions: this.croppieOptions}});
    this.imageUploadDialogRef.afterClosed().subscribe(imageurl => {
      if(imageurl){
        this.uploadService.uploadProfileImage(imageurl, this.authService.getUid()).then(() => {
          this._snackBar.open('Image uploaded successfully', 'Close', {
            duration: 2000,
          });
        })
        .catch((error) => console.log(error));
      }
    })
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
    this.toggle_displayName = true;
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
    this.toggle_displayName = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
