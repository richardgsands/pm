import { Meteor } from 'meteor/meteor';

import '/imports/api/tables/projects.js';
import '/imports/ui/components/quickFormModal/quickFormModal.js';

import './projects.html';

Template.App_projects.onCreated(function() {
    this.subscribe('projects.all');
});

Template.App_projects.helpers({

})

Template.App_projects.events({

    'click .js-project-add'() {

        Modal.show('quickFormModal', {
            title: "Add project",
            type: 'insert',
            collection: Projects,
            id: 'insertProjectFormModal'
        });

    }

})