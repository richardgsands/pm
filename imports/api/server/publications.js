// All links-related publications

import { Meteor } from 'meteor/meteor';
import { publishComposite } from 'meteor/reywood:publish-composite';

import Projects from '../collections/projects.js';
import TimeEntrys from '../collections/timeentrys.js';

Meteor.publish('users.all', function() {
  return Meteor.users.find();
});

Meteor.publish('projects.all', function () {
  return Projects.find();
});

Meteor.publish('projectMilestones.all', function() {
  return ProjectMilestones.find();
});

Meteor.publish('timeentrys.user', function (userId) {
  return TimeEntrys.find({ userId });
});

publishComposite('project.code.joins', function(code) {
  return {
    find() {
      // find project by code
      return Projects.find({ code });
    },
    children: [
      {
        find(project) {
          // find all timeentrys for project
          return TimeEntrys.find({ projectId: project._id });
        }
      }
    ]
  }
});