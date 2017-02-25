import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MaterializeAction } from 'angular2-materialize';

import { StoreMapComponentService } from '../shared/services/store-map.component.service';
import { AppComponentService } from '../app.component.service';


import { YssiLocation } from '../../../../both/models/store.model';

import template from './home.component.html';
import style from './home.component.scss';
import { Base64 } from 'js-base64';

@Component({
  selector: 'home',
  template,
  styles: [style]
})
export class HomeComponent {
  searchForm: FormGroup;

  private onLocationChange: EventEmitter<YssiLocation> = new EventEmitter<YssiLocation>();
  constructor(
    private mapService: StoreMapComponentService,
    private componentService: AppComponentService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.componentService.setUrl("home");
    this.searchForm = this.formBuilder.group({
      place: ['', Validators.required],
      searchText: ['', Validators.required],
    });
    this.mapService.setPlaces('home-search-bar', false);
  }
  
  submitSearch() {
    this.componentService.updateData(this.searchForm.value.searchText);
    this.mapService.toStores();
  }

}