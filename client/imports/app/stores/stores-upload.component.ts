import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { upload } from '../../../../both/methods/images.methods';
import { Subject, Subscription, Observable } from "rxjs";
import { MeteorObservable } from "meteor-rxjs";


import { MaterializeModule, MaterializeAction } from 'angular2-materialize';

import { Thumb } from "../../../../both/models/image.model";
import { Thumbs } from "../../../../both/collections/images.collection";

import template from './stores-upload.component.html';
import style from './stores-upload.component.scss';


@Component({
  selector: 'stores-upload',
  template,
  styles: [style]
})
export class StoresUploadComponent {
  fileIsOver: boolean = false;
  uploading: boolean = false;
  maxInputFiles: number = 3;
  filesArray: string[] = [];
  files: Subject<string[]> = new Subject<string[]>();
  thumbs: Observable<Thumb[]>;
  thumbsSubscription: Subscription;
  globalActions = new EventEmitter<string | MaterializeAction>();
  @Output() onFile: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    this.files.subscribe((filesArray) => {
      MeteorObservable.autorun().subscribe(() => {
        if (this.thumbsSubscription) {
          this.thumbsSubscription.unsubscribe();
          this.thumbsSubscription = undefined;
        }

        this.thumbsSubscription = MeteorObservable.subscribe("thumbs", filesArray).subscribe(() => {
          this.thumbs = Thumbs.find({
            originalStore: 'images',
            originalId: {
              $in: filesArray
            }
          }).zone();
        });
      });
    });
  }
  fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }

  onFileDrop(file: File): void {
    this.uploading = true;
    upload(file)
      .then((result) => {
        this.uploading = false;
        this.addFile(result);
      })
      .catch((error) => {
        this.uploading = false;
        console.log(`Something went wrong!`, error);
      });
  }

  addFile(file) {
    if (this.filesArray.length >= this.maxInputFiles) {
      this.globalActions.emit('toast');
      return;
    }
    this.filesArray.push(file._id);
    this.files.next(this.filesArray);
    this.onFile.emit(file._id);
  }

  onFileAdd() {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    this.OnFileAddList(files);

  }
  OnFileAddList(files: FileList) {
    if (!(files === undefined) && !(files[0] === undefined)) {
      for (let i = 0; i < files.length; i++) {
        this.onFileDrop(files[i]);
      }
      event = null;
    }
  }
  reset() {
    this.filesArray = [];
    this.files.next(this.filesArray);
  }

  setFileArray(filesArray: string[]) {
    this.filesArray = filesArray;
    this.files.next(this.filesArray);
  }

  removeThumb(thumb: Thumb) {
    for (var i = this.filesArray.length - 1; i >= 0; i--) {
      if (this.filesArray[i] === thumb.originalId) {
        this.filesArray.splice(i, 1);
        this.files.next(this.filesArray);
        Thumbs.remove(thumb._id);
      }
    }
  }

}