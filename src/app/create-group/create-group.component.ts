import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateGroupService } from '../services/create-group.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {
  public groupImageURL:string = environment.profileImage;
  public groupName = new FormControl('')
  public groupDescription = new FormControl('')

  constructor(public groupService: CreateGroupService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  createGroup(){
    console.log(this.groupDescription.value)
    console.log(this.groupName.value)

    this.groupService.uploadGroup(this.groupName.value, this.groupDescription.value, "test").then(() => {
      this._snackBar.open('Group Creation Successful', 'Close', {
        duration: 2000,
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  selectGroupImage(){

  }
}
