import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import TimeEntrys from '/imports/api/collections/timeentrys.js';
import ProjectActions from '/imports/api/collections/projectActions.js';
import '/imports/api/tables/projects.js';
import '/imports/ui/components/quickFormModal/quickFormModal.js';
import '/imports/ui/components/timeline/timeline.js';

import './mytasks.html';

Template.App_mytasks.onCreated(function() {

    // subscriptions
    this.subscribe('projects.all');     // needed for insert form

    if ( FlowRouter.getRouteName() === "App.mytasks.user" ) 
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
    else if ( FlowRouter.getRouteName() === "App.mytasks.department" ) 
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

    this.getAllActionsOutstanding = getAllActionsOutstanding;

});

Template.App_mytasks.onRendered(function() {

});

Template.App_mytasks.helpers({

    user() {
        // todo: handle if department (instead of user)
        return Meteor.users.findOne({ username: Template.instance().getUsername() })
    },

    actionsOverdueCount() {
        return (a = getActionsOverdue()) && a.count();
    },

    allActionsOutstanding() {
        return getAllActionsOutstanding();
    },

    projectsWithWeeklySummary() {
        let actionsOverdue =  getActionsOverdue();        
        let actionsThisWeek = getActionsThisWeek();
        let actionsNextWeek = getActionsNextWeek();

        // get unique list of project ids
        let projectIdsSet = {}
        if (actionsOverdue)  actionsOverdue.forEach ((a) => { (projectIdsSet[a.projectId]) = true });
        if (actionsThisWeek) actionsThisWeek.forEach((a) => { (projectIdsSet[a.projectId]) = true });
        if (actionsNextWeek) actionsNextWeek.forEach((a) => { (projectIdsSet[a.projectId]) = true });

        // get unique list of projects (sorted by code)
        let projects = Projects.find({ 
            _id: { $in: _.keys(projectIdsSet) },
            status: { $nin: ['OH'] }            // TODO: confirm on hold (OH) behaviour
        }, {
            sort: { code: -1 }
        }).fetch();

        // set overdue, this week and next week tasks on projects (array)
        projects.forEach((p) => {
            p.actionsOverdue =   _.where(actionsOverdue.fetch(),  { projectId: p._id });
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

Template.App_mytasks.events({

    'click .js-table-row' (event, template) {
        FlowRouter.go('App.project.code', {code: event.currentTarget.dataset.projectCode}, {section: 'actions'});
    }

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
        {
            ownerId: { $in: userIds },
            status: { $in: [ 'NS', 'IP' ] },
            dueDate: null
        },
    ]});
}

let getActionsThisWeek = () => {
    let userIds = Template.instance().getUserIds();
    if (!userIds) return;

    // todo: abstract
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

let getAllActionsOutstanding = () => {
    let userIds = Template.instance().closest('App_mytasks').getUserIds();
    console.log('userIds', userIds);
    if (!userIds) return;

    return ProjectActions.find({$or: [
        {
            ownerId: { $in: userIds },
            status: { $in: [ 'NS', 'IP' ] }
        }
    ]});    
}