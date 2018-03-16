
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import AuditHooks from '../audit-hooks';
import ApiCommon from '../api-common';
import Projects from './projects';

export default ProjectActions = new Mongo.Collection('projectActions');

ProjectActions.Statuses = {
    // todo: implement others (here and in projectMilestones helpers)
    NS: "Not started",
    IP: "In progress",
    CO: "Complete",
    OH: "On hold",
    RS: "RS",
    SD: "SD",
    TR: "TR",
    NA: "NA"
}

ProjectActions.schema = new SimpleSchema({

    projectId: {
        type: String,
        autoform: {
            type: 'hidden'
        }
    },

    status: {
        type: String,
        allowedValues: Object.keys(ProjectActions.Statuses),
        autoform: ApiCommon.AutoformHashPickerDef(ProjectActions.Statuses, { type: 'select-radio', template: 'buttonGroup' }),
        //defaultValue: Object.keys(ProjectActions.Statuses)[0],
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
        type: Number,
        autoform: { type: 'hidden' }
    }

});

ProjectActions.attachSchema(ProjectActions.schema);
AuditHooks(ProjectActions);

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