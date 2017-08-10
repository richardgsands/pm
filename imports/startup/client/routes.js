import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/pages/projects/projects.js';
import '../../ui/pages/timesheet/timesheet';

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

privateRoutes.route('/timesheet', {
  name: 'App.timesheet.loggedInUser',
  action() {
    FlowRouter.go(`/timesheet/${Meteor.userId()}`)
  }
});

privateRoutes.route('/timesheet/:userId', {
  name: 'App.timesheet',
  action() {
    BlazeLayout.render('App_body', { main: 'App_timesheet' });
  }
});

let projectRoutes = privateRoutes.group({
  name: 'project'
});

projectRoutes.route('/project/:projectCode/tor', {
  name: 'Project.tor',
  action() {
    BlazeLayout.render('App_body', { main: 'App_project' });
  }
})