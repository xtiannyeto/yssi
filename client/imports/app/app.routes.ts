import { Route } from '@angular/router';
 
import { StoresListComponent } from './stores/stores-list.component';
import { StoreDetailsComponent } from './stores/store-details.component';
import {LoginComponent} from "./auth/login.component";
import {SignupComponent} from "./auth/signup.component";
import {RecoverComponent} from "./auth/recover.component";
 
export const routes: Route[] = [
  { path: '', component: StoresListComponent },
  { path: 'store/:storeId', component: StoreDetailsComponent , canActivate: ['canActivateForLoggedIn']},// for action on loggin only
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'recover', component: RecoverComponent }
];

export const ROUTES_PROVIDERS = [{
  provide: 'canActivateForLoggedIn',
  useValue: () => !! Meteor.userId()
}];