import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  inviteId: string;
  ngOnInit(): void {
    this.route.queryParams.subscribe(
      (params) => (this.inviteId = params['inviteId'])
    );
  }
}
