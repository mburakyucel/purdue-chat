import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public imageURL:string;
  public email:string;
  public displayName:any = new FormControl('');
  public passwordForm: any = new FormGroup({
    old_password: new FormControl(''),
    new_password: new FormControl(''),
    confirm_password: new FormControl(''),
  });

  public toggleOn:any = true;
  public toggleOn_password: any = true;

  constructor(public profileService: ProfileService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.profileService.getDoc().subscribe((doc:any) => {
      this.imageURL = doc.profileImage;
      this.email = doc.email;
      this.displayName.setValue(doc.displayName);
    })
  }

  onImageClick(){
    const imageRef = this.dialog.open(ImageUploadComponent);
    imageRef.afterClosed().subscribe()
  }

  onDisplayNameClick(){
    console.log(this.displayName.value)
    this.profileService.changeDisplayName(this.displayName.value)
    this.toggleOn = true
  }

  onPasswordChange(){
    console.log(this.passwordForm.value.old_password)
    console.log(this.passwordForm.value.new_password)
    console.log(this.passwordForm.value.confirm_password)
  }

  cancelPassword(){
    this.toggleOn_password = true;
  }

  cancelDisplayName(){
    this.toggleOn = true;
  }

  test(){
    console.log(this.imageURL)
    console.log(this.email)
    console.log(this.displayName.value)
  }

}
