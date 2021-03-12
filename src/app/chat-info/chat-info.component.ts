import { Component, OnInit, Inject } from '@angular/core';

import { Class } from '../../assets/class';
import { SubscriptionService } from '../services/subscription.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.css'],
})
export class ChatInfoComponent implements OnInit {
  subscribed = 0;
  chatMembers: any[] = [];

  constructor(
    private subService: SubscriptionService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public selectedClass: Class
  ) {}

  ngOnInit(): void {
    this.subService.getUsersSubscribedToClass(this.selectedClass).subscribe(userData => this.chatMembers = userData);
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
