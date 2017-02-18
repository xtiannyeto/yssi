import { NgZone, Component, Input, Output, OnInit, OnDestroy, ViewChild, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';
import { PaginationService } from 'ng2-pagination';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { InjectUser } from "angular2-meteor-accounts-ui";
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';

import { StoreMapComponentService } from '../shared/services/store-map.component.service';

import { Meteor } from 'meteor/meteor';

import 'rxjs/add/operator/combineLatest';

import { Stores } from '../../../../both/collections/stores.collection';
import { Store } from '../../../../both/models/store.model';
import { YssiLocation } from '../../../../both/models/store.model';

import template from './stores-map.component.html';
import style from './stores-map.component.scss';

@Component({
  selector: 'store-map',
  providers: [Location],
  template,
  styles: [style]
})

@InjectUser('user')
export class StoresMapComponent implements OnInit, OnDestroy {

  @Input() stores: Store[];
  @Input() zoom: number;
  @Input() lat: number;
  @Input() lng: number;
  @Input() withSearch: boolean;
  @Output() onSelectLocation: EventEmitter<YssiLocation> = new EventEmitter<YssiLocation>();
  selectLocation: YssiLocation = {
    name: "", address: "", coords: {
      type: 'Point',
      coordinates: [0, 0]
    }
  };
  user: Meteor.User;
  location: Location;
  geocoder: any;
  clickLat: number;
  clickLng: number;
  markerIcon: string = "images/marker.png";


  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    location: Location,
    private mapService: StoreMapComponentService,
  ) { this.location = location; }

  ngOnInit() {

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(document.getElementById('map-search-bar'), {});
      this.geocoder = new google.maps.Geocoder();

      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        this.ngZone.run(() => {
          let place = autocomplete.getPlace();
          if (place.geometry.location) {
            this.lat = place.geometry.location.lat();
            this.lng = place.geometry.location.lng();
            this.zoom = 16;
          }
        });
      });

    });
  }

  ngOnDestroy() {

  }
  isOwner(store: Store) {
    return this.user && this.user._id === store.owner;
  }
  mapClicked($event: MouseEvent) {
    if (!this.isAddAndHasMarker()) {
      return;
    }
    this.mapClickedSetPlace($event.coords.lng, $event.coords.lat);
  }


  dragEnd($event: MouseEvent) {
    this.mapClicked($event);
  }


  mapClickedSetPlace(lng: number, lat: number) {

    this.clickLat = lat;
    this.clickLng = lng;

    this.mapService.namePlaceByCoords(this.onSelectLocation, lng, lat);

  }
  mapUpdate(lng: number, lat: number) {
    this.zoom = 16;
    this.lat = lat;
    this.clickLat = lat;
    this.lng = lng;
    this.clickLng = lng;
  }

  isAddAndHasMarker() {
    var path = this.location.path().split("/");
    return path[1] == 'add' || path[1] == 'update';
  }

  clearSearch() {

  }

  reset() {
    this.stores = [];
    this.clickLat = undefined;
    this.clickLng = undefined;
    this.ngOnInit();
  }

  clickedMarker(name: string, index: number) {
    console.log(`clicked the marker: ${name || index}`)
  }
}