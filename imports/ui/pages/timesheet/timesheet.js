import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import TimeEntrys from '/imports/api/collections/timeentrys.js';
import '/imports/api/tables/projects.js';
import '/imports/ui/components/quickFormModal/quickFormModal.js';

import './timesheet.html';

Template.App_timesheet.onCreated(function() {

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

    Session.set('selectedProjectId', null);

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
        return FlowRouter.getParam('username') === ( Meteor.user() && Meteor.user().username );
    },

    defaultValues() {
        let hoursForDate = 0;
        let user = Template.instance().getUser();

        if (!user) return;

        TimeEntrys.find({ userId: user._id }).forEach((te) => {
            hoursForDate += te.hours;
        });
        return {
            userId: user._id,
            projectId: Template.instance().state.lastProjectId.get(),
            date: Template.instance().state.lastDate.get(),
            hours: Math.max(7.5-hoursForDate, 0)
        }
    },

    tableSelector() {
        let user = Template.instance().getUser();
        return user && { userId: user._id };
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

    },

    // select project
    'change .js-project-id': function(event) {
        let projectId = event.target.value;
        Template.instance().subscribe('projectActions.project', projectId);
        Session.set('selectedProjectId', projectId);
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