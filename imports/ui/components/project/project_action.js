import ProjectActions from '/imports/api/collections/projectActions.js';

import './project_action.html';

Template.project_action.onCreated(function() {
    
});

Template.project_action.helpers({

    action() {
        return Template.instance().data.action;
    },

    renderStatus(status) {
        return `${status} (${ProjectActions.Statuses[status]})`;
    }

});