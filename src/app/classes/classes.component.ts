import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';

import { Class } from '../../assets/class';
import { SubscriptionService } from '../services/subscription.service';

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

  constructor(private subService: SubscriptionService) {}

  ngOnInit() {
    this.subService.getClasses().subscribe((classes) => {
      (this.allClasses = classes)
      (this.displayedClasses = classes)
    });
    this.subService
      .getSubscriptions()
      .subscribe((subs) => (this.subscribedClases = subs));
  }

  onSelect(myclass: Class): void {
    this.subService
      .addSubscription(myclass.id)
      .then(() => {
        console.log('Class added');
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
      if (
        name.toLocaleLowerCase().includes(this.searchText) ||
        name.includes(this.searchText)
      ) {
        this.displayedClasses.push(item);
      }
    }
  }
}
