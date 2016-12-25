import { Meteor } from 'meteor/meteor';
 
import { Stores } from '../../../both/collections/stores.collection';
 
Meteor.publish('owner', function (storeId: string) {
  const store = Stores.findOne(storeId);
 
  if (!store) {
    throw new Meteor.Error('404', 'No such Store!');
  }
 
  return Meteor.users.find({
    _id: store.owner
  });
});