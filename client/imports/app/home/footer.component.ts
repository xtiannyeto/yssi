import { Component, OnInit, EventEmitter } from '@angular/core';

import template from './footer.component.html';
import style from './footer.component.scss';
import { Base64 } from 'js-base64';

@Component({
  selector: 'home-footer',
  template,
  styles: [style]
})
export class FooterComponent {
  date:Date = new Date();
  constructor() { }

  ngOnInit() {
    console.log(this.date.getFullYear());
  }

}