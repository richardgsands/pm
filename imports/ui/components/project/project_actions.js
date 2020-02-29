import ProjectActions from '/imports/api/collections/projectActions.js';
import ProjectGates   from '/imports/api/collections/projectGates.js';

import './project_actions.html';

Template.project_actions.onCreated(function() {
    const sub_actions = this.subscribe('projectsActions.all');

    this.selectedGate  = new ReactiveVar("gate1");
    this.showChecklist = new ReactiveVar(false);

    // project subscription should already be set by now
    let project = Projects.findOne(Template.instance().data._id);

    this.autorun(() => {
        if (sub_actions.ready()) {
            console.log('> subs ready (actions)')
            // move to first gate with tasks
            for (i=1; i<=4; ++i) {
                let gateId = `gate${i}`;
                if ( project.getActions({ gateId }).count() ) {
                    this.selectedGate.set(gateId);
                    break;
                }
            }
        }    
    });
});

Template.project_actions.onRendered(function() {
    
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
            projectId: Template.instance().data._id,
            gateId: Template.instance().selectedGate.get()
        }
    },

    gates() {
        return Enums.ProjectGates
    },

    selectedGateId() { return Template.instance().selectedGate.get() },
    selectedGate()  { return Enums.ProjectGates[ Template.instance().selectedGate.get() ] },

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
