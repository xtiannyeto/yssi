import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Activities } from '../../../both/collections/activities.collection';
  
  
  Meteor.publish('activities', function(){
    return Activities.collection.find({});
  });