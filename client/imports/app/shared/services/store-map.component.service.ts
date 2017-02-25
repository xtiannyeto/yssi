
import { Component, OnInit, EventEmitter, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
import { Router } from '@angular/router';
import { AppComponentService } from '../../app.component.service';

import { YssiLocation } from '../../../../../both/models/store.model';


@Injectable()
export class StoreMapComponentService {

    private zoomDirection = new BehaviorSubject(0);
    private zoom: number = 12;

    constructor(
        private router: Router,
        private componentService: AppComponentService,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone
    ) {

    }
    getZoom() {
        return this.zoomDirection;
    }

    updateZoom(zoom: number) {
        console.log(zoom);
        console.log(this.zoom);
        if (zoom == null || zoom === undefined) {
            return;
        }
        this.zoomDirection.next(zoom - this.zoom);
        this.zoom = zoom;
    }

    setPlaces(id: string, isRouteAfter: boolean) {
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(document.getElementById(id), {});

            google.maps.event.addListener(autocomplete, 'place_changed', () => {
                this.ngZone.run(() => {
                    let place = autocomplete.getPlace();
                    if (place.geometry.location) {
                        this.routeIt(place.geometry.location.lng(), place.geometry.location.lat(), isRouteAfter);
                    }
                });
            });
        });
    }

    namePlaceByCoords(location: EventEmitter<YssiLocation>, lng: number, lat: number) {
        this.mapsAPILoader.load().then(() => {

            let geocoder = new google.maps.Geocoder();

            let place: any = { 'location': { lng: lng, lat: lat } };
            geocoder.geocode(place, (results, status) => {

                let selectLocation: YssiLocation = {
                    name: "", address: "", coords: {
                        type: 'Point',
                        coordinates: [0, 0]
                    }
                };

                let adress: any;
                let name: any;

                selectLocation.coords.coordinates[0] = lng;
                selectLocation.coords.coordinates[1] = lat;

                if (!(results === undefined) && !(results == null) && results.length > 0) {

                    selectLocation.address = results[0] === undefined ? "" : results[0].formatted_address;
                    selectLocation.name = results[0] === undefined ? "" : results[1].formatted_address;
                    if (location == null || location === undefined) {
                        return selectLocation;
                    }
                    location.emit(selectLocation);
                }
            });
        });

    }

    routeIt(lng: number, lat: number, isRouteAfter: boolean) {
        this.componentService.updateLocation(lng, lat);
        if (!isRouteAfter) {
            return;
        }
        this.routeToStoresNoSearch(lng, lat);
    }

    routeToStoresNoSearch(lng: number, lat: number) {
        this.router.navigate(['/stores', this.componentService.encodeThis(lng),
            this.componentService.encodeThis(lat)
        ]);
    }

    routeToStores(lng: number, lat: number, searchValue: string) {
        console.log("IN ROUTE");
        this.router.navigate(['/stores', this.componentService.encodeThis(lng),
            this.componentService.encodeThis(lat), this.componentService.encodeThisString(searchValue)
        ]);
    }

    toStores() {
        let location: YssiLocation = this.componentService.getLocation().getValue();
        if (location == null) {
            return;
        }
        let searchValue: string = this.componentService.getData().getValue();
        this.routeToStores(location.coords.coordinates[0], location.coords.coordinates[1], searchValue);
    }
}