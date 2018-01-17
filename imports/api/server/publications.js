// All links-related publications

import { Meteor } from 'meteor/meteor';
import { publishComposite } from 'meteor/reywood:publish-composite';

import Projects from '../collections/projects.js';
import TimeEntrys from '../collections/timeentrys.js';
import projectMilestones from '../collections/projectMilestones';

Meteor.publish('users.all', function() {
  return Meteor.users.find();
});

Meteor.publish('projects.all', function () {
  return Projects.find();
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
    children: [   // nb: some subscriptions are handled automatically by Tabular
      {
        find(project) {
          // find all timeentrys for project
          return TimeEntrys.find({ projectId: project._id });
        }
      },
      {
        find(project) {
          // find all milestones for project
          return projectMilestones.find({ projectId:project._id });
        }
      }
    ]
  }
});