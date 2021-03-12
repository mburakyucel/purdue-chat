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
  displayedClasses: Class[] = [];
  allClasses: Class[] = [];
  searchText = '';
  subscribedClasses: string[] = [];

  constructor(
    private subService: SubscriptionService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.subService.getClasses().subscribe((classes) => {
      this.allClasses = classes;
      this.filterDisplayedClasses();
    });
    this.subService.getSubscriptions().subscribe((subs) => {
      this.subscribedClasses = subs;
      this.filterDisplayedClasses();
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

  filterDisplayedClasses() {
    this.displayedClasses = [];

    //Only compare the class name and number
    let name: string;
    for (let item of this.allClasses) {
      name = item.subject + ' ' + item.course;
      if (
        name.toLowerCase().includes(this.searchText.toLowerCase()) &&
        !this.subscribedClasses.includes(item.id)
      ) {
        this.displayedClasses.push(item);
      }
    }
  }

  //Triggered when the class name is pressed by user to view its info
  onClassInfo(selectedClass: Class) {
    this.dialog.open(ChatInfoComponent, {
      width: '360px',
      maxWidth: '360px',
      data: selectedClass,
    });
  }
}
