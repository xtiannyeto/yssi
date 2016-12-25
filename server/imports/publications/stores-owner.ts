import { Meteor } from 'meteor/meteor';
 
import { Stores } from '../../../both/collections/stores.collection';
 
Meteor.publish('stores-owner', function (ownerId: string) {
  return Stores.findOne({ "owner" : ownerId});
});