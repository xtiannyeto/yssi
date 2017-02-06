import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

import { Comment } from '../models/comment.model';



export const Comments = new MongoObservable.Collection<Comment>('comments');

function loggedIn() {
  return !!Meteor.user();
}
 
Comments.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});