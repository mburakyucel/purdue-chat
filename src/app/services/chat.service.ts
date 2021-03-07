import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private afs: AngularFirestore,
    private authService: AuthService
  ) {}

  getMessages(chatId: string) {
    return this.afs
      .collection<any>('chats')
      .doc(chatId)
      .collection('messages')
      .valueChanges();
  }

  sendMessage(message: string, chatId: string) {
    const uid = this.authService.getUid();
    const data = {
      uid,
      message,
      createdAt: Date.now(),
    };

    const ref = this.afs.collection('chats').doc(chatId).collection('messages');
    return ref.add(data);
  }

  getChatMetadatas(): Observable<any> {
    return this.authService.user$.pipe(
      switchMap(userData => {
        const chatMetadatas$: Observable<any>[] = userData.chats.map((chatID: string) => {
          return this.afs.collection<any>('chats').doc(chatID).valueChanges({ idField: 'id' });
        });
        return combineLatest(chatMetadatas$);
      })
    );
  }
}
