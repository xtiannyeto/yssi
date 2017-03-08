import { Component, OnInit, NgZone, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MaterializeAction } from 'angular2-materialize';

import template from './recover.component.html';
import style from './recover.component.scss';

@Component({
  selector: 'recover',
  template,
  styles: [style]
})
export class RecoverComponent implements OnInit {
  recoverForm: FormGroup;
  modalActions: EventEmitter<string | MaterializeAction> = new EventEmitter<string | MaterializeAction>();
  error: string;

  constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.recoverForm = this.formBuilder.group({
      email: ['', Validators.required]
    });

    this.error = '';
  }

  recover() {
    if (this.recoverForm.valid) {
      Accounts.forgotPassword({
        email: this.recoverForm.value.email
      }, (err) => {
        if (err) {
          this.zone.run(() => {
            this.error = err;
          });
        } else {
          this.router.navigate(['/']);
        }
      });
    }
  }
}