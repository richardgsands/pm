import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import TimeEntrys from '/imports/api/collections/timeentrys.js';
import ProjectActions from '/imports/api/collections/projectActions.js';
import '/imports/api/tables/projects.js';
import '/imports/ui/components/quickFormModal/quickFormModal.js';
import '/imports/ui/components/timeline/timeline.js';

import './mytasks.html';

Template.App_mytasks.onCreated(function() {
    console.log('mytasks created')

    // subscriptions
    this.subscribe('projects.all');     // needed for insert form
    this.subscribe('users.all');        

    let template = this;
    this.username = new ReactiveVar
    this.userIds = new ReactiveVar([]);

    // initialise with default function
    template.getUserIds = () => {
        return [];
    }

    this.autorun(function() {
        FlowRouter.watchPathChange();
        console.log('mytasks autorun')

        if ( FlowRouter.getRouteName() === "App.mytasks.user.loggedInUser" )
        {
            if ( !Meteor.user() ) {
                console.log('Meteor.user()', Meteor.user())
                // need to wait for subscription to load - massive hack for now...
                Meteor.setTimeout(function() {
                    console.log('timeout');
                    FlowRouter.redirect(`/mytasks/initials/${Meteor.user().initials}`);
                }, 2000);
                return
            } else {
                FlowRouter.redirect(`/mytasks/initials/${Meteor.user().initials}`);
            }
        }
        else if ( FlowRouter.getRouteName() === "App.mytasks.user" ) 
        {
            template.getUsername = () => FlowRouter.getParam('username');
    
            template.autorun(() => {
                template.subscribe('user.username.joins', template.getUsername())
            });                
    
            // nb: will not work until subscriptions ready
            template.getUserIds = () => {
                let user = Meteor.users.findOne({ username: template.getUsername() });
                return user && [user._id];
            }
        }
        else if ( FlowRouter.getRouteName() === "App.mytasks.initials" ) 
        {
            template.getInitials = () => FlowRouter.getParam('initials');
    
            template.autorun(() => {
                template.subscribe('user.initials.joins', template.getInitials())
            });                
    
            // nb: will not work until subscriptions ready
            template.getUserIds = () => {
                let user = Meteor.users.findOne({ initials: template.getInitials() });
                return user && [user._id];
            }
        }    
        else if ( FlowRouter.getRouteName() === "App.mytasks.department" ) 
        {
            template.getDepartment = () => FlowRouter.getParam('department');
    
            template.autorun(() => {
                template.subscribe('user.department.joins', template.getDepartment())
            });                
    
            // nb: will not work until subscriptions ready
            template.getUserIds = () => {
                // TODO: let userIds = Meteor.users.find({ department: template.getDepartment() }).map((user) => user._id);
                let userIds = Meteor.users.find({ initials: { $in: ['HH', 'JW', 'AP', 'RS', 'EF', 'SM', 'MH', 'CLa', 'MS'] } }).map((user) => user._id);
                return userIds;
            }        
        }
    });

});

Template.App_mytasks.onRendered(function() {

});

Template.App_mytasks.helpers({

    user() {
        // todo: handle if department (instead of user)
        //FlowRouter.watchPathChange();

        let user = Template.instance().getUsername && Template.instance().getUsername();
        if (!user)
            return;

        return Meteor.users.findOne({ username: Template.instance().getUsername() });
    },

    users() {
        //FlowRouter.watchPathChange();
        let userIds = Template.instance().getUserIds();
        if (!userIds) 
            return [];
        return Meteor.users.find({_id: { $in: userIds }});
    },

    actionsOverdueCount() {
        console.log('actionsOverdueCount')
        //FlowRouter.watchPathChange();
        return (a = getActionsOverdue()) && a.count();
    },

    actionsOutstanding() {
        //FlowRouter.watchPathChange();
        return getAllActionsOutstanding();
    },

    actionsOutstandingForUser(user) {
        //FlowRouter.watchPathChange();
        return getAllActionsOutstanding(user);
    },

    projectsWithWeeklySummary() {
        //FlowRouter.watchPathChange();
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
        //FlowRouter.watchPathChange();
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

    console.log(userIds);

    return ProjectActions.find({$or: [
        {
            ownerId: { $in: userIds },
            status: { $in: [ 'NS', 'IP' ] },
            _projectStatus: { $nin: ['OH', 'CO'] },
            dueDate: { $lt: moment().startOf('week').toDate() }
        },
        {
            ownerId: { $in: userIds },
            status: { $in: [ 'NS', 'IP' ] },
            _projectStatus: { $nin: ['OH', 'CO'] },
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
            status: { $in: [ 'NS' ] },
            _projectStatus: { $nin: ['OH', 'CO'] },
            dueDate: { 
                $gte: moment().startOf('week').add(0,'d').toDate(),
                $lt:  moment().startOf('week').add(7,'d').toDate() 
            }
        },
        {
            ownerId: { $in: userIds },
            status: { $in: [ 'IP' ] },
            _projectStatus: { $nin: ['OH', 'CO'] }
        },
        // {    
        //     TODO: figure out why loads of completed showing for AE
        //     ownerId: { $in: userIds },
        //     status: { $in: [ 'CO' ] },
        //     completedDate: { $gte: moment().startOf('week').add(0,'d').toDate() },
        // },
    ]});
}

let getActionsNextWeek = () => {
    let userIds = Template.instance().getUserIds();
    if (!userIds) return;

    return ProjectActions.find({$or: [
        {
            ownerId: { $in: userIds },
            status: { $in: [ 'NS', 'IP' ] },
            _projectStatus: { $nin: ['OH', 'CO'] },
            dueDate: { 
                $gte: moment().startOf('week').add(7, 'd').toDate(),
                $lt:  moment().startOf('week').add(14,'d').toDate() 
            }
        },
        // {    TODO: figure out why loads of completed showing for AE
        //     ownerId: { $in: userIds },
        //     status: { $in: [ 'CO' ] },
        //     completedDate: { 
        //         $gte: moment().startOf('week').add(7, 'd').toDate(),
        //         $lt:  moment().startOf('week').add(14,'d').toDate() 
        //     }
        // },
    ]});
    
}

let getAllActionsOutstanding = (user) => {
    let userIds;
    if (user)
    {
        userIds = [user._id]
    }
    else
    {
        let userIds = Template.instance().closest('App_mytasks').getUserIds();
        console.log('userIds', userIds);
        if (!userIds) return;    
    }

    return ProjectActions.find({$or: [
        {
            ownerId: { $in: userIds },
            status: { $in: [ 'NS', 'IP' ] },
            _projectStatus: { $nin: ['OH', 'CO'] },
        }
    ]});    
}