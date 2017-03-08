import { Component, OnInit, Input, NgZone, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { MaterializeAction } from 'angular2-materialize';

import template from './login.component.html';
import style from "./login.component.scss";

@Component({
  selector: 'login',
  template,
  styles: [style]
})

export class LoginComponent implements OnInit {
  modalActions: EventEmitter<string | MaterializeAction> = new EventEmitter<string | MaterializeAction>();
  loginForm: FormGroup;
  error: string;

  constructor(
    private router: Router,
    private zone: NgZone,
    private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.error = '';
  }

  login() {
    if (this.loginForm.valid) {
      Meteor.loginWithPassword(this.loginForm.value.email, this.loginForm.value.password, (err) => {
        this.zone.run(() => {
          if (err) {
            this.error = err;
          } else {
            this.ngOnInit();
            this.modalActions.emit({ action: "modal", params: ['close'] });
          }
        });
      });
    }
  }

  loginFacebook() {
    Meteor.loginWithFacebook((err) => {
      if (err) {
        console.log(err);
      } else {
        this.modalActions.emit({ action: "modal", params: ['close'] });
      }
    });
  }
}
