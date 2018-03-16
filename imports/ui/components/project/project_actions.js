import ProjectActions from '/imports/api/collections/projectActions.js';

import './project_actions.html';

Template.project_actions.onCreated(function() {
    this.subscribe('projectsActions.all');
});

Template.project_actions.helpers({

    ProjectActions() {
        return ProjectActions;
    },

    projectActions() {
        return Projects.findOne(Template.instance().data._id).getActions();
    },

    defaultValues() {
        return {
            projectId: Template.instance().data._id
        }
    },

    tableSelector() {
        return {
            projectId: Template.instance().data._id
        }
    },

    renderStatus(status) {
        return `${status} (${ProjectActions.Statuses[status]})`;
    }

});

Template.project_actions.events({

    // edit row
    'click tbody > tr': function (event) {
        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(event.currentTarget).data();
        if (!rowData) return; // Won't be data if a placeholder row is clicked
        // Your click handler logic here
        console.log(rowData);

        Modal.show('quickFormModal', {
            title: "Edit action",
            type: 'update',
            collection: ProjectActions,
            id: 'editProjectActionFormModal',
            doc: rowData,
            omitFields: ['projectId']
        });

    },

    'click .js-action': function(event) {
        let projectId = event.currentTarget.dataset.projectId;
        Modal.show('quickFormModal', {
            title: "Edit action",
            type: 'update',
            collection: ProjectActions,
            id: 'editProjectActionFormModal',
            doc: { _id: projectId },
            omitFields: ['projectId']
        });
    }

});

// close edit modal on success
AutoForm.addHooks('editProjectActionFormModal', {
    onSuccess: () => {
        Modal.hide();
    }
}, true);