import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateGroupService } from '../services/create-group.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { CroppieOptions } from 'croppie';
import { SubscriptionService } from '../services/subscription.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css'],
})
export class CreateGroupComponent implements OnInit {
  public groupImageUrl: string = environment.profileImage;
  public groupName = new FormControl('');
  public groupDescription = new FormControl('');
  public croppieOptions: CroppieOptions = {
    viewport: { width: 100, height: 100, type: 'square' },
    boundary: { width: 300, height: 300 },
    showZoomer: true,
    enableOrientation: true,
    enableZoom: true,
  };
  public imageUploadDialogRef: MatDialogRef<ImageUploadComponent>;

  constructor(
    public groupService: CreateGroupService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public sub: SubscriptionService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {}

  createGroup() {
    this.groupService
      .uploadGroup(
        this.groupName.value,
        this.groupDescription.value,
        this.groupImageUrl
      )
      .then((docRef) => {
        this.sub.addSubscription(docRef.id, this.authService.getUid()).then(() => {
          this._snackBar.open('Group Creation Successful', 'Close', {
            duration: 2000,
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  selectGroupImage() {
    this.imageUploadDialogRef = this.dialog.open(ImageUploadComponent, {
      data: { croppieOptions: this.croppieOptions },
    });
    this.imageUploadDialogRef.afterClosed().subscribe((imageurl: string) => {
      if (imageurl) {
        this.groupImageUrl = imageurl;
      }
    });
  }
}
