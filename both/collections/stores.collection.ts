import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

import { Store } from '../models/store.model';



export const Stores = new MongoObservable.Collection<Store>('stores');

function loggedIn() {
  return !!Meteor.user();
}
 
Stores.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});