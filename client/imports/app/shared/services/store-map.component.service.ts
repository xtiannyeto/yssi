
import { Component, OnInit, EventEmitter, Injectable, NgZone } from '@angular/core';
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
import { Router } from '@angular/router';
import { AppComponentService } from '../../app.component.service';


@Injectable()
export class StoreMapComponentService {

    constructor(
        private router: Router, 
        private componentService: AppComponentService,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone
        ) {

    }

    setPlaces(id: string, isRouteAfter:boolean) {
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(document.getElementById(id), {});

            google.maps.event.addListener(autocomplete, 'place_changed', () => {
                this.ngZone.run(() => {
                    let place = autocomplete.getPlace();
                    if (place.geometry.location && isRouteAfter) {
                        this.componentService.updateLocation(place.geometry.location.lng(), place.geometry.location.lat());
                        this.router.navigate(['/stores', this.componentService.encodeThis(place.geometry.location.lng()),
                            this.componentService.encodeThis(place.geometry.location.lat())
                        ]);
                    }
                });
            });
        });
    }
}