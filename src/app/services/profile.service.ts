import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(public afs: AngularFirestore, public authService: AuthService) {}

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

  // Get last read timestamps for each subscription
  getLastReadTimes() {
    return this.authService.user$.pipe(map((doc) => doc.chats));
  }

  // Get last read timestamp for a specific group
  getLastReadTime(chatId: string) {
    return this.authService.user$.pipe(map((doc) => doc.chats[chatId]));
  }
}
