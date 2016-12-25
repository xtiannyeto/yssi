import { Meteor } from 'meteor/meteor';
 
import { loadStores } from './imports/fixtures/stores';

import './imports/publications/users'; 
import './imports/publications/stores'; 
import './imports/publications/stores-owner'; 
 
Meteor.startup(() => {
  loadStores();
});