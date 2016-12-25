import { Route } from '@angular/router';
 
import { StoresListComponent } from './stores/stores-list.component';
import { StoreDetailsComponent } from './stores/store-details.component';
 
export const routes: Route[] = [
  { path: '', component: StoresListComponent },
  { path: 'store/:storeId', component: StoreDetailsComponent , canActivate: ['canActivateForLoggedIn']}
];

export const ROUTES_PROVIDERS = [{
  provide: 'canActivateForLoggedIn',
  useValue: () => !! Meteor.userId()
}];