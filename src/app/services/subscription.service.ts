import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  constructor(public afs: AngularFirestore, public authService: AuthService) {}

  //Show all groups a user is subscribed too
  getSubscriptions(): Observable<any> {
    return this.authService.user$.pipe(map((doc) => doc.chats));
  }

  //Add a subscription to the user chats array
  addSubscription(classID: string, userId: string) {
    return this.afs
      .collection('users')
      .doc(userId)
      .update({
        chats: firebase.firestore.FieldValue.arrayUnion(classID),
      });
  }

  //Remove a subscription from the user chats array
  removeSubscription(classID: string) {
    return this.afs
      .collection('users')
      .doc(this.authService.getUid())
      .update({
        chats: firebase.firestore.FieldValue.arrayRemove(classID),
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

  getDmRecipient(myId: string, users: any) {
    const recipiantID = users[users.indexOf(myId) ^ 1];

    return this.afs.collection('users').doc(recipiantID).valueChanges();
  }
}
