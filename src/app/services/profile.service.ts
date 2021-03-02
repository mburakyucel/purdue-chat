import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import firebase from '@firebase/app';
import '@firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(public afs: AngularFirestore, public authService: AuthService) {}

  getDoc(): Observable<any> {
    return this.authService.user$;
  }

  changeDisplayName(newDisplayName: string) {
    this.afs
      .collection('users')
      .doc(this.authService.getUid())
      .update({ displayName: newDisplayName });
  }

  async resetPassword(
    email: string,
    old_password: string,
    new_password: string
  ) {
    try {
      let user = firebase.auth().currentUser;
      const cred = firebase.auth.EmailAuthProvider.credential(
        email,
        old_password
      );
      await user.reauthenticateWithCredential(cred).then(() => {
        user
          .updatePassword(new_password)
          .then(function () {})
          .catch(function (error) {
            console.log(error);
            return throwError('error');
          });
      });
      return of(true);
    } catch (error) {
      console.log(error);
      return throwError('error');
    }
  }
}
