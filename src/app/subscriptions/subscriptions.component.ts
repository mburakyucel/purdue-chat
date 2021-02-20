import { Component, OnInit } from '@angular/core';

import { Class } from '../../assets/class';
import { SubscriptionService } from '../services/subscription.service';

import { DocumentData } from '@angular/fire/firestore';


@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css'],
})
export class SubListComponent implements OnInit {
  subs: string[];

  constructor(private subService: SubscriptionService) {}

  ngOnInit() {
    this.getSubscriptions();
  }

  getSubscriptions(): void {
    this.subService.getSubscriptions().subscribe((subs) => this.subs = subs);
  }

  removeSubscription(event: any, sub: string) {
    this.subService.removeSubscription(sub);
  }
}
