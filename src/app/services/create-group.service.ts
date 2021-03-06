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
    groupImageURL: string
  ) {
    const data = {
      groupName: groupName,
      groupDescription: groupDescription,
      groupImageURL: groupImageURL,
      createdAt: Date.now(),
    };
    return this.afs.collection('chats').add(data);
  }
}
