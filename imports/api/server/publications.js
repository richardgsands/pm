// All links-related publications

import { Meteor } from 'meteor/meteor';
import Projects from '../collections/projects.js';
import TimeEntrys from '../collections/timeentrys.js';

Meteor.publish('projects.all', function () {
  return Projects.find();
});

Meteor.publish('timeentrys.user', function (userId) {
  return TimeEntrys.find({ userId });
});
