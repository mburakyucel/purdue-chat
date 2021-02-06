import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private uid: string = '';
  user$: Observable<any>;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        console.log(user);
        if (user) {
          console.log(user.uid);
          this.uid = user.uid;
          return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
    this.user$.subscribe();
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

  getUid() {
    return this.uid;
  }

  logout() {
    this.afAuth.signOut();
    this.router.navigate(['login']);
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
