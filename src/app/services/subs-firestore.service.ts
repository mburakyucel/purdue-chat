import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Sub } from '../../assets/class';

@Injectable({
  providedIn: 'root',
})
export class SubsFirestoreService {
  subsCollection: AngularFirestoreCollection<Sub>;
  subs: Observable<Sub[]>;
  tempSub: Sub = {};
  subDoc: AngularFirestoreDocument<Sub>;

  constructor(public afs: AngularFirestore) {
    this.subsCollection = this.afs.collection('subs', (ref) =>
      ref.orderBy('CRN', 'asc')
    );

    this.subs = this.subsCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((a) => {
          const data = a.payload.doc.data() as Sub;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );

    this.tempSub.CRN = 10101;
  }

  getSubs() {
    return this.subs;
  }

  addSub(subCRN: number) {
    this.tempSub.CRN = subCRN;
    this.subsCollection.add(this.tempSub);
  }

  rmSub(sub: Sub) {
    this.subDoc = this.afs.doc(`subs/${sub.id}`);
    this.subDoc.delete();
  }
}
