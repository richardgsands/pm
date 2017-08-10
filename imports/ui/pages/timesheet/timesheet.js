import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import TimeEntrys from '/imports/api/timeentrys.js';
import '/imports/tables/projects.js';
import '/imports/ui/components/quickFormModal/quickFormModal.js';

import './timesheet.html';

Template.App_timesheet.onCreated(function() {
    this.getUserId = () => FlowRouter.getParam('userId');

    this.subscribe('projects.all');
    this.autorun(() => {
        this.subscribe('timeentrys.user', this.getUserId());
    });

    this.state = {
        lastProjectId: new ReactiveVar(null),
        lastDate: new ReactiveVar( moment().startOf('day').format("DD/MM/YYYY") )
    }
});

Template.App_timesheet.helpers({

    TimeEntrys() {
        return TimeEntrys;
    },

    forLoggedInUser() {
        return FlowRouter.getParam('userId') === Meteor.userId();
    },

    defaultValues() {
        debugger;
        let hoursForDate = 0;
        TimeEntrys.find({ userId: Template.instance().getUserId() }).forEach((te) => {
            hoursForDate += te.hours;
        });
        return {
            userId: Template.instance().getUserId(),
            projectId: Template.instance().state.lastProjectId.get(),
            date: Template.instance().state.lastDate.get(),
            hours: Math.max(7.5-hoursForDate, 0)
        }
    }

});

Template.App_timesheet.events({

    'change #insertTimeEntryContainer input[name=date]'(event, template) {
        console.log('changed date');
        template.state.lastDate.set( event.currentTarget.value );
    },

    'change #insertTimeEntryContainer select[name=projectId]'(event, template) {
        console.log('changed project id');
        template.state.lastProjectId.set( event.currentTarget.value );
    }

});