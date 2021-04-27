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
      tap((result) => (this.isHandset = result)),
      shareReplay()
    );
  contentHeight: number;
  visualViewport: any;
  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.visualViewport = window.visualViewport;
  }
  ngOnInit(): void {
    /* On Firefox, visualViewport is not enabled by default.
     *  This is a hack to determine the height using window innerHeight in case
     *  visualViewport is not enabled
     */
    if (this.visualViewport) {
      window.visualViewport.addEventListener('resize', (event: any) => {
        this.contentHeight = window.visualViewport.height;
        window.scrollTo(0, 0);
      });
    } else {
      window.addEventListener('resize', (event: any) => {
        this.contentHeight = window.innerHeight;
        window.scrollTo(0, 0);
      });
    }
    /* This is a hack to disable elastic scroll bounce delay */
    window.addEventListener('scroll', (e) => {
      e.preventDefault();
      window.scrollTo(0, 0);
    });
  }

  onChatSelect(chatId: string) {
    this.router.navigate([`/chat/${chatId}`]);
    if (this.isHandset) {
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
    if (event.pointerType !== 'mouse') {
      this.sidenav.close();
    }
  }

  swipeRight(event: any) {
    if (event.pointerType !== 'mouse') {
      this.sidenav.open();
    }
  }
}
