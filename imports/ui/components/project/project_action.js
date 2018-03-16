import ProjectActions from '/imports/api/collections/projectActions.js';

import './project_action.html';
import { ReactiveVar } from 'meteor/reactive-var';

Template.project_action.onCreated(function() {
    this.editing = new ReactiveVar(false);
});

Template.project_action.helpers({

    ProjectActions() {
        return ProjectActions;
    },

    action() {
        return Template.instance().data.action;
    },

    renderStatus(status) {
        return `${status} (${ProjectActions.Statuses[status]})`;
    }

});

Template.project_action.events({
    'click *, focus *'(event, template) {
        template.editing.set(true);
    }
});

