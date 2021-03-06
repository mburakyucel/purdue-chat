import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CreateGroupComponent } from '../create-group/create-group.component';
import { ProfileComponent } from '../profile/profile.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result: any) => result.matches),
      shareReplay()
    );

  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}
  ngOnInit(): void {}

  onChatSelect(chatId: string) {
    this.router.navigate([`/chat/${chatId}`]);
  }

  openProfileDialog() {
    this.dialog.open(ProfileComponent);
  }

  onLogout() {
    this.authService.logout();
  }

  createNewGroup() {
    this.dialog.open(CreateGroupComponent);
  }
}
