import { Component, OnInit } from '@angular/core';

import { Class, Sub } from '../../assets/class';
import { SubsFirestoreService } from '../services/subs-firestore.service';

@Component({
  selector: 'app-sub-list',
  templateUrl: './sub-list.component.html',
  styleUrls: ['./sub-list.component.css'],
})
export class SubListComponent implements OnInit {
  subs: Sub[];

  constructor(private subService: SubsFirestoreService) {}

  ngOnInit() {
    this.subService.getSubs().subscribe((subs) => {
      this.subs = subs;
    });
  }

  rmSub(event: any, sub: Sub) {
    this.subService.rmSub(sub);
  }
}
