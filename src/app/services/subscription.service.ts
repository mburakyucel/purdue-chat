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
