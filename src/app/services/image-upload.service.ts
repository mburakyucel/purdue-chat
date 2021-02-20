import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private ref: AngularFireStorageReference;
  private task: AngularFireUploadTask;
  public downloadURL: any;

  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore
  ) { }

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
  }

  uploadProfileImage(downloadURL:string, id:string): Observable<any>{
    //console.log(downloadURL)
    return from(this.afs.collection('users').doc(id).update({profileImage: downloadURL}).then(() => {
      console.log("done")
    })
    .catch((error) => {
      console.log("Error in updating user profile image: ", error)
    }))
  }
}
