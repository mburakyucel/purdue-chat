import { Component, OnInit } from '@angular/core';

import { Class } from '../../assets/class';
import { SubscriptionService } from '../services/subscription.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ChatInfoComponent } from '../chat-info/chat-info.component';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css'],
})
export class ClassesComponent implements OnInit {
  displayedGroups: Array<any> = [];
  allGroups: Array<any> = [];
  searchText = '';
  subscribedClasses: string[] = [];

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
      this.subscribedClasses = subs;
      this.filterDisplayedGroups();
    });
  }

  onJoin(selectedClass: Class): void {
    this.subService
      .addSubscription(selectedClass.id)
      .then(() => {
        this._snackBar.open(
          `Subscribed to ${selectedClass.subject} ${selectedClass.course}`,
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
        !this.subscribedClasses.includes(item.id)
      ) {
        this.displayedGroups.push(item);
      }
    }
  }

  //Triggered when the class name is pressed by user to view its info
  onClassInfo(selectedClass: Class) {
    this.dialog.open(ChatInfoComponent, {
      data: selectedClass,
    });
  }
}
