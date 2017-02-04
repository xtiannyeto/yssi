
import { Component, OnInit,EventEmitter,Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from '../../../both/models/user.model';

@Injectable()
export class AppComponentService {
    
    private searchValue = new BehaviorSubject("");
    private ownerValue = new BehaviorSubject("");
    public onSaveForm : EventEmitter<boolean> = new EventEmitter<boolean>();
    public onEditForm : EventEmitter<boolean> = new EventEmitter<boolean>();

    getData() {
        return this.searchValue;
    }

    updateData(data: string) {
        this.searchValue.next(data);
    }

    saveForm(){
        this.onSaveForm.emit(true);
    }

    updateOwner(data: string) {
       this.ownerValue.next(data);
    }
    getOwner(){
        return this.ownerValue;
    }

    editForm(){
        this.onEditForm.emit(true);
    }
    
}