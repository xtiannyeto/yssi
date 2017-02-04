import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { Subscription } from 'rxjs/Subscription';
import { InjectUser } from 'angular2-meteor-accounts-ui';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


import { Stores } from '../../../../both/collections/stores.collection';
import { Store, YssiLocation } from '../../../../both/models/store.model';

import { StoresUploadComponent } from './stores-upload.component';
import { StoresMapComponent } from './stores-map.component';

import { AppComponentService } from '../app.component.service';


import template from './stores-form.component.html';
import style from './stores-form.component.scss';

@Component({
  selector: 'stores-form',
  template,
  providers: [Location],
  styles: [style]
})

@InjectUser('user')
export class StoresFormComponent implements OnInit {

  @ViewChild("upload")
  private upload: StoresUploadComponent;

  @ViewChild(StoresMapComponent)
  private map: StoresMapComponent;

  user: Meteor.User;
  addForm: FormGroup;
  newStorePosition: { lat: number, lng: number } = { lat: 37.4292, lng: -122.1381 };
  stores: Store[] = [];
  store: Store;
  images: string[] = [];
  storeLocation: YssiLocation;


  storeSub: Subscription;
  imagesSubs: Subscription;
  paramsSub: Subscription;

  storeId: string;
  addUrl: string = "add";
  updateUrl: string = "update";

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private componentService: AppComponentService
  ) { }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['']
    });

    switch (this.location.path().split("/")[1]) {
      case this.addUrl:
        this.addStoreInit();
        break;
      case this.updateUrl:
        this.updateStoreInit();
        break;
      default:
        break;
    }
  }

  addStoreInit() {
    this.componentService.onSaveForm.subscribe(data => {
      console.log("emit");
      if (data) {
        console.log("OK");
        this.addStore();
      }
    });
  }

  updateStoreInit() {
    this.imagesSubs = MeteorObservable.subscribe('images').subscribe();
    this.paramsSub = this.route.params
      .map(params => params['storeId'])
      .subscribe(storeId => {

        this.storeId = storeId;
        if (this.storeSub) {
          this.storeSub.unsubscribe();
        }

        this.storeSub = MeteorObservable.subscribe('store', this.storeId).subscribe(() => {
          this.store = Stores.findOne(this.storeId);
          this.modifierIsTheOwner(this.store.owner);
          this.addForm.patchValue({ name: this.store.name, description: this.store.description, location: [''] });

          this.images = this.store.images;
          this.storeLocation = this.store.location;

          this.upload.setFileArray(this.images);
          this.map.mapUpdate(this.storeLocation.lat, this.storeLocation.lng);

          this.componentService.onSaveForm.subscribe(data => {
            this.updateStore();
          });

        });
      });
  }


  addStore(): void {

    if (!this.checkFormValue()) {
      return;
    }

    Stores.insert({
      name: this.addForm.value.name,
      description: this.addForm.value.description,
      location: this.storeLocation,
      activities: [],
      comments: [],
      images: this.images,
      owner: Meteor.userId()
    });

    this.reset();
  }

  updateStore(): void {
    if (!this.checkFormValue()) {
      return;
    }
    console.log("UPDATE");
    Stores.update({ _id: this.store._id }, {
      $set: {
        name: this.addForm.value.name,
        description: this.addForm.value.description,
        location: this.storeLocation,
        activities: [],
        images: this.images
      }
    });
  }

  isLoggedIn() {
    if (!Meteor.userId()) {
      return false;
    }
    return true;
  }

  mapClicked($event) {
    this.newStorePosition = $event.coords;
  }

  yourTitle() {

    let title = "YOUR STORE...";
    if (this.addForm.value.name === undefined || this.addForm.value.name == null) {
      return title;
    }
    if (this.addForm.value.name.length == 0) {
      return title;
    }
    return this.addForm.value.name;
  }
  onImage(imageId: string) {
    this.images.push(imageId);
  }
  onSelectLocation(location: YssiLocation) {
    this.storeLocation = location;
  }

  checkFormValue() {
    if (this.addForm.value === undefined || this.addForm.value == null) {
      return false;
    }
    if (this.addForm.value.name === undefined || this.addForm.value.name == null) {
      return false;
    }
    if (this.addForm.value.description === undefined || this.addForm.value.description == null) {
      return false;
    }
    if (!this.addForm.valid || this.location === undefined) {
      return false;
    }
    return true;
  }

  reset() {
    this.addForm.reset();
    this.upload.reset();
    this.map.reset();
  }

  modifierIsTheOwner(owner) {
    if (Meteor.userId() != owner) {
      alert("PAS VOTRE STORE");
      this.router.navigate(['/stores']);
      return;
    }
  }

  ngOnDestroy() {
    if (!(this.paramsSub === undefined)) {
      this.paramsSub.unsubscribe();
    }
    if (!(this.storeSub === undefined)) {
      this.storeSub.unsubscribe();
    }
    if (!(this.imagesSubs === undefined)) {
      this.imagesSubs.unsubscribe();
    }
  }
}