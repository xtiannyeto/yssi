import { Component, OnInit,EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {MaterializeAction} from 'angular2-materialize';

import template from './home.component.html';
import style from '../../home.component.scss';

@Component({
  selector: 'home',
  template
})
export class HomeComponent {
  modalActions = new EventEmitter<string| MaterializeAction>();
  openModal() {
    this.modalActions.emit("openModal");
  }
  closeModal() {
    this.modalActions.emit("closeModal");
  }
}