import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/pages/timesheet/timesheet';
import '../../ui/pages/mytasks/mytasks';
import '../../ui/pages/overview/overview';
import '../../ui/pages/projects/projects.js';
import '../../ui/pages/resourcing/resourcing.js';

import '../../ui/pages/project/project.js';
import '../../ui/components/project/project_tor.js';
import '../../ui/components/project/project_outcomes.js';
import '../../ui/components/project/project_actions.js';
import '../../ui/components/project/project_action.js';
import '../../ui/components/project/project_people.js';
import '../../ui/components/project/project_money.js';
import '../../ui/components/project/project_status.js';

function checkLoggedIn (ctx, redirect) {  
  if (!Meteor.userId()) {
    redirect('/');
  }
}

function redirectIfLoggedIn (ctx, redirect) {  
  if (Meteor.userId()) {
    redirect('/projects');
  }
}

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'App_home' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};

Accounts.onLogin(function () {  
  if ( !FlowRouter.current().route.group ) {
    FlowRouter.go('/projects');
  }
});
Accounts.onLogout(function () {  
  FlowRouter.go('/');
});


let privateRoutes = FlowRouter.group({
  name: 'private',
  triggersEnter: [ checkLoggedIn ]
})

privateRoutes.route('/projects', {
  name: 'App.projects',
  action() {
    BlazeLayout.render('App_body', { main: 'App_projects' });
  }
});

privateRoutes.route('/resourcing', {
  name: 'App.resourcing',
  action() {
    BlazeLayout.render('App_body', { main: 'App_resourcing' });
  }
});

// my tasks

privateRoutes.route('/mytasks', {
  name: 'App.mytasks.user.loggedInUser',
  action() {
    FlowRouter.redirect(`/mytasks/user/${Meteor.user().username}`);
  }
});

privateRoutes.route('/mytasks/user/:username', {
  name: 'App.mytasks.user',
  action() {
    BlazeLayout.render('App_body', { main: 'App_mytasks' });
  }
});

privateRoutes.route('/mytasks/department/:department', {
  name: 'App.mytasks.department',
  action() {
    BlazeLayout.render('App_body', { main: 'App_mytasks' });
  }
});

// overview

privateRoutes.route('/overview', {
  name: 'App.overview',
  action() {
    BlazeLayout.render('App_body', { main: 'App_overview' });
  }
});


// timesheet

privateRoutes.route('/timesheet', {
  name: 'App.timesheet.user.loggedInUser',
  action() {
    FlowRouter.redirect(`/timesheet/user/${Meteor.user().username}`);
  }
});

privateRoutes.route('/timesheet/user/:username', {
  name: 'App.timesheet',
  action() {
    BlazeLayout.render('App_body', { main: 'App_timesheet' });
  }
});

privateRoutes.route('/project/new', {
  name: 'App.project.new',
  action() {
    BlazeLayout.render('App_body', { main: 'App_project' });
  }
});

privateRoutes.route('/project/:code', {
  name: 'App.project.code',
  action() {
    BlazeLayout.render('App_body', { main: 'App_project' });
  }
});