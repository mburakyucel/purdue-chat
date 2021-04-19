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
    return this.subService.checkSubscription(chatId).pipe(
      switchMap((routing) => {
        console.log(routing);
        //Accessing a subscribed group or dm -> do nothing
        if (routing.accessType === 'subscribed') return of(true);
        //Accessing an un-subscribed dm -> Access denied, route to main
        else if (routing.accessType === 'unsubscribedDM')
          return of(this.router.parseUrl('/'));
        //Accessing an un-subscribed group -> route to chat info
        else {
          const isSubscribed = false;
          this.dialog.open(ChatInfoComponent, {
            data: { chatMetadata: routing.metadata, isSubscribed },
          });
          return of(this.router.parseUrl('/groups'));
        }
      })
    );
  }
}
