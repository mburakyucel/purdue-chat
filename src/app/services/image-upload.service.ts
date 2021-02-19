import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
//import * as EventEmitter from 'events';


@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private ref: AngularFireStorageReference;
  private task: AngularFireUploadTask;
  public downloadURL: any;

  constructor(private storage: AngularFireStorage,
    private afs: AngularFirestore) { }

  uploadImage(imageData: string): Observable<any> {
    return new Observable<any>((subscriber) => {
      const randomId = Math.random().toString(36).substring(2);
      this.ref = this.storage.ref(randomId);
      this.task = this.ref.putString(imageData.split(',')[1], 'base64')
      this.task.snapshotChanges().subscribe(
        () => {},
        (err) => subscriber.error(err),
        () => {
          this.ref.getDownloadURL().subscribe(
            (url: any) => subscriber.next(url),
            (err: any) => subscriber.error(err),
            () => subscriber.complete()
          );
        }
      );
    });

    // const randomId = Math.random().toString(36).substring(2);
    // this.ref = this.storage.ref(randomId);
    // this.task = this.ref.putString(imageUrl.split(',')[1], 'base64')


    // return this.task.snapshotChanges().pipe(finalize(() => {
    //   return this.ref.getDownloadURL()
    // }),
    //   switchMap(data => {
    //     console.log(data);
    //     return this.afs.collection('users').doc('DWXPHe1SegckGVBTURwvEQIDb6i1').update({profileImageURL: data});
    //   })
    // )

    // return this.task.snapshotChanges().pipe(finalize(async () => {
    //   return await this.ref.getDownloadURL().toPromise();
    //   // this.ref.getDownloadURL().subscribe(downloadURL => {
    //   //   this.download = downloadURL
    //this.downloadURL.emit(this.downloadURL)
    //download = new EventEmitter
    //   //   console.log(this.download)
    //   // })
    // }),
    //   switchMap(data => {
    //     console.log(data);
    //     return this.afs.collection('users').doc('DWXPHe1SegckGVBTURwvEQIDb6i1').update({profileImageURL: data});
    //   })
    // )

    //this.download = of("help")
    // console.log(this.downloadURL)
    // return this.downloadURL
  }
}
