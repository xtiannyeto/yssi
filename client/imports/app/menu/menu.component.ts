import { Component, OnInit, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { InjectUser } from "angular2-meteor-accounts-ui";

import template from './menu.component.html';
import style from './menu.component.scss';

@Component({
  selector: 'menu',
  template: template,
  styles: [style]
})

@InjectUser('user')
export class MenuComponent implements OnInit {
  userId: string;
  sidenavActions = new EventEmitter<any>();
  sidenavParams = [];
  isMenuButtonDisplayed = true;
  isBackButtonDisplayed = false;

  isMapButtonDisplayed = true;
  isListButtonDisplayed = false;

  constructor() {
  }

  ngOnInit() {
  }

  hideMenu(): void {
    this.sidenavParams = ['hide'];
    this.sidenavActions.emit('sideNav');
  }

  switchView(): void {
    this.isMapButtonDisplayed = !this.isMapButtonDisplayed;
    this.isListButtonDisplayed = !this.isListButtonDisplayed;
  }

  logout() {
    Meteor.logout();
  }

  isLoggedIn() {
    if (!Meteor.userId()) {
      return false;
    }
    return true;
  }
}
