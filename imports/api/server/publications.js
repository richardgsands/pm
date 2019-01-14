// All links-related publications

import { Meteor } from 'meteor/meteor';
import { publishComposite } from 'meteor/reywood:publish-composite';

import Projects from '../collections/projects.js';
import TimeEntrys from '../collections/timeentrys.js';
import ProjectActions from '../collections/projectActions.js';

Meteor.publish('users.all', function() {
  return Meteor.users.find();
});

Meteor.publish('projects.all', function () {
  return Projects.find();
});

Meteor.publish('projectsActions.all', function () {
  return ProjectActions.find();
});

Meteor.publish('timeentrys.user', function (userId) {
  return TimeEntrys.find({ userId });
});

Meteor.publish('projectActions.user', function (userId) {
  return ProjectActions.find({ ownerId: userId });
});

Meteor.publish('projectActions.project', function (projectId) {
  return ProjectActions.find({ projectId: projectId });
});

// composites

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
      }
    ]
  }
});

publishComposite('user.username.joins', function(username) {
  return userJoins(() => Meteor.users.find({ username }));
});

publishComposite('user.department.joins', function(department) {
  return userJoins(() => Meteor.users.find({ department }));
});

let userJoins = (findFunction) => {

  return {
    find: findFunction,
    children: [   // nb: some subscriptions are handled automatically by Tabular
      {
        find(user) {
          // find all timeentrys for user
          return TimeEntrys.find({ userId: user._id });
        }
      },
      {
        find(user) {
          // find all project actions for user
          return ProjectActions.find({ ownerId: user._id });
        }
      }
    ]
  }

}

// tabular

publishComposite("tabular_Projects", function (tableName, ids, fields) {
  return {
    find() {
      // find project by code
      // console.log(tableName, ids, fields);
      return Projects.find({ _id: { $in: ids }});
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
          // find all timeentrys for project
          return ProjectActions.find({ projectId: project._id });
        }
      },
      {
        find(project) {
          return Meteor.users.find();   // TODO filter
        }
      }
    ]
  }
});

publishComposite("tabular_TimeEntrys", function (tableName, ids, fields) {
  return {
    find() {
      // find project by code
      return Projects.find({_id: {$in: ids}});
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
          // find all timeentrys for project
          return ProjectActions.find({ projectId: project._id });
        }
      }
    ]
  }
});