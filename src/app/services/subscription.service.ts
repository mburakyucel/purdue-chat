import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { DocumentData } from '@angular/fire/firestore';

import { Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

import { Class } from '../../assets/class';
import { CLASSES } from '../../assets/mock-classes';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  classesCollection: AngularFirestoreCollection<Class>;
  classes: Observable<Class[]>;
  userDoc: AngularFirestoreDocument<any>;
  subs: Observable<any>;

  constructor(public afs: AngularFirestore, public authService: AuthService) {
    //To obtain the list of classes from database
    this.classesCollection = this.afs.collection('classes', (ref) =>
      ref.orderBy('course', 'asc')
    );
    this.classes = this.classesCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((a) => {
          const data = a.payload.doc.data() as Class;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );

    //To obtain the list of subscriptions from user document
    this.userDoc = this.afs.collection('users').doc(this.authService.getUid());
    this.subs = this.userDoc.valueChanges().pipe(
      map((doc) => {
        return doc.chats;
      })
    );
  }

  //Show all classes a user is subscribed too
  getSubscriptions(): Observable<any> {
    return this.subs;
  }

  //Add a subscription to the user chats array
  addSubscription(classID: string) {
    this.userDoc.update({
      chats: firebase.firestore.FieldValue.arrayUnion(classID),
    });
  }

  //Remove a subscription from the user chats array
  removeSubscription(classID: string) {
    this.userDoc.update({
      chats: firebase.firestore.FieldValue.arrayRemove(classID),
    });
  }

  //Show all available classes
  getClasses(): Observable<Class[]> {
    return this.classes;
  }

  addClassesToDatabase() {
    for (let entry of CLASSES) this.classesCollection.add(entry);
  }
}
