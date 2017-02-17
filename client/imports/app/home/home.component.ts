import {Component, OnInit, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MaterializeAction } from 'angular2-materialize';
import { StoreMapComponentService } from '../shared/services/store-map.component.service';


import { YssiLocation } from '../../../../both/models/store.model';

import template from './home.component.html';
import style from './home.component.scss';
import { Base64 } from 'js-base64';

@Component({
  selector: 'home',
  template
})
export class HomeComponent {

  private onLocationChange: EventEmitter<YssiLocation> = new EventEmitter<YssiLocation>();
  constructor(private mapService: StoreMapComponentService) { }

  ngOnInit() {
    this.mapService.setPlaces('home-search-bar', true);
  }

}