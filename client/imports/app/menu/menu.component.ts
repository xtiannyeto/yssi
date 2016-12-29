import { Component, OnInit, EventEmitter } from '@angular/core';
import { Location }         from '@angular/common';

import template from './menu.component.html';
import style from './menu.component.scss';

@Component({
  selector: 'menu',
  template: template,
  styles: [style]
})
export class MenuComponent implements OnInit {
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

  logOut() {
    
  }

  gotoIntro() {
    
  }

  hideMenu(): void {
    this.sidenavParams = ['hide'];
    this.sidenavActions.emit('sideNav');
  }

  switchView(): void {
    this.isMapButtonDisplayed = !this.isMapButtonDisplayed;
    this.isListButtonDisplayed = !this.isListButtonDisplayed;
}
}
