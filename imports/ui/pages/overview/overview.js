import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import TimeEntrys from '/imports/api/collections/timeentrys.js';
import ProjectActions from '/imports/api/collections/projectActions.js';
import '/imports/api/tables/projects.js';
import '/imports/ui/components/quickFormModal/quickFormModal.js';

import './overview.html';

Template.App_overview.onCreated(function() {

    // subscriptions
    this.subscribe('projects.all');     // needed for insert form

    if ( FlowRouter.getRouteName() === "App.overview.user" ) 
    {
        this.getUsername = () => FlowRouter.getParam('username');

        this.autorun(() => {
            this.subscribe('user.username.joins', this.getUsername())
        });                

        // nb: will not work until subscriptions ready
        this.getUserIds = () => {
            let user = Meteor.users.findOne({ username: this.getUsername() });
            return user && [user._id];
        }
    }
    else if ( FlowRouter.getRouteName() === "App.overview.department" ) 
    {
        this.getDepartment = () => FlowRouter.getParam('department');

        this.autorun(() => {
            this.subscribe('user.department.joins', this.getDepartment())
        });                

        // nb: will not work until subscriptions ready
        this.getUserIds = () => {
            let userIds = Meteor.users.find({ department: this.getDepartment() }).map((user) => user._id);
            return userIds;
        }        
    }

});

Template.App_overview.onRendered(function() {

});

Template.App_overview.helpers({

    projectsWithWeeklySummary() {
        let actionsOverdue = getActionsOverdue();        
        let actionsThisWeek = getActionsThisWeek();
        let actionsNextWeek = getActionsNextWeek();

        // get unique list of project ids
        let projectIdsSet = {}
        actionsOverdue.forEach((a) => { (projectIdsSet[a.projectId]) = true });
        actionsThisWeek.forEach((a) => { (projectIdsSet[a.projectId]) = true });
        actionsNextWeek.forEach((a) => { (projectIdsSet[a.projectId]) = true });

        // get unique list of projects (sorted by code)
        let projects = Projects.find({ 
            _id: { $in: _.keys(projectIdsSet) } 
        }, {
            sort: { code: -1 }
        }).fetch();

        // set overdue, this week and next week tasks on projects (array)
        projects.forEach((p) => {
            p.actionsOverdue =  _.where(actionsOverdue.fetch(), { projectId: p._id });
            p.actionsThisWeek =  _.where(actionsThisWeek.fetch(), { projectId: p._id });
            p.actionsNextWeek =  _.where(actionsNextWeek.fetch(), { projectId: p._id });
        });

        return projects;
    },

    weeklySummaryWithProjects() {
        let actionsOverdue = getActionsOverdue();        
        let actionsThisWeek = getActionsThisWeek();
        let actionsNextWeek = getActionsNextWeek();

        // get unique list of project ids
        let projectIdsSet = {}
        actionsOverdue.forEach((a) => { (projectIdsSet[a.projectId]) = true });
        actionsThisWeek.forEach((a) => { (projectIdsSet[a.projectId]) = true });
        actionsNextWeek.forEach((a) => { (projectIdsSet[a.projectId]) = true });

        // get unique list of projects (sorted by code)
        let projects = Projects.find({ 
            _id: { $in: _.keys(projectIdsSet) } 
        }, {
            sort: { code: -1 }
        }).fetch();

        // set overdue, this week and next week tasks on projects (array)
        projects.forEach((p) => {
            p.actionsOverdue =  _.where(actionsOverdue.fetch(), { projectId: p._id });
            p.actionsThisWeek =  _.where(actionsThisWeek.fetch(), { projectId: p._id });
            p.actionsNextWeek =  _.where(actionsNextWeek.fetch(), { projectId: p._id });
        });

        return projects;        
    },

    forLoggedInUser() {
        FlowRouter.watchPathChange();
        return FlowRouter.getParam('username') === ( Meteor.user() && Meteor.user().username );
    },

});

Template.App_overview.events({

});

let getActionsOverdue = () => {
    let userIds = Template.instance().getUserIds();
    if (!userIds) return;

    return ProjectActions.find({$or: [
        {
            ownerId: { $in: userIds },
            status: { $in: [ 'NS', 'IP' ] },
            dueDate: { $lt: moment().startOf('week').toDate() }
        },
    ]});
}

let getActionsThisWeek = () => {
    let userIds = Template.instance().getUserIds();
    if (!userIds) return;

    return ProjectActions.find({$or: [
        {
            ownerId: { $in: userIds },
            status: { $in: [ 'NS', 'IP' ] },
            dueDate: { 
                $gte: moment().startOf('week').add(0,'d').toDate(),
                $lt:  moment().startOf('week').add(7,'d').toDate() 
            }
        },
        {
            ownerId: { $in: userIds },
            status: { $in: [ 'CO' ] },
            completedDate: { $gte: moment().startOf('week').add(0,'d').toDate() },
        },
    ]});
}

let getActionsNextWeek = () => {
    let userIds = Template.instance().getUserIds();
    if (!userIds) return;

    return ProjectActions.find({$or: [
        {
            ownerId: { $in: userIds },
            status: { $in: [ 'NS', 'IP' ] },
            dueDate: { 
                $gte: moment().startOf('week').add(7, 'd').toDate(),
                $lt:  moment().startOf('week').add(14,'d').toDate() 
            }
        },
        {
            ownerId: { $in: userIds },
            status: { $in: [ 'CO' ] },
            completedDate: { 
                $gte: moment().startOf('week').add(7, 'd').toDate(),
                $lt:  moment().startOf('week').add(14,'d').toDate() 
            }
        },
    ]});
    
}