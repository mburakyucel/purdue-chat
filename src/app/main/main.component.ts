import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { CreateGroupComponent } from '../create-group/create-group.component';
import { ProfileComponent } from '../profile/profile.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  isHandset: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result: any) => result.matches),
      tap(result => (this.isHandset = result)),
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
    if(this.isHandset) {
      this.sidenav.close();
    }
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

  swipeLeft(event: any) {
    if(event.pointerType !== 'mouse') {
      this.sidenav.close()
    }
  }

  swipeRight(event: any) {
    if(event.pointerType !== 'mouse') {
      this.sidenav.open()
    }
  }
}
