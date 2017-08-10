import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/pages/timesheet/timesheet';
import '../../ui/pages/projects/projects.js';
import '../../ui/pages/project/project.js';
import '../../ui/components/project/project_tor.js';
import '../../ui/components/project/project_outcomes.js';
import '../../ui/components/project/project_actions.js';
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

privateRoutes.route('/timesheet', {
  name: 'App.timesheet.loggedInUser',
  action() {
    FlowRouter.redirect(`/timesheet/${Meteor.userId()}`);
  }
});

privateRoutes.route('/timesheet/:userId', {
  name: 'App.timesheet',
  action() {
    BlazeLayout.render('App_body', { main: 'App_timesheet' });
  }
});

privateRoutes.route('/project/new', {
  name: 'Project.new',
  action() {
    BlazeLayout.render('App_body', { main: 'App_project' });
  }
});

privateRoutes.route('/project/:projectCode', {
  name: 'Project',
  action() {
    FlowRouter.redirect(`${FlowRouter.current().path}/tor`);
  }
});

let projectRoutes = privateRoutes.group({
  name: 'project'
});

projectRoutes.route('/project/:projectCode/tor', {
  name: 'TOR',
  action() {
    BlazeLayout.render('App_body', { main: 'App_project', sub: 'project_tor' });
  }
});

projectRoutes.route('/project/:projectCode/outcomes', {
  name: 'Outcomes',
  action() {
    BlazeLayout.render('App_body', { main: 'App_project', sub: 'project_outcomes' });
  }
});

projectRoutes.route('/project/:projectCode/actions', {
  name: 'Actions',
  action() {
    BlazeLayout.render('App_body', { main: 'App_project', sub: 'project_actions' });
  }
});

projectRoutes.route('/project/:projectCode/people', {
  name: 'People',
  action() {
    BlazeLayout.render('App_body', { main: 'App_project', sub: 'project_people' });
  }
});

projectRoutes.route('/project/:projectCode/money', {
  name: 'Money',
  action() {
    BlazeLayout.render('App_body', { main: 'App_project', sub: 'project_money' });
  }
});

projectRoutes.route('/project/:projectCode/status', {
  name: 'Status',
  action() {
    BlazeLayout.render('App_body', { main: 'App_project', sub: 'project_status' });
  }
});