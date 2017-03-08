import { Component, OnInit, NgZone, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MaterializeAction } from 'angular2-materialize';

import template from './signup.component.html';
import style from './signup.component.scss';

@Component({
  selector: 'signup',
  template,
  styles: [style]
})
export class SignupComponent implements OnInit {
  modalActions: EventEmitter<string | MaterializeAction> = new EventEmitter<string | MaterializeAction>()
  signupForm: FormGroup;
  error: string;

  constructor(
    private router: Router,
    private zone: NgZone,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.signupForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });

    this.error = '';
  }

  signup() {
    if (this.signupForm.valid) {
      Accounts.createUser({
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        profile: { name: this.signupForm.value.firstName + " " + this.signupForm.value.lastName, picture: "", email: this.signupForm.value.email }
      }, (err) => {
        if (err) {
          this.zone.run(() => {
            this.error = err;
          });
        } else {
          this.ngOnInit();
          this.modalActions.emit({ action: "modal", params: ['close'] });
        }
      });
    }
  }

  signupFacebook() {
    Meteor.loginWithFacebook((err) => {
      if (err) {
        console.log(err);
      } else {
        this.modalActions.emit({ action: "modal", params: ['close'] });
      }
    });
  }
}