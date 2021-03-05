import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {
  public groupImageURL:string = environment.profileImage;
  public groupName = new FormControl('')
  public groupDescription = new FormControl('')

  constructor() { }

  ngOnInit(): void {
  }

  createGroup(){

  }

  selectGroupImage(){

  }

}
