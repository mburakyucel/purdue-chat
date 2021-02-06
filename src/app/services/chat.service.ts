import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService
  ) { }

  getMessages(chatId: string) {
    return this.afs
      .collection<any>('chats')
      .doc(chatId)
      .collection('messages')
      .valueChanges();
  }

  sendMessage(message: string) {
    const uid = this.authService.getUid();
    const chat_id = '8YInfRqTJccFbh8FmlqR';
    const data = {
      uid,
      message,
      createdAt: Date.now()
    };

    const ref = this.afs.collection('chats').doc(chat_id).collection('messages');
    return ref.add(data);
  }
}
