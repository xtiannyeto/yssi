import { InjectUser } from 'angular2-meteor-accounts-ui';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { Meteor } from 'meteor/meteor';

import { Stores } from '../../../../both/collections/stores.collection';
import { Store, YssiLocation } from '../../../../both/models/store.model';

 
import template from './stores-form.component.html';
import style from './stores-form.component.scss';
 
@Component({
  selector: 'stores-form',
  template,
   styles : [ style ]
})

@InjectUser('user')
export class StoresFormComponent implements OnInit {
  user: Meteor.User;
  addForm: FormGroup;
  newStorePosition: {lat:number, lng: number} = {lat: 37.4292, lng: -122.1381};
  stores: Store[]=[];
  images: string[] = [];
  location : YssiLocation;

    constructor(
        private formBuilder: FormBuilder
    ) {}
    
    ngOnInit() {
        this.addForm = this.formBuilder.group({
        name: ['', Validators.required],
        description: [''],
        location: ['']
        });
    }
    addStore(): void {
    if (!Meteor.userId()) {
      alert('Please log in to add a a new Store');
      return;
    }

    if(!this.checkFormValue()){
      return;
    }

      Stores.insert({ 
        name : this.addForm.value.name,
        description: this.addForm.value.descritpion,
        location: this.location,
        images: this.images,
        owner: Meteor.userId() 
      });

      this.addForm.reset();
  }

  isLoggedIn(){
    if (!Meteor.userId()) {
      return false;
    }
    return true;
  }

  mapClicked($event) {
    this.newStorePosition = $event.coords;
  }

  yourTitle(){

    let title = "YOUR STORE...";
    if(this.addForm.value.name === undefined || this.addForm.value.name ==  null){
      return title;
    } 
    if(this.addForm.value.name.length == 0){
        return title;
    }
    return this.addForm.value.name;
  }
  onImage(imageId: string) {
    this.images.push(imageId);
  }
  onSelectLocation(location: YssiLocation){
    this.location = location;
  }
  checkFormValue(){
    if(this.addForm.value === undefined || this.addForm.value ==  null){
      return false;
    }
    if(this.addForm.value.name === undefined || this.addForm.value.name ==  null){
      return false;
    }
    if(this.addForm.value.description === undefined || this.addForm.value.description ==  null){
      return false;
    }
    if(!this.addForm.valid || this.location === undefined){
      return false;
    }
    return true;
  }
}