import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Stores } from '../../../both/collections/stores.collection';
import { Store } from '../../../both/models/store.model';

import template from './app.component.html';
import style from './app.component.scss';


import {InjectUser} from "angular2-meteor-accounts-ui";
import { MaterializeModule } from 'angular2-materialize';

@Component({
  selector: 'app',
  template,
  styles : [ style ]
})
@InjectUser('user')
export class AppComponent implements OnInit{

  constructor(){}

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