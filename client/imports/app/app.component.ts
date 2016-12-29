import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Stores } from '../../../both/collections/stores.collection';
import { Store } from '../../../both/models/store.model';

import template from './app.component.html';
import style from '../../app.component.scss';


import {InjectUser} from "angular2-meteor-accounts-ui";

@Component({
  selector: 'app',
  template
})
@InjectUser('user')
export class AppComponent {

  constructor() {
 
  }
 
  logout() {
    Meteor.logout();
  }
}