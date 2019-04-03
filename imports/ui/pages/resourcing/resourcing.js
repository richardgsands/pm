import { Meteor } from 'meteor/meteor';

import '/imports/api/tables/resourcing.js';
import '/imports/ui/components/quickFormModal/quickFormModal.js';

import './resourcing.html';

Template.App_resourcing.onCreated(function() {
    // todo:remove general subs
    this.subscribe('projects.all');
    this.subscribe('projectActions.all');   
    this.subscribe('users.all');
});

Template.App_resourcing.helpers({

})

Template.App_resourcing.events({
    
    // click resource
    'click tbody > tr': function (event) {
        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(event.currentTarget).data();
        if (!rowData) return; // if a placeholder row is clicked

        let user = Meteor.users.findOne(rowData._id);
        FlowRouter.go('App.overview.user', {username: user.username});
    }
    

})