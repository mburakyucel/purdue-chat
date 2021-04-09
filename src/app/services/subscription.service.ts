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

  //Get all group Ids a user is subscribed too
  getSubscriptions(): Observable<string[]> {
    return this.authService.user$.pipe(
      map((doc) => (doc ? Object.keys(doc.chats) : []))
    );
  }

  //Add a subscription to the user chats array
  addSubscription(chatId: string, userId: string) {
    return this.afs
      .collection('users')
      .doc(userId)
      .update({
        [`chats.${chatId}`]: Date.now(),
      });
  }

  //Remove a subscription from the user chats array
  removeSubscription(chatId: string) {
    return this.afs
      .collection('users')
      .doc(this.authService.getUid())
      .update({
        [`chats.${chatId}`]: firebase.firestore.FieldValue.delete(),
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
}
