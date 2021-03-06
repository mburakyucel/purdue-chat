import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../services/subscription.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css'],
})
export class SubscriptionsComponent implements OnInit {
  subs: string[];

  constructor(private subService: SubscriptionService) {}

  ngOnInit() {
    this.subService.getSubscriptions().subscribe((subs) => (this.subs = subs));
  }

  removeSubscription(event: any, sub: string) {
    this.subService.removeSubscription(sub);
  }
}
