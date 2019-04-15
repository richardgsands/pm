import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import d3 from 'd3';

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

    tableSelector() {
        return {
            parentId: null
        }
    }

});

Template.App_overview.events({

    // drill down into project
    'click tbody > tr': function (event) {
        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(event.currentTarget).data();
        if (!rowData) return; // if a placeholder row is clicked

        FlowRouter.go('App.project.code', {code: rowData.code});
    }

});


