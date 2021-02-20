import { Component, OnInit } from '@angular/core';

import { Class } from '../../assets/class';
import { SubscriptionService } from '../services/subscription.service';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css'],
})
export class ClassColComponent implements OnInit {
  classes: Class[];
  selectedClass: Class;
  subs: string[];

  constructor(
    private subService: SubscriptionService,
  ) {}

  ngOnInit() {
    this.getClasses();
    this.subService.getSubscriptions().subscribe((subs) => this.subs = subs);
  }

  //Method to retrieve the classes from the service
  getClasses(): void {
    this.subService
      .getClasses()
      .subscribe(
        (classes) => {
          this.classes = classes;
          if (this.classes.length == 0) this.subService.addClassesToDatabase();
        });
  }

  onSelect(myclass: Class): void {
    this.selectedClass = myclass;
    if (this.subs.length == 0) this.subService.addSubscription(myclass.id);
    else {
      var chk = 0;
      for (let i = 0; i < this.subs.length; i++) {
        if (this.subs[i] == myclass.id) chk = 1;
      }
      if (chk == 0) this.subService.addSubscription(myclass.id);
    }
  }

  ngOnDestroy() {
    console.log('onDestroy');
  }
}
