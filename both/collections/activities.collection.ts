import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

import { Activity } from '../models/activity.model';



export const Activities = new MongoObservable.Collection<Activity>('activities');

function loggedIn() {
  return !!Meteor.user();
}
 
Activities.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});
 