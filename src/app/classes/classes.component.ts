import { Component, OnInit } from '@angular/core';

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
  subs: string[];

  constructor(private subService: SubscriptionService) {}

  ngOnInit() {
    this.subService.getClasses().subscribe((classes) => (this.classes = classes));
    this.subService.getSubscriptions().subscribe((subs) => (this.subs = subs));
  }

  onSelect(myclass: Class): void {
    this.selectedClass = myclass;
    this.subService.addSubscription(myclass.id);
  }

  ngOnDestroy() {
    console.log('onDestroy');
  }
}
