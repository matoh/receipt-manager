import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import * as lodash from 'lodash';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../../../environments/environment';

@Injectable()
export class FileStorageService {

  // public fileWasStored = new Subject<string>();
  public fileWasStored = new Subject<any>();

  constructor() { }

  storeFiles(files: FileList) {
    const filesIndex = lodash.range(files.length);
    lodash.each(filesIndex, (idx) => {
      this.storeFile(files[idx]);
    });
  }

  storeFile(file: File) {
    console.log('Storing file');

    // let progress = 0;
    const storageReference = firebase.storage().ref();
    const fileUploadTask = storageReference.child(`${environment.firebase.fileStorageName}/${file.name}`).put(file);
    // Add the event listener on the firebase storage
    fileUploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      () => {
        // File upload is in the progress
        // progress = (fileUploadTask.snapshot.bytesTransferred / fileUploadTask.snapshot.totalBytes) * 100;
      },
      (error) => {
        // upload failed
        console.log(error);
      },
      () => {
        // File was stored, trigger event with file data
        this.fileWasStored.next({
          'name': file.name,
          'downloadUrl': fileUploadTask.snapshot.downloadURL
        });
      }
    );
  }
}