import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Class } from '../../assets/class';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private uid: string = '';
  private chats: Array<string> = [];
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

  logout() {
    this.afAuth.signOut();
    this.router.navigate(['login']);
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
      displayName: user.email.split("@")[0],
    };

    return userRef.set(data, { merge: true });
  }
}
