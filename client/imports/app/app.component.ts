import { Location } from '@angular/common';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
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
  providers: [Location],
  template,
  styles : [ style ]
})
@InjectUser('user')
export class AppComponent implements OnInit{
  location: Location;
  modalActions = new EventEmitter<string|MaterializeAction>();
  globalActions = new EventEmitter<string|MaterializeAction>();
  searchValue : string;
  searchdelete:boolean = false;
  toastIsLoggedInMessage:string = "You have to be connected to add your store";
  
  constructor(private router: Router, private componentService: AppComponentService, location: Location){ this.location = location; }

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
    
  }
  
  isLoggedIn(){
    if (!Meteor.userId()) {
      return false;
    }
    return true;
  }

  toastIsLoggedIn(url:string){
    
    if(!this.isLoggedIn()){
      this.globalActions.emit('toast');
    }
    this.router.navigate([url]);
  }

}