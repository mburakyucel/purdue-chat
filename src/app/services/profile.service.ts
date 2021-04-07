import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    public afs: AngularFirestore, 
    public authService: AuthService
    ) {}

  changeDisplayName(newDisplayName: string) {
    return this.afs
      .collection('users')
      .doc(this.authService.getUid())
      .update({ displayName: newDisplayName });
  }

  updateLastReadTime(chatId: string) {
    this.afs
    .collection('users')
    .doc(this.authService.getUid())
    .update({ [`chats.${chatId}`]: Date.now() });
  }
}
