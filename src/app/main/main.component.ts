import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
  windowa: any;
  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef,
  ) {
    this.windowa = window;
  }
  vv: any;
  vHeight: any;
  windowHeight: any;
  ngOnInit(): void {
    this.vv = visualViewport;
    window.visualViewport.addEventListener('resize', (event: any) => {
      console.log(event);
      this.vHeight = event.currentTarget.height;
    });
    window.addEventListener('resize', () => {
      console.log(window.innerHeight);
      this.windowHeight = window.innerHeight;
    });
  }

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

  onResize(event: any) {
    // this.windowa = event;
    // this.vvHeight = visualViewport.height;
    // this.cd.detectChanges();
    console.log(window);
    console.log(visualViewport)
  }

  onResizee() {
    // this.windowa = event;
    // this.cd.detectChanges();
    console.log(window);
  }
}
