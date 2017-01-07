import { Component, OnInit, OnDestroy  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
 
import { Stores } from '../../../../both/collections/stores.collection';
import { Store } from '../../../../both/models/store.model';
import { Users } from '../../../../both/collections/users.collection';
import { User } from '../../../../both/models/user.model';
import { InjectUser } from "angular2-meteor-accounts-ui";
import { MouseEvent } from "angular2-google-maps/core";

import 'rxjs/add/operator/map';

import template from './store-details.component.html';
import style from './store-details.component.scss';
 
@Component({
  selector: 'store-details',
  template,
   styles : [ style ]
})
@InjectUser('user')
export class StoreDetailsComponent implements OnInit, OnDestroy  {
  stores: Store[]=[];
  storeId: string;
  ownerId : string;
  paramsSub: Subscription;
  store: Store;
  storeSub: Subscription;
  owner: User;
  ownerSub: Subscription;
  user: Meteor.User;
  centerLat: number = 37.4292;
  centerLng: number = -122.1381;
  
 
  constructor(
    private route: ActivatedRoute
  ) {}
 
  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['storeId'])
      .subscribe(storeId => {
          this.storeId = storeId;

          if (this.storeSub) {
            this.storeSub.unsubscribe();
          }
          if (this.ownerSub) {
            this.ownerSub.unsubscribe();
          }
 
          this.storeSub = MeteorObservable.subscribe('store', this.storeId).subscribe(() => {
            this.store = Stores.findOne(this.storeId);
            this.stores.push(this.store);
            this.ownerId = this.store.owner;
            this.ownerSub = MeteorObservable.subscribe('owner', this.storeId).subscribe(() => {
            this.owner = Users.findOne(this.ownerId);
          });
        });

        
          
        });
  }

  saveStore() {
    Stores.update(this.store._id, {
      $set: {
        name: this.store.name,
        description: this.store.description,
        location: this.store.location
      }
    });
  }

  isLoggedIn(){
    if (!Meteor.userId()) {
      return false;
    }
    return true;
  }
  get isOwner(): boolean {
    return this.store && this.user && this.user._id === this.store.owner;
  }
   get lat(): number {
    return this.store && this.store.location.lat;
  }
 
  get lng(): number {
    return this.store && this.store.location.lng;
  }
 
  mapClicked($event: MouseEvent) {
    this.store.location.lat = $event.coords.lat;
    this.store.location.lng = $event.coords.lng;
  }
 
  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.storeSub.unsubscribe();
    this.storeSub.unsubscribe();
  }
}
