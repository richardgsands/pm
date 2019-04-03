import ProjectActions from '/imports/api/collections/projectActions.js';
import ProjectGates   from '/imports/api/collections/projectGates.js';

import './project_actions.html';

Template.project_actions.onCreated(function() {
    this.subscribe('projectsActions.all');

    this.selectedGate  = new ReactiveVar("gate1");
    this.showChecklist = new ReactiveVar(false);
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

    gates() {
        return ProjectGates.Gates
    },

    selectedGateId() { return Template.instance().selectedGate.get() },
    selectedGate()  { return ProjectGates.Gates[ Template.instance().selectedGate.get() ] },

    showChecklist() { return Template.instance().showChecklist.get() },

    gateIsEnabled(gate) { return (gate < 3) }

});

Template.project_actions.events({

    // view controls

    'click .js-select-gate': function(event, template) {
        let gate = event.currentTarget.dataset.gate;
        template.selectedGate.set(gate);
    },

    'click .js-show-actions': function(event, template) {
        template.showChecklist.set(false);
    },

    'click .js-show-checklist': function(event, template) {
        template.showChecklist.set(true);
    },

    // table

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

    }



});
