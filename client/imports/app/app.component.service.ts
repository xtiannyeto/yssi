
import { Component, OnInit, EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { User } from '../../../both/models/user.model';
import { YssiLocation } from '../../../both/models/store.model';

@Injectable()
export class AppComponentService {

    private searchValue = new BehaviorSubject(null);
    private ownerValue = new BehaviorSubject("");
    private yssiLocation = new BehaviorSubject<YssiLocation>(null);
    private onLocationChange: EventEmitter<YssiLocation> = new EventEmitter<YssiLocation>();
    public onSaveForm: EventEmitter<boolean> = new EventEmitter<boolean>();
    public onEditForm: EventEmitter<boolean> = new EventEmitter<boolean>();

    getData() {
        return this.searchValue;
    }

    updateLocation(lng: number, lat: number) {
        this.yssiLocation.next({"name": "", "address": "", "coords": { "type": 'Point', "coordinates": [lng, lat] }});
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

    encodeThis(value: number) {
        if(value == null || value === undefined){
            return "";
        }
        return window.btoa(value.toString());
    }
    decodeThis(value: string) {
        if(value == null || value === undefined){
            return 0;
        }
        return parseFloat(window.atob(value));
    }

    encodeThisString(value:string){
        if(value == null || value === undefined){
            return "";
        }
         return window.btoa(encodeURI(value));
    }

    decodeThisString(value:string){
        if(value == null || value === undefined){
            return "";
        }
         return decodeURI(window.atob(value));
    }

}