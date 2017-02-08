import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Comments } from '../../../both/collections/comments.collection'; 
import { Stores } from '../../../both/collections/stores.collection';


  Meteor.publish('comments', function (storeId: string) {
  const store = Stores.findOne(storeId);
 
  if (!store) {
    throw new Meteor.Error('404', 'No such Store!');
  }
 
  return Comments.collection.find({store: storeId});
    
});