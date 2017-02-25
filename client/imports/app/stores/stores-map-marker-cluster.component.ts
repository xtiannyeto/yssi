import { Directive, OnDestroy, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { Location } from '@angular/common';
import { GoogleMap, Marker } from 'angular2-google-maps/core/services/google-maps-types';
import { DisplayMainThumbPipe } from "../shared/display-main-thumb.pipe";
import { ActivatedRoute, Router, Params } from '@angular/router';

import { StoreMapComponentService } from '../shared/services/store-map.component.service';

import 'js-marker-clusterer/src/markerclusterer.js';

import { Store } from '../../../../both/models/store.model';
import { Observable } from 'rxjs';

declare const google;
declare const MarkerClusterer;

@Directive({
  selector: 'store-marker-cluster',
  providers: [Location],
})
export class StoresMapMarkerCluster implements OnInit {

  @Input()
  stores: Store[];
  markerCluster: any;
  markers: any = [];

  constructor(
    private gmapsApi: GoogleMapsAPIWrapper,
    private router: Router,
    private mapService: StoreMapComponentService,
    private route:ActivatedRoute,
    private location:Location) { }

  ngOnInit() {

    this.gmapsApi.getNativeMap().then(map => {

      /*google.maps.event.addListener(map, 'zoom_changed', () => {
        if(this.location.path().split("/")[1] == 'store'){
          return;
        }
        this.mapService.updateZoom(map.getZoom());
      });*/

      let markerIcon = {
        url: "images/marker.png"//,
        //scaledSize: new google.maps.Size(40, 40)
      }


      let style = {
        url: "images/cluster.png",
        height: 40,
        width: 40,
        textColor: '#FFF',
        textSize: 11,
        backgroundPosition: "center center"
      };

      let options = {
        imagePath: "/images/cluster",
        gridSize: 70,
        styles: [style, style, style]
      };

      Observable
        .interval(500)
        .skipWhile((s) => this.stores == null || this.stores.length <= 0)
        .take(1)
        .subscribe(() => {
          if (!(this.markerCluster === undefined)) {
            this.markerCluster.clearMarkers();
            this.markers = [];
          }
          for (let store of this.stores) {
            let marker = new google.maps.Marker({
              position: new google.maps.LatLng(store.location.coords.coordinates[1], store.location.coords.coordinates[0]),
              icon: markerIcon
            });/*
            marker.addListener('click', () => {
              this.router.navigate(["/store", store._id]);
            });
            
                        let infowindow = new google.maps.InfoWindow({
                          content: this.createInfoContent(store)
                        });
            
                        marker.addListener('mouseover', function () {
                          infowindow.open(map, marker);
                        });
                        marker.addListener('mouseout', function () {
                          infowindow.close(map, marker);
                        });*/

            this.markers.push(marker);
          }

          this.markerCluster = new MarkerClusterer(map, this.markers, options);

        });
    });
  }

  ngOnChanges() {
    this.ngOnInit();
  }
  createInfoContent(store: Store) {

    console.log(DisplayMainThumbPipe.prototype.transform(store));
    return "<div class='row'><div class='col s4'><img  [src]='images/cluster.jpg'></div><div class='col s8 truncate'>"
      + store.name
      + "</div></div>";
  }
}
