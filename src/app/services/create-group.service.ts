import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ɵDomRendererFactory2 } from '@angular/platform-browser';
import { SubscriptionService } from './subscription.service';

@Injectable({
  providedIn: 'root',
})
export class CreateGroupService {
  constructor(private afs: AngularFirestore, private subService: SubscriptionService,) {}

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
      type: "group"
    };
    return this.afs.collection('chats').add(data);
  }

  createDm(docId:string, myId:string, recipientId:string){
    const data = {
      userId1: myId,
      userId2: recipientId,
      createdAt: Date.now(),
      type: "dm",
      dmId: docId,
    }
    return this.afs.collection('chats').add(data)
  }

  queryDm(docId:string, revDocId:string, myId:string, recipientId:string){
    //const dmRef = this.afs.collection('chats').doc(docId)
    //const revDmRef = this.afs.collection('chats').doc(revDocId);


    return this.afs.collection('chats', ref => ref.where('dmId', 'in', [docId, revDocId])).get()
    /*
    dmRef.get().subscribe((dmDoc) => {
      revDmRef.get().subscribe((revDmDoc) => {
        if(!dmDoc.exists && !revDmDoc.exists){
          console.log("It does not exist, created new dm")
          dmRef.set(data)
          this.subService.addSubscription(docId, myId)
          this.subService.addSubscription(docId, recipientId)
        }
      })
    })
    */
  }
}
