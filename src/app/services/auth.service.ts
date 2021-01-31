import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    // this.user$ = this.afAuth.authState
  }

  async register(email: string, password: string) {
    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      this.updateUserData(credential.user);
      return of(true);
    } catch (error) {
      console.log(error);
      return throwError('error');
    }
  }

  async login(email: string, password: string) {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      return of(true);
    } catch (error) {
      console.log(error);
      return throwError('error');
    }
  }

  private updateUserData(user: any) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data = {
      uid: user.uid,
      email: user.email
    };

    return userRef.set(data, { merge: true });
  }
}
