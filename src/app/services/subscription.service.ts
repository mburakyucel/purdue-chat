import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Router } from '@angular/router';

import { Observable, of} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  constructor(
    public afs: AngularFirestore, 
    public authService: AuthService,
    private router: Router
    ) {}

  //Show all groups a user is subscribed too
  getSubscriptions(): Observable<any> {
    return this.authService.user$.pipe(map((doc) => doc.chats));
  }

  //Add a subscription to the user chats array
  addSubscription(chatID: string, userId: string) {
    return this.afs
      .collection('users')
      .doc(userId)
      .update({
        chats: firebase.firestore.FieldValue.arrayUnion(chatID),
      });
  }

  //Remove a subscription from the user chats array
  removeSubscription(chatID: string) {
    return this.afs
      .collection('users')
      .doc(this.authService.getUid())
      .update({
        chats: firebase.firestore.FieldValue.arrayRemove(chatID),
      });
  }

  //Show all available groups
  getGroups(): Observable<any> {
    return this.afs
      .collection('chats', (ref) => ref.where('type', '==', 'group'))
      .valueChanges({ idField: 'id' });
  }

  getSubscribedUsers(chatId: string): Observable<any> {
    return this.afs
      .collection('users', (ref) =>
        ref.where('chats', 'array-contains', chatId)
      )
      .valueChanges();
  }

  //Checks if the user is subscribed to the chat being accessed through the URL
  //INCORRECTLY compares to the previous URL. Not sure why it's lagging behind
  isSubscribed(): Observable<boolean>{
    return this.getSubscriptions().pipe(
      switchMap((subscriptions) => {
        var chatIDStartInd = this.router.url.toString().indexOf("t/");
        var chatIDAccessed = this.router.url.toString().substring(chatIDStartInd+2);
        if (subscriptions.includes(chatIDAccessed) || chatIDAccessed === '') {
          //console.log(chatIDAccessed);
          return of(true);
        } else {
          //console.log(chatIDAccessed);
          return of(false);
        }
      })
    );
  }
}
