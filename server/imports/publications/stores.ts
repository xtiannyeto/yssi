import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Stores } from '../../../both/collections/stores.collection';


interface Options {
  [key: string]: any;
}

Meteor.publish('stores', function (coords: any, options: Options, searchValue?: string) {

  console.log(coords);

  const selector = buildQuery.call(this, null, coords, searchValue);

  Counts.publish(this, 'numberOfStores', Stores.collection.find(selector), { noReady: true });

  return Stores.find(selector, options);
});

Meteor.publish('store', function (storeId: string) {
  return Stores.find(buildQuery.call(this, storeId));
});

function buildQuery(storeId?: string, coords?: any, searchValue?: string): Object {
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
      {
      "location.coords":
       { $near :
          {
            $geometry: { type: "Point",  coordinates: [ coords.lng, coords.lat ] },
            $maxDistance: 500000
          }
       }
    },
      { $or: [{ 'name': searchRegEx }, { 'activities': searchRegEx }, { 'location.name': searchRegEx }] },
      isAvailable
    ]
  };
}