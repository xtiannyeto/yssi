import { Directive, OnDestroy, OnInit, OnChanges, Input } from '@angular/core';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { GoogleMap, Marker } from 'angular2-google-maps/core/services/google-maps-types';
import { DisplayMainThumbPipe } from "../shared/display-main-thumb.pipe";

import 'js-marker-clusterer/src/markerclusterer.js';

import { Store } from '../../../../both/models/store.model';
import { Observable } from 'rxjs';

declare const google;
declare const MarkerClusterer;

@Directive({
  selector: 'store-marker-cluster'
})
export class StoresMapMarkerCluster implements OnInit {

  @Input()
  stores: Store[];
  markerCluster: any;
  markers: any = [];

  constructor(private gmapsApi: GoogleMapsAPIWrapper) { }

  ngOnInit() {

    this.gmapsApi.getNativeMap().then(map => {

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
            });
            /*let infowindow = new google.maps.InfoWindow({
              content: this.createInfoContent(store)
            });*/
            marker.addListener('click', function () {
              map.setZoom(8);
              map.setCenter(marker.getPosition());
            });
            marker.addListener('mouseover', function () {
              infowindow.open(map, marker);
            });
            marker.addListener('mouseout', function () {
              infowindow.close(map, marker);
            });

            this.markers.push(marker);
          }

          this.markerCluster = new MarkerClusterer(map, this.markers, options);

        });
    });
  }

  ngOnChanges() {
    this.ngOnInit();
  }
  createInfoContent(store:Store){

    console.log(DisplayMainThumbPipe.prototype.transform(store));
    return "<div class='row'><div class='col s4'><img  [src]='images/cluster.jpg'></div><div class='col s8 truncate'>"
    + store.name
    +"</div></div>";
  }
}
