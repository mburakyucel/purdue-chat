import { Component, OnInit } from '@angular/core';

import { SubscriptionService } from '../services/subscription.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ChatInfoComponent } from '../chat-info/chat-info.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
})
export class GroupsComponent implements OnInit {
  displayedGroups: Array<any> = [];
  allGroups: Array<any> = [];
  searchText = '';
  subscribedGroups: string[] = [];

  constructor(
    private subService: SubscriptionService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subService.getGroups().subscribe((groups) => {
      this.allGroups = groups;
      this.filterDisplayedGroups();
    });
    this.subService.getSubscriptions().subscribe((subs) => {
      this.subscribedGroups = subs;
      this.filterDisplayedGroups();
    });
  }

  onJoin(selectedGroup: any): void {
    this.subService
      .addSubscription(selectedGroup.id, this.authService.getUid())
      .then(() => {
        this._snackBar.open(
          `Subscribed to ${selectedGroup.groupName}`,
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

  filterDisplayedGroups() {
    this.displayedGroups = [];

    for (let item of this.allGroups) {
      if (
        item.groupName.toLowerCase().includes(this.searchText.toLowerCase())
      ) {
        this.displayedGroups.push(item);
      }
    }
  }

  //Triggered when the group name is pressed by user to view its info
  onGroupInfo(selectedGroup: any) {
    let isSubscribed = false;
    if (this.subscribedGroups.includes(selectedGroup.id)) {
      isSubscribed = true;
    }
    this.dialog.open(ChatInfoComponent, {
      data: { selectedGroup: selectedGroup, isSubscribed: isSubscribed },
    });
  }

  unSubscribe(selectedGroup: any) {
    this.subService.removeSubscription(selectedGroup.id);
  }
}
