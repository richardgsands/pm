import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import './overview.html';

Template.App_overview.onCreated(function() {
    // todo:remove general subs
    this.subscribe('projects.all');
    this.subscribe('projectActions.all');   
    this.subscribe('users.all');
});

Template.App_overview.onRendered(function() {

});

Template.App_overview.helpers({

});

Template.App_overview.events({

});
