import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  public imageURL: string;
  public email: string;
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
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.profileService.getDoc().subscribe((doc: any) => {
      this.imageURL = doc.profileImage;
      this.email = doc.email;
      this.displayName.setValue(doc.displayName);
    });
  }

  onImageClick() {
    const imageRef = this.dialog.open(ImageUploadComponent);
    imageRef.afterClosed().subscribe();
  }

  onDisplayNameClick() {
    this.profileService.changeDisplayName(this.displayName.value);
    this.toggle = true;
  }

  async onPasswordChange() {
    if (
      this.passwordForm.value.new_password !=
      this.passwordForm.value.confirm_password
    ) {
      this._snackBar.open('Passwords do not match', 'Close', {
        duration: 5000,
      });
    } else if (this.passwordForm.value.new_password.length < 6) {
      this._snackBar.open(
        'Passwords must be at least 6 characters long',
        'Close',
        {
          duration: 5000,
        }
      );
    } else if (
      this.passwordForm.value.old_password ==
      this.passwordForm.value.new_password
    ) {
      this._snackBar.open('New password cannot be old password', 'Close', {
        duration: 5000,
      });
    }
    else{
      (await this.profileService.resetPassword(this.email, this.passwordForm.value.old_password, this.passwordForm.value.new_password)).subscribe(() => {
        this._snackBar.open('Password Change Successful', 'Close', {
          duration: 2000,
        })
        this.toggle_password = true;
        this.passwordForm.setValue({old_password: '', new_password: '', confirm_password: ''})
      }, 
      (error) => {
        console.log(error);
        this._snackBar.open('Incorrect Password', 'Close', {
          duration: 5000,
        });
      });
    }
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
}
