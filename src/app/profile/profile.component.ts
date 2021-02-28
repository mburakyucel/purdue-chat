import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private imageURL:string;
  private email:string;
  private displayName:string;

  constructor(public profileService: ProfileService) { }

  ngOnInit(): void {
    this.profileService.getDoc().subscribe((doc:any) => {
      this.imageURL = doc.profileImage;
      this.email = doc.email;
    })
  }

  test(){
    console.log(this.imageURL)
    console.log(this.email)

  }

}
