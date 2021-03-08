import { Component, OnInit, Inject } from '@angular/core';

import { Class } from '../../assets/class';
import { SubscriptionService } from '../services/subscription.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.css'],
})
export class ChatInfoComponent implements OnInit {
  subscribed = 1;
  chatMembersProfilePic: string[] = [];
  chatMembersDisplayName: string[] = [];

  constructor(
    private subService: SubscriptionService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ChatInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedClass: Class
  ) {}

  ngOnInit(): void {
    this.subService.getAllUsersID().forEach((users) => {
      //Go through all chats of all users and check if they are subscribed to this chat
      for (let user of users) {
        this.subService.getUserInfo(user.id).forEach((data) => {
          for (let chat of data.chats) {
            //If they are, add this user to the chatMembers array
            if (chat == this.selectedClass.id) {
              this.chatMembersDisplayName.push(data.displayName);
              this.chatMembersProfilePic.push(data.profileImage);
            }
          }
        });
      }
    });
  }

  onJoinSelectInDialog(): void {
    this.subService
      .addSubscription(this.selectedClass.id)
      .then(() => {
        this._snackBar.open(
          `Subscribed to ${this.selectedClass.subject} ${this.selectedClass.course}`,
          'Close',
          {
            duration: 2000,
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
