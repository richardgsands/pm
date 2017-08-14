import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import TimeEntrys from '/imports/api/collections/timeentrys.js';
import '/imports/api/tables/projects.js';
import '/imports/ui/components/quickFormModal/quickFormModal.js';

import './timesheet.html';

Template.App_timesheet.onCreated(function() {
    this.getUserId = () => FlowRouter.getParam('userId');

    // subscriptions needed for insert form
    this.subscribe('projects.all');
    this.autorun(() => {
        this.subscribe('timeentrys.user', this.getUserId());
    });

    this.state = {
        lastProjectId: new ReactiveVar(null),
        lastDate: new ReactiveVar( moment().startOf('day').format("DD/MM/YYYY") )
    }

    this.registerEvents = () => {
        let template = this;

        // handle project select
        $('#insertTimeEntryContainer select[name=projectId]').on('select2:select', function(event) {
            console.log('user selected project');
            template.state.lastProjectId.set( $(this).val() );

            $(this).closest('.js-autoform-input-container').next().find('input').focus().select();
        });

        // handle date select
        $('#insertTimeEntryContainer input[name=date]').datepicker().on('changeDate', function(event) {
            console.log('user selected date');
            template.state.lastDate.set( $(this).val() );

            $(this).closest('.js-autoform-input-container').next().find('input').focus().select();     
        });
    }
});

Template.App_timesheet.onRendered(function() {
    this.registerEvents();
});

Template.App_timesheet.helpers({

    TimeEntrys() {
        return TimeEntrys;
    },

    forLoggedInUser() {
        FlowRouter.watchPathChange();
        return FlowRouter.getParam('userId') === Meteor.userId();
    },

    defaultValues() {
        // debugger;
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
    },

    tableSelector() {
        return { userId: Template.instance().getUserId() };
    }

});

Template.App_timesheet.events({

    // edit row
    'click tbody > tr': function (event) {
        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(event.currentTarget).data();
        if (!rowData) return; // Won't be data if a placeholder row is clicked
        // Your click handler logic here
        console.log(rowData);

        Modal.show('quickFormModal', {
            title: "Edit time entry",
            type: 'update',
            collection: TimeEntrys,
            id: 'editTimeEntryFormModal',
            doc: rowData,
            omitFields: ['userId']
        });

    }

});


// set focus on insert form on success
AutoForm.addHooks('insertTimeEntry', {
    onSuccess: () => {
        //this.event.preventDefault();
        // $('.js-autoform-input-container').first().find('select').select2('open');
    }
}, true);

// close edit modal on success
AutoForm.addHooks('editTimeEntryFormModal', {
    onSuccess: () => {
        Modal.hide();
    }
}, true);