import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(public afs: AngularFirestore, public authService: AuthService) { }

  getDoc():Observable<any>{
    return this.authService.user$
  }

  changeDisplayName(newDisplayName:string){
    this.afs.collection('users').doc(this.authService.getUid()).update({displayName: newDisplayName})
  }
}
