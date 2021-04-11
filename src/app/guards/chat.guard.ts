import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SubscriptionService } from '../services/subscription.service';
import { ChatInfoComponent } from '../chat-info/chat-info.component';

@Injectable({
  providedIn: 'root',
})
export class ChatGuard implements CanActivate {
  constructor(
    private subService: SubscriptionService,
    private router: Router,
    public dialog: MatDialog
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    var chatId = route.paramMap.get('chatId');
    return this.subService.subscriptionCheck(chatId).pipe(
      switchMap((accessType) => {
        //Accessing a subscribed group or dm -> do nothing
        if (accessType === 'subscribed') return of(true);
        //Accessing an un-subscribed dm -> Access denied, route to main
        else if (accessType === "unsubscribedDM") return of(this.router.parseUrl('/'));
        //Accessing an un-subscribed group -> route to chat info
        else {
          this.dialog.open(ChatInfoComponent, {
            data: accessType,
          });
          return of(this.router.parseUrl('/groups'));
        }
      })
    );
  }
}
