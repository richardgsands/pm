import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import TimeEntrys from '/imports/api/collections/timeentrys.js';
import ProjectActions from '/imports/api/collections/projectActions.js';
import '/imports/api/tables/projects.js';
import '/imports/ui/components/quickFormModal/quickFormModal.js';

import './overview.html';

Template.App_overview.onCreated(function() {

    this.getUsername = () => FlowRouter.getParam('username');

    // subscriptions
    this.subscribe('projects.all');     // needed for insert form
    this.autorun(() => {
        this.subscribe('user.username.joins', this.getUsername())
    });    

    // nb: will not work until subscriptions ready
    this.getUser = () => {
        let user = Meteor.users.findOne({ username: this.getUsername() });
        console.log(Template.instance().getUsername(), user && user._id);
        return user;
    }

});

Template.App_overview.onRendered(function() {

});

Template.App_overview.helpers({

    actionsOverdue() {
        return ProjectActions.find({'$or': [
            {
                ownerId: user._id,
                status: { '$in': [ 'NS', 'IP' ] },
                dueDate: { '$lt': moment().startOf('week').toDate() }
            },
        ]});
    },

    actionsThisWeek() {
        let user = Template.instance().getUser();
        if (!user) return;

        return ProjectActions.find({'$or': [
            {
                ownerId: user._id,
                status: { '$in': [ 'NS', 'IP' ] },
                dueDate: { 
                    '$gte': moment().startOf('week').add(0,'d').toDate(),
                    '$lt':  moment().startOf('week').add(7,'d').toDate() 
                }
            },
            {
                ownerId: user._id,
                status: { '$in': [ 'CO' ] },
                completedDate: { '$gte': moment().startOf('week').add(0,'d').toDate() },
            },
        ]});
    },

    actionsNextWeek() {
        let user = Template.instance().getUser();
        if (!user) return;

        return ProjectActions.find({'$or': [
            {
                ownerId: user._id,
                status: { '$in': [ 'NS', 'IP' ] },
                dueDate: { 
                    '$gte': moment().startOf('week').add(7, 'd').toDate(),
                    '$lt':  moment().startOf('week').add(14,'d').toDate() 
                }
            },
            {
                ownerId: user._id,
                status: { '$in': [ 'CO' ] },
                completedDate: { 
                    '$gte': moment().startOf('week').add(7, 'd').toDate(),
                    '$lt':  moment().startOf('week').add(14,'d').toDate() 
                }
            },
        ]});
        
    },

    forLoggedInUser() {
        FlowRouter.watchPathChange();
        return FlowRouter.getParam('username') === ( Meteor.user() && Meteor.user().username );
    },

});

Template.App_overview.events({

});

