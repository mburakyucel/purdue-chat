import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import firebase from 'firebase/app';

import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  constructor(
    public afs: AngularFirestore,
    public authService: AuthService,
    private chatService: ChatService,
    private _snackBar: MatSnackBar
  ) {}

  //Get all group Ids a user is subscribed too
  getSubscriptions(): Observable<string[]> {
    return this.authService.user$.pipe(
      map((doc) => (doc ? Object.keys(doc.chats) : []))
    );
  }

  //Add a subscription to the user chats array
<<<<<<< HEAD
  addSubscription(chatID: string, userId: string) {
=======
  addSubscription(chatId: string, userId: string) {
>>>>>>> main
    return this.afs
      .collection('users')
      .doc(userId)
      .update({
<<<<<<< HEAD
        chats: firebase.firestore.FieldValue.arrayUnion(chatID),
=======
        [`chats.${chatId}`]: Date.now(),
>>>>>>> main
      });
  }

  //Remove a subscription from the user chats array
<<<<<<< HEAD
  removeSubscription(chatID: string) {
=======
  removeSubscription(chatId: string) {
>>>>>>> main
    return this.afs
      .collection('users')
      .doc(this.authService.getUid())
      .update({
<<<<<<< HEAD
        chats: firebase.firestore.FieldValue.arrayRemove(chatID),
=======
        [`chats.${chatId}`]: firebase.firestore.FieldValue.delete(),
>>>>>>> main
      });
  }

  //Show all available groups
  getGroups(): Observable<any> {
    return this.afs
      .collection('chats', (ref) => ref.where('type', '==', 'group'))
      .valueChanges({ idField: 'id' });
  }

  getSubscribedUsers(chatId: string): Observable<any> {
    // User is subscribed if the key is defined
    return this.afs
      .collection('users', (ref) => ref.where(`chats.${chatId}`, '>', 0))
      .valueChanges();
  }

  //Checks if the user is subscribed to the chat being accessed through the URL
  subscriptionCheck(chatId: any): Observable<any> {
    let isSubscribed = false;
    return this.getSubscriptions().pipe(
      tap((subscriptions) => {
        if (subscriptions.includes(chatId)) {
          isSubscribed = true;
        }
      }),
      switchMap(() => this.chatService.getChatMetadata(chatId)),
      switchMap((chat: any) => {
        //Accessing a subscribed group or dm -> do nothing
        if (isSubscribed) {
          return of('subscribed');
        }
        //Accessing an un-subscribed group -> route to chat info
        else if (chat.type === 'group') {
          return of(chat);
        }
        //Accessing an un-subscribed dm -> route to main
        else {
          return of('unsubscribedDM');
        }
      })
    );
  }
}
