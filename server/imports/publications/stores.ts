import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Stores } from '../../../both/collections/stores.collection';


interface Options {
  [key: string]: any;
}
 
Meteor.publish('stores', function(options: Options, location?: string) {
    
    const selector = buildQuery.call(this, null, location);
    
    Counts.publish(this, 'numberOfStores', Stores.collection.find(selector), { noReady: true });
    
    return Stores.find(selector, options);
});
 
Meteor.publish('store', function(storeId: string) {
  return Stores.find(buildQuery.call(this, storeId));
});

function buildQuery(storeId?: string, location?: string): Object {
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
 
  const searchRegEx = { '$regex': '.*' + (location || '') + '.*', '$options': 'i' };
 
   return {
     $and: [{
         'location.name': searchRegEx
       },
       isAvailable
     ]
   };
}