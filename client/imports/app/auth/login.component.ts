import {Component, OnInit, Input, NgZone, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import {MaterializeAction} from 'angular2-materialize';
 
import template from './login.component.html';
import style from "./login.component.scss";
 
@Component({
  selector: 'login',
  template, 
  styles : [style]
})
export class LoginComponent implements OnInit {
  @Input() modalActions : EventEmitter<any>//<string | MaterializeAction>;
  loginForm: FormGroup;
  error: string;
 
  constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder) {}
 
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
 
    this.error = '';
  }
 
  login() {
    console.log("in");
    if (this.loginForm.valid) {
      Meteor.loginWithPassword(this.loginForm.value.email, this.loginForm.value.password, (err) => {
        this.zone.run(() => {
          if (err) {
            this.error = err;
          } else {
            this.ngOnInit();
            this.router.navigate(['/']);
            console.log(this.modalActions);
            
            let event = new MouseEvent('click', {bubbles: true, screenX:10, screenY:10});
            this.modalActions.emit(event);
            console.log(event);
            //this.modalActions.emit("closeModal");
          }
        });
      });
    }
  }
}
