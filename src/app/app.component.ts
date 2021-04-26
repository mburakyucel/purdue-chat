import { Component } from '@angular/core';
import { AppUpdateService } from './services/app-update.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'purdue-chat';
  constructor(public authService: AuthService,
    private swUpdate: AppUpdateService) {}
}
