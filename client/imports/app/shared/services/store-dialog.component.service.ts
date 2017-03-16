
import { Component, OnInit, EventEmitter, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MaterializeDirective, MaterializeAction } from 'angular2-materialize';

declare var Materialize: any;

@Injectable()
export class StoreDialogComponentService {

    public MSG_ERROR_LOGIN: string = "User or password wrong";
    public MSG_ERROR_SUBCRIB: string = "";
    public MSG_ERROR_ADD_STORE: string = "Login to add your store";
    public MSG_VIEW_STORE: string = "Login to see More";

    constructor() { }

    toast(msg: string, duration: number, style: string) {
        Materialize.toast(msg, duration, style);
    }

    toastFailed(message: string) {
        Materialize.toast(message, 4000, "rounded red");
    }

    toastSuccess(message: string) {
        Materialize.toast(message, 4000, "rounded green");
    }
}