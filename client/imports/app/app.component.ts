import { Component, OnInit,EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Stores } from '../../../both/collections/stores.collection';
import { Store } from '../../../both/models/store.model';

import template from './app.component.html';
import style from './app.component.scss';


import {InjectUser} from "angular2-meteor-accounts-ui";
import { MaterializeModule, MaterializeAction} from 'angular2-materialize';

import { AppComponentService } from './app.component.service';

@Component({
  selector: 'app',
  template,
  styles : [ style ]
})
@InjectUser('user')
export class AppComponent implements OnInit{
  modalActions = new EventEmitter<string|MaterializeAction>();
  searchValue : string;
  searchdelete:boolean = false;
  
  constructor(private componentService: AppComponentService){}

  updateData(value: string) {

      if(!(value.length === undefined) && value.length>=3){
        this.searchdelete = true;
        this.componentService.updateData(value);
      }else{
        if(this.searchdelete == true){
                this.componentService.updateData("");
                this.searchdelete=false;
              }
      }
      
    }

  ngOnInit() {
    console.log(MaterializeModule);
  }
  
  isLoggedIn(){
    if (!Meteor.userId()) {
      return false;
    }
    return true;
  }
}