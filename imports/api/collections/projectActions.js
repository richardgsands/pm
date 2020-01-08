
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import AuditHooks from '../audit-hooks';
import ApiCommon from '../api-common';
import Enums from './enums';
import Projects from './projects';
import ProjectGates from './projectGates';

export default ProjectActions = new Mongo.Collection('projectActions');

ProjectActions.schema = new SimpleSchema({

    projectId: {
        type: String,
        autoform: {
            type: 'hidden'
        }
    },

    gateId: {
        type: String,
        autoform: ApiCommon.AutoformGatePickerDef(),
        allowedValues: Object.keys(Enums.ProjectGates),
        label: 'Gate'
    },

    status: {
        type: String,
        allowedValues: Object.keys(Enums.ProjectActionsStatuses),
        autoform: ApiCommon.AutoformHashPickerDef(Enums.ProjectActionsStatuses, { type: 'select-radio', template: 'buttonGroup' }),
        //defaultValue: Object.keys(Enums.ProjectActionsStatuses)[0],
    },

    ownerId: {
        type: String,
        autoform: ApiCommon.AutoformUserPickerDef(),
        optional: true,
        label: 'Owner'
    },

    milestone: {
        type: Boolean
    },

    description: {
        type: String,
        optional: true,
        autoform: {
            rows: 3
        }        
    },

    effort: {
        type: Number,
        optional: true,
        autoform: { label: "Effort (days)" }
    },

    progress: {
        type: Number,
        optional: true,
        autoform: { type: 'hidden' }
    },

    dueDate: {
        type: Date,
        autoform: ApiCommon.AutoformBootstrapDatepickerDef(),
        optional: true
    },

    completedDate: {
        type: Date,
        autoform: ApiCommon.AutoformBootstrapDatepickerDef(),
        optional: true
    },

    startDate: {
        type: Date,
        autoform: { type: 'hidden' }, //_.ApiCommon.AutoformBootstrapDatepickerDef(),
        optional: true,
    },

    _order: {
        // ref: https://forums.meteor.com/t/auto-increment-value-in-a-simpleschema/43644
        // TODO: make this an atomic DB function, maybe https://atmospherejs.com/konecty/mongo-counter ?
        type: Number,
        autoform: { type: 'hidden' },
        autoValue: function() {
            let projectId = this.siblingField('projectId') && this.siblingField('projectId').value;
            if ( this.isInsert && projectId ) {
                let count = ProjectActions.find({ projectId }).count();
                return ++count;
            }
        }
    },

    _projectStatus: {
        type: String,
        optional: true  // TODO
    }

});

ProjectActions.attachSchema(ProjectActions.schema);
AuditHooks(ProjectActions);

let updateCachedValues = (userId, doc) => {
    if (doc.ownerId) {
        Meteor.users.updateCachedValuesForUser(Meteor.users.findOne(doc.ownerId));
    }
    if (doc.projectId) {
        Projects.updateCachedValuesForProject(Projects.findOne(doc.projectId));
    }
}

ProjectActions.after.update(updateCachedValues);
ProjectActions.after.insert(updateCachedValues);

ProjectActions.before.insert((userId, doc) => {
    doc._projectStatus = Projects.findOne(doc.projectId).status || "IP";    // TODO
});

ProjectActions.helpers({

    getProject() {
        return Projects.findOne(this.projectId);
    },

    getOwner() {
        return Meteor.users.findOne(this.ownerId);
    },

    getStartDate() {
        return this.startDate
    }

});