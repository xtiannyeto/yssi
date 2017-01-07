import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';
import { PaginationService } from 'ng2-pagination';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { InjectUser } from "angular2-meteor-accounts-ui";

import { Meteor } from 'meteor/meteor';

import 'rxjs/add/operator/combineLatest';

import { Stores } from '../../../../both/collections/stores.collection';
import { Store } from '../../../../both/models/store.model';

import template from './stores-map.component.html';
import style from './stores-map.component.scss';

@Component({
  selector: 'store-map',
  template,
  styles : [ style ]
})

@InjectUser('user')
export class StoresMapComponent  implements OnInit, OnDestroy {
  
  @Input() stores: Observable<Store[]>;
  @Input() zoom: number;
  @Input() lat: number;
  @Input() lng: number;

  user: Meteor.User;

 
  constructor() {
    
  }
  ngOnInit() {
    
  }

  ngOnDestroy() {
    
  }
  isOwner(store : Store){
    return this.user && this.user._id === store.owner;
  }
}