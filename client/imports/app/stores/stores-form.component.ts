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

import { Activities } from '../../../../both/collections/activities.collection';
import { Activity } from '../../../../both/models/activity.model';

import { StoresUploadComponent } from './stores-upload.component';
import { StoresMapComponent } from './stores-map.component';

import { AppComponentService } from '../app.component.service';
import { StoreDialogComponentService } from '../shared/services/store-dialog.component.service';

import * as _ from "lodash";

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
  newStorePosition: { lng: number, lat: number };
  stores: Store[] = [];
  store: Store;
  images: string[] = [];
  storeLocation: YssiLocation;


  storeSub: Subscription;
  imagesSubs: Subscription;
  paramsSub: Subscription;
  activitySub: Subscription;
  saveFormSub: Subscription;

  storeId: string;
  addUrl: string = "add";
  updateUrl: string = "update";
  storeActivities: Activity[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private componentService: AppComponentService,
    private dialogService: StoreDialogComponentService
  ) {
    this.newStorePosition = componentService.getLocation().getValue();
  }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: [''],
      activities: []
    });

    this.activitySub = MeteorObservable.subscribe("activities").subscribe(() => {
      Activities.find({}).subscribe((data) => {
        this.storeActivities = data;

      });
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
    this.componentService.setUrl("add");
    this.saveFormSub = this.componentService.onSaveForm.subscribe(data => {
      if (data) {
        this.addStore();
      }
    });
  }

  updateStoreInit() {
    this.componentService.setUrl("update");
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
          this.addForm.patchValue({ name: this.store.name, description: this.store.description, location: [''], activities: this.store.activities });

          this.images = this.store.images;
          this.upload.setFileArray(this.images);


          this.storeLocation = this.store.location;
          this.map.mapUpdate(this.storeLocation.coords.coordinates[0], this.storeLocation.coords.coordinates[1]);

          this.saveFormSub = this.componentService.onSaveForm.subscribe(data => {
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
      name: _.upperFirst(this.addForm.value.name),
      description: this.addForm.value.description,
      location: this.storeLocation,
      createDate: new Date(),
      activities: this.addForm.value.activities,
      images: this.images,
      owner: Meteor.userId()
    }).subscribe((data) => {
      console.log(data);
      this.dialogService.toastSuccess("No location Set");
      this.reset();
      this.router.navigate(['/store', data]);
    });
  }

  updateStore(): void {
    if (!this.checkFormValue()) {
      return;
    }
    Stores.update({ _id: this.store._id }, {
      $set: {
        name: _.upperFirst(this.addForm.value.name),
        description: this.addForm.value.description,
        location: this.storeLocation,
        updateDate: new Date(),
        activities: this.addForm.value.activities,
        images: this.images
      }
    });
    this.router.navigate(['/store', this.store._id]);
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
    if (this.location.path().split("/")[1] == this.updateUrl) {
      return;
    }
    this.images.push(imageId);
  }
  onSelectLocation(location: YssiLocation) {
    this.storeLocation = location;
  }

  checkFormValue() {
    if (this.storeLocation === undefined) {
      this.dialogService.toastFailed("Failed : No location Set ");
      return false;
    }
    if (this.addForm.value === undefined || this.addForm.value == null) {
      this.dialogService.toastFailed("Some issue on the loading of the page. Sorry!");
      return false;
    }
    if (this.addForm.value.name === undefined || this.addForm.value.name == null || this.addForm.value.name == "") {
      this.dialogService.toastFailed("Failed : No name");
      return false;
    }
    if (this.addForm.value.description === undefined || this.addForm.value.description == null || this.addForm.value.description == "") {
      this.dialogService.toastFailed("Failed : No Description");
      return false;
    }
    if (!this.addForm.valid) {
      this.dialogService.toastFailed("Failed : No Valid form");
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
    console.log("DEstroy");
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
    if (this.imagesSubs) {
      this.imagesSubs.unsubscribe();
    }
    this.activitySub.unsubscribe();
    this.saveFormSub.unsubscribe();
  }
  change() {
    console.log(this.addForm.value);
  }
}