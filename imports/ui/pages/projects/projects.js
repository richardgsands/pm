import { Meteor } from 'meteor/meteor';

import '/imports/api/tables/projects.js';
import '/imports/ui/components/quickFormModal/quickFormModal.js';
import '/imports/ui/components/gantt/gantt.js';

import './projects.html';

Template.App_projects.onCreated(function() {
    this.subscribe('projects.all');
    this.subscribe('projectActions.all');   // todo:remove general sub
});

Template.App_projects.helpers({

})

Template.App_projects.events({

    'click .js-project-add'() {

        FlowRouter.go(FlowRouter.path('App.project.new'));

    },

    
    // open project
    'click tbody > tr': function (event) {
        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(event.currentTarget).data();
        if (!rowData) return; // Won't be data if a placeholder row is clicked
        // Your click handler logic here
        console.log(rowData);

        FlowRouter.go('App.project.code', {code: rowData.code});

    }
    

})