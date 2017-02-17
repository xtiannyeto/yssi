import { Location } from '@angular/common';
import { Component, OnInit, EventEmitter, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Stores } from '../../../both/collections/stores.collection';
import { Store, YssiLocation } from '../../../both/models/store.model';

import template from './app.component.html';
import style from './app.component.scss';

import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
import { InjectUser } from "angular2-meteor-accounts-ui";
import { MaterializeModule, MaterializeAction } from 'angular2-materialize';

import { AppComponentService } from './app.component.service';
import { StoreMapComponentService } from './shared/services/store-map.component.service';



@Component({
  selector: 'app',
  providers: [Location],
  template,
  styles: [style]
})
@InjectUser('user')
export class AppComponent implements OnInit {
  location: Location;
  modalActions = new EventEmitter<string | MaterializeAction>();
  globalActions = new EventEmitter<string | MaterializeAction>();
  searchValue: string;
  searchdelete: boolean = false;
  toastIsLoggedInMessage: string = "You have to be connected to add your store";
  path: string[];
  currentLocation: YssiLocation;

  constructor(
    private router: Router,
    private componentService: AppComponentService,
    location: Location,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private mapService: StoreMapComponentService
  ) { this.location = location; }

  ngOnInit() {
    this.mapService.setPlaces('nav-search-location', true);
  }

  updateData(value: string) {

    if (!(value.length === undefined) && value.length >= 1) {
      this.searchdelete = true;
      this.componentService.updateData(value);
    } else {
      if (this.searchdelete == true) {
        this.componentService.updateData("");
        this.searchdelete = false;
      }
    }

  }



  isLoggedIn() {
    if (!Meteor.userId()) {
      return false;
    }
    return true;
  }

  toastIsLoggedIn(url: string) {

    if (!this.isLoggedIn()) {
      this.globalActions.emit('toast');
    }
    this.router.navigate([url]);
  }

  isStoreOrHome() {
    return this.location.isCurrentPathEqualTo('/') || this.location.path().split("/")[1] == 'stores';
  }
  saveForm() {
    this.componentService.saveForm();
  }

  isOnStore() {
    return this.location.path().split("/")[1] == 'store' || this.location.path().split("/")[1] == 'stores';
  }

  onStoreAndIsOwner() {
    if (!this.isLoggedIn()) {
      return false;
    }
    var path = this.location.path().split("/");

    if (path === undefined) {
      return false;
    }
    var root = path[1];
    if (root === undefined) {
      return false;
    }

    if (!(this.componentService.getOwner().getValue() == Meteor.userId())) {
      return false;
    }
    return root == "store";
  }

  showAddButton() {
    return !this.showSaveButton() && !this.showEditButton();
  }

  showSaveButton() {
    return this.location.path().split("/")[1] == 'add' || this.location.path().split("/")[1] == 'update';
  }

  showEditButton() {
    return this.onStoreAndIsOwner();
  }

  editForm() {
    this.componentService.editForm();
  }

  hasLocation() {
    this.currentLocation = this.componentService.getLocation().getValue();

    if (this.currentLocation == null || this.currentLocation === undefined) {
      this.router.navigate(['/']);
      return;
    }
    this.router.navigate(["stores", this.componentService.encodeThis(this.currentLocation.coords.coordinates[0]),
      this.componentService.encodeThis(this.currentLocation.coords.coordinates[1])
    ]);
  }
}