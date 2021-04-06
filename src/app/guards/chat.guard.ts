import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  UrlTree, 
  Router 
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SubscriptionService } from '../services/subscription.service';

@Injectable({
  providedIn: 'root'
})
export class ChatGuard implements CanActivate {
  constructor(private subService: SubscriptionService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree { 
    var chatId = route.paramMap.get('chatId')
    return this.subService.isSubscribed(chatId).pipe(
      switchMap((isSubscribed) => {
        if(!isSubscribed) return of(this.router.parseUrl('/'));
        return of(true);
      })
    );
  }
  
}
