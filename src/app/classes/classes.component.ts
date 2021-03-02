import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';

import { Class } from '../../assets/class';
import { SubscriptionService } from '../services/subscription.service';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css'],
})
export class ClassesComponent implements OnInit {
  classes: Class[];
  selectedClass: Class;
  searchText = '';
  classSearch: Class[];
  subs: string[0];

  constructor(private subService: SubscriptionService) {}

  ngOnInit() {
    this.subService.getClasses().subscribe((classes) => {
      (this.classes = classes), (this.classSearch = this.classes);
    });
    this.subService.getSubscriptions().subscribe((subs) => (this.subs = subs));
  }

  onSelect(myclass: Class): void {
    this.selectedClass = myclass;
    this.subService.addSubscription(myclass.id);
  }

  classFilter(): void {
    //Clear serchable class list
    this.classSearch = [];

    //Only compare the class name and number
    let name: string;
    for (let item of this.classes) {
      name = item.subject + ' ' + item.course;
      if (
        name.toLocaleLowerCase().includes(this.searchText) ||
        name.includes(this.searchText)
      ) {
        this.classSearch.push(item);
      }
    }
  }
}
