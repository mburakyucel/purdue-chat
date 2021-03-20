import { Component, OnInit } from '@angular/core';

import { SubscriptionService } from '../services/subscription.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ChatInfoComponent } from '../chat-info/chat-info.component';

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
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.subService.getGroups().subscribe((groups) => {
      console.log(groups);
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
      .addSubscription(selectedGroup.id)
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
        item.groupName.toLowerCase().includes(this.searchText.toLowerCase()) &&
        !this.subscribedGroups.includes(item.id)
      ) {
        this.displayedGroups.push(item);
      }
    }
  }

  //Triggered when the group name is pressed by user to view its info
  onGroupInfo(selectedGroup: any) {
    this.dialog.open(ChatInfoComponent, {
      data: selectedGroup,
    });
  }
}