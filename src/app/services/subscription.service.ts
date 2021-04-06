import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import firebase from 'firebase/app';

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
    private _snackBar: MatSnackBar
    ) { }

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
  isSubscribed(chatId: any): Observable<boolean>{
    return this.getSubscriptions().pipe(
      switchMap((subscriptions) => {
        if (subscriptions.includes(chatId)) {
          return of(true);
        } else {
          this._snackBar.open('Access Denied', 'Close', {
            duration: 2000,
          });
          return of(false);
        }
      })
    );
  }
}
