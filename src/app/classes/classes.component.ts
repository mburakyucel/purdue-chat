import { Component, OnInit } from '@angular/core';

import { Class } from '../../assets/class';
import { SubscriptionService } from '../services/subscription.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css'],
})
export class ClassesComponent implements OnInit {
  allClasses: Class[];
  searchText = '';
  displayedClasses: Class[];
  subscribedClases: string[];

  constructor(
    private subService: SubscriptionService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.subService.getClasses().subscribe((classes) => {
      this.allClasses = classes;
      this.displayedClasses = classes;
    });
    this.subService
      .getSubscriptions()
      .subscribe((subs) => (this.subscribedClases = subs));
  }

  onSelect(selectedClass: Class): void {
    this.subService
      .addSubscription(selectedClass.id)
      .then(() => {
        this._snackBar.open(
          'Subscribed to ' +
            selectedClass.subject +
            ' ' +
            selectedClass.course +
            ' !',
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

  classFilter(): void {
    //Clear serchable class list
    this.displayedClasses = [];

    //Only compare the class name and number
    let name: string;
    for (let item of this.allClasses) {
      name = item.subject + ' ' + item.course;
      if (name.toLowerCase().includes(this.searchText.toLowerCase())) {
        this.displayedClasses.push(item);
      }
    }
  }
}
