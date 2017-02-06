import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Stores } from '../../../both/collections/stores.collection';


interface Options {
  [key: string]: any;
}
 
Meteor.publish('stores', function(options: Options, searchValue?: string) {
    
    const selector = buildQuery.call(this, null, searchValue);
    
    Counts.publish(this, 'numberOfStores', Stores.collection.find(selector), { noReady: true });
    
    return Stores.find(selector, options);
});
 
Meteor.publish('store', function(storeId: string) {
  return Stores.find(buildQuery.call(this, storeId));
});

function buildQuery(storeId?: string, searchValue?: string): Object {
  const isAvailable = {
  };
 
  if (storeId) {
    return {
      $and: [{
          _id: storeId
        },
        isAvailable
      ]
    };
  }
 
  const searchRegEx = { '$regex': '.*' + (searchValue || '') + '.*', '$options': 'i' };
 
   return {
     $and: [
       { $or : [ { 'name' :searchRegEx }, { 'activities' : searchRegEx } , {'location.name': searchRegEx}] },
       isAvailable
     ]
   };
}