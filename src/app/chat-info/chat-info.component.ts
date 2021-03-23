import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';

import { SubscriptionService } from '../services/subscription.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { CreateGroupService } from '../services/create-group.service';

@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.css'],
})
export class ChatInfoComponent implements OnInit {
  chatMembers: any[] = [];
  docDmId:any;
  revDocDmId:any;

  constructor(
    private subService: SubscriptionService,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    public groupService: CreateGroupService,
    @Inject(MAT_DIALOG_DATA) public selectedGroup: any
  ) {}

  ngOnInit(): void {
    this.subService
      .getSubscribedUsers(this.selectedGroup.id)
      .subscribe((userData) => (this.chatMembers = userData));
  }

  onJoin(): void {
    this.subService
      .addSubscription(this.selectedGroup.id, this.authService.getUid())
      .then(() => {
        console.log("testing purpose")
        this._snackBar.open(
          `Subscribed to ${this.selectedGroup.groupName}`,
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

  createDM(user:any){
    const myId = this.authService.getUid()
    this.docDmId = myId.concat(user.uid)
    this.revDocDmId = user.uid.concat(myId)
    console.log(user.uid)
    console.log(this.docDmId)
    this.groupService.createDmChat(this.docDmId,this.revDocDmId, myId, user.uid)
  }
}
