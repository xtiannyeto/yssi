
import { Component, OnInit, EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { User } from '../../../both/models/user.model';
import { YssiLocation } from '../../../both/models/store.model';

@Injectable()
export class AppComponentService {

    private searchValue = new BehaviorSubject("");
    private ownerValue = new BehaviorSubject("");
    private yssiLocation = new BehaviorSubject<any>(null);
    private onLocationChange: EventEmitter<YssiLocation> = new EventEmitter<YssiLocation>();
    public onSaveForm: EventEmitter<boolean> = new EventEmitter<boolean>();
    public onEditForm: EventEmitter<boolean> = new EventEmitter<boolean>();

    getData() {
        return this.searchValue;
    }

    updateLocation(lng: number, lat: number) {
        this.yssiLocation.next({'lng': lng, 'lat': lat });
    }
    updateData(data: string) {
        this.searchValue.next(data);
    }

    saveForm() {
        this.onSaveForm.emit(true);
    }

    updateOwner(data: string) {
        this.ownerValue.next(data);
    }
    getOwner() {
        return this.ownerValue;
    }

    editForm() {
        this.onEditForm.emit(true);
    }

    getLocation() {
        return this.yssiLocation;
    }

    encodeThis(float: number) {
        return window.btoa(float.toString());
    }
    decodeThis(encodeString:string){
       return  parseFloat(window.atob(encodeString));
    }

}