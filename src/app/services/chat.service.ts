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
      .collection('messages', (ref) => ref.orderBy('createdAt', 'desc'))
      .valueChanges();
  }

  getMessagesWithLimit(chatId: string, limit: number) {
    return this.afs
      .collection<any>('chats')
      .doc(chatId)
      .collection('messages', (ref) =>
        ref.orderBy('createdAt', 'desc').limit(limit)
      )
      .valueChanges();
  }

  sendMessage(message: string, chatId: string, type: string) {
    const uid = this.authService.getUid();
    const data = {
      uid,
      message,
      createdAt: Date.now(),
      type,
    };

    const ref = this.afs.collection('chats').doc(chatId).collection('messages');
    return ref.add(data);
  }

  getChatMetadata(chatId: string): Observable<any> {
    return this.afs
      .collection<any>('chats')
      .doc(chatId)
      .valueChanges({ idField: 'id' });
  }

  /* Not used anywhere, causing a cyclical dependency error
  getChatMetadatas(): Observable<any> {
    return this.subscriptionService.getSubscriptions().pipe(
      switchMap((chatIds: string[]) => {
        return combineLatest(
          chatIds.map((chatID: string) => {
            return this.afs
              .collection<any>('chats')
              .doc(chatID)
              .valueChanges({ idField: 'id' });
          })
        );
      })
    );
  }
  */

  getUser(userId: string) {
    return this.afs.collection('users').doc(userId).valueChanges();
  }
}
