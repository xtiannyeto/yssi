import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Stores } from '../../../both/collections/stores.collection';


interface Options {
  lng: number,
  lat: number,
  step: number,
  distance: number,
  search: string
}

interface OptionsDb {
  [key: string]: any
}


Meteor.publish('stores', function (options: Options, optionsDb: OptionsDb) {

  const selector = buildQuery.call(this, null, options);

  Counts.publish(this, 'numberOfStores', Stores.collection.find(selector), { noReady: true });

  return Stores.find(selector, optionsDb);
});

Meteor.publish('store', function (storeId: string) {
  return Stores.find(buildQuery.call(this, storeId, null));
});

function buildQuery(storeId?: string, options?: Options): Object {
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

  const searchRegEx = { '$regex': '.*' + (options.search || '') + '.*', '$options': 'i' };

  return {
    $and: [
      {
        "location.coords":
        {
          $near:
          {
            $geometry: { type: "Point", coordinates: [options.lng, options.lat] },
            $maxDistance: 10000//options.distance+options.step
          }
        }
      },
      { $or: [{ 'name': searchRegEx }, { 'activities': searchRegEx }, { 'location.name': searchRegEx }] },
      isAvailable
    ]
  };
}