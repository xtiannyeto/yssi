import { Meteor } from 'meteor/meteor';

import { loadStores } from './imports/fixtures/stores';
import { loadActivities } from './imports/fixtures/activities';

import './imports/publications/users';
import './imports/publications/stores';
import './imports/publications/stores-owner';
import './imports/publications/images';
import './imports/publications/activities';
import './imports/publications/comments';
import './imports/service-config.js';
import './imports/create-user.js';

Meteor.startup(() => {
  loadStores();
  loadActivities();
});