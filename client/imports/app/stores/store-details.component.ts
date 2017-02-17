import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

import { AppComponentService } from '../app.component.service';

import 'rxjs/add/operator/map';

import template from './store-details.component.html';
import style from './store-details.component.scss';

@Component({
  selector: 'store-details',
  template,
  styles: [style]
})
@InjectUser('user')
export class StoreDetailsComponent implements OnInit, OnDestroy {
  stores: Store[] = [];
  storeId: string;
  ownerId: string;
  paramsSub: Subscription;
  store: Store;
  storeSub: Subscription;
  owner: User;
  ownerSub: Subscription;
  user: Meteor.User;
  centerLat: number = 37.4292;
  centerLng: number = -122.1381;
  imagesSubs: Subscription;
  addCommentForm: FormGroup;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private componentService: AppComponentService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.imagesSubs = MeteorObservable.subscribe('images').subscribe();
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
          this.ownerId = this.store.owner;
          this.stores.push(this.store);

          this.ownerSub = MeteorObservable.subscribe('owner', this.storeId).subscribe(() => {
            this.owner = Users.findOne(this.ownerId);
            this.componentService.updateOwner(this.ownerId);
          });

          this.componentService.onEditForm.subscribe(data => {
            this.router.navigate(['/update', this.store._id]);
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

  isLoggedIn() {
    if (!Meteor.userId()) {
      return false;
    }
    return true;
  }
  get isOwner(): boolean {
    return this.store && this.user && this.user._id === this.store.owner;
  }
  get lat(): number {
    return this.store && this.store.location.coords.coordinates[1];
  }

  get lng(): number {
    return this.store && this.store.location.coords.coordinates[0];
  }

  mapClicked($event: MouseEvent) {
    this.store.location.coords.coordinates[0] = $event.coords.lng;
    this.store.location.coords.coordinates[1] = $event.coords.lat;
    
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.storeSub.unsubscribe();
    this.storeSub.unsubscribe();
    this.imagesSubs.unsubscribe();
  }
}
