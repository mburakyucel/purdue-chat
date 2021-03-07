import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import firebase from '@firebase/app';
import '@firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private uid: string = '';
  private chats: Array<Object> = [];
  user$: Observable<any>;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        console.log(user);
        if (user) {
          this.uid = user.uid;
          return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async register(email: string, password: string) {
    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
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

  getUid() {
    return this.uid;
  }

  isSignedIn(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return of(true);
        } else {
          return of(false);
        }
      })
    );
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  private updateUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const data = {
      chats: this.chats,
      uid: user.uid,
      email: user.email,
      profileImage: environment.firebase.profileImage,
      displayName: user.email.split('@')[0],
    };

    return userRef.set(data, { merge: true });
  }

  async resetPassword(
    email: string,
    old_password: string,
    new_password: string
  ) {
    try {
      const user = firebase.auth().currentUser;
      const cred = firebase.auth.EmailAuthProvider.credential(
        email,
        old_password
      );
      await user.reauthenticateWithCredential(cred);
      await user.updatePassword(new_password);
      return of(true);
    } catch (error) {
      console.log(error);
      return throwError('error');
    }
  }
}
