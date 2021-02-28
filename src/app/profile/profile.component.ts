import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public imageURL:string;
  private email:string;
  private displayName:string;

  constructor(public profileService: ProfileService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.profileService.getDoc().subscribe((doc:any) => {
      this.imageURL = doc.profileImage;
      this.email = doc.email;
      this.displayName = doc.displayName;
    })
  }

  onImageClick(){
    const imageRef = this.dialog.open(ImageUploadComponent);
    imageRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }

  test(){
    console.log(this.imageURL)
    console.log(this.email)
    console.log(this.displayName)
  }

}
