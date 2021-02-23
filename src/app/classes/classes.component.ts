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

  constructor(private subService: SubscriptionService) {}

  ngOnInit() {
<<<<<<< HEAD
    this.subService.getClasses().subscribe((classes) => (this.classes = classes));
=======
    this.subService
      .getClasses()
      .subscribe((classes) => (this.classes = classes));
    this.subService.getSubscriptions().subscribe((subs) => (this.subs = subs));
>>>>>>> 8c6c24612c059a121f56867df735414865d09c34
  }

  onSelect(myclass: Class): void {
    this.selectedClass = myclass;
    this.subService.addSubscription(myclass.id);
  }
}
