import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { DocumentData } from '@angular/fire/firestore';

import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Class } from '../../assets/class';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private selectionSource = new BehaviorSubject('');
  currentSelectedClass = this.selectionSource.asObservable();

  constructor(public afs: AngularFirestore, public authService: AuthService) {}

  //Show all classes a user is subscribed too
  getSubscriptions(): Observable<any> {
    return this.authService.user$.pipe(map((doc) => doc.chats));
  }

  //Add a subscription to the user chats array
  addSubscription(classID: string) {
    return this.afs
      .collection('users')
      .doc(this.authService.getUid())
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

  //Show all available classes
  getClasses(): Observable<any> {
    return this.afs.collection('classes').valueChanges({ idField: 'id' });
  }

  changeSelectedClassInfo(selectedClass: string) {
    this.selectionSource.next(selectedClass);
  }
}
