import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import './overview.html';

Template.App_overview.onCreated(function() {
    // todo:remove general subs
    this.subscribe('projects.all');
    this.subscribe('projectActions.all');   
    this.subscribe('users.all');

    this.selectedProjectId = new ReactiveVar(null);
});

Template.App_overview.onRendered(function() {

});

Template.App_overview.helpers({

    tableSelector() {
        console.log(Template.instance().selectedProjectId.get());
        return {
            parentId: Template.instance().selectedProjectId.get() || null
        }
    },

    breadcrumb() {
        let breadcrumb = [];
        let selectedProject = Projects.findOne( Template.instance().selectedProjectId.get() );
        
        for ( p=selectedProject; p; p=p.getParent()  ) {
            breadcrumb.unshift(p);
        }
        return breadcrumb;
    }

});

Template.App_overview.events({

    // drill down into project
    'click tbody > tr': function (event, template) {
        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(event.currentTarget).data();
        if (!rowData) return; // if a placeholder row is clicked

        template.selectedProjectId.set(rowData._id);
    },

    // breadcrumb
    'click .js-breadcrumb': function(event, template) {
        template.selectedProjectId.set(event.currentTarget.dataset.projectId);
    }

});


