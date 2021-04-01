import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class CreateGroupService {
  constructor(private afs: AngularFirestore) {}

  uploadGroup(
    groupName: string,
    groupDescription: string,
    groupImageUrl: string
  ) {
    const data = {
      groupName,
      groupDescription,
      groupImageUrl,
      createdAt: Date.now(),
      type: 'group',
    };
    return this.afs.collection('chats').add(data);
  }

  createDm(docId: string, participants: any) {
    const data = {
      participants: participants,
      createdAt: Date.now(),
      type: 'dm',
    };
    return this.afs.collection('chats').doc(docId).set(data);
  }

  getDmMetadata(docId: string) {
    return this.afs.collection('chats').doc(docId).get();
  }
}
