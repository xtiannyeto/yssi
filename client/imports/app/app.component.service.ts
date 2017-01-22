
import { Component, OnInit,EventEmitter,Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AppComponentService {
    
    private searchValue = new BehaviorSubject("");

    getData() {
        console.log(this.searchValue.getValue());
        return this.searchValue;
    }

    updateData(data: string) {
        this.searchValue.next(data);
    }
}