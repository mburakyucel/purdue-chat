import { Component, OnInit, Inject } from '@angular/core';

import { SubscriptionService } from '../services/subscription.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.css'],
})
export class ChatInfoComponent implements OnInit {
  chatMembers: any[] = [];

  constructor(
    private subService: SubscriptionService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public selectedGroup: any
  ) {}

  ngOnInit(): void {
    this.subService
      .getSubscribedUsers(this.selectedGroup.id)
      .subscribe((userData) => (this.chatMembers = userData));
  }

  onJoin(): void {
    this.subService
      .addSubscription(this.selectedGroup.id)
      .then(() => {
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
}
