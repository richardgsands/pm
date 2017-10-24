
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import AuditHooks from '../audit-hooks';
import ApiCommon from '../api-common';
import Projects from './projects';

export default ProjectActions = new Mongo.Collection('projectActions');

ProjectActions.Statuses = {
    NS: "Not started",
    RS: "RS",
    IP: "In progress",
    CO: "Complete",
    SD: "SD",
    OH: "On hold",
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
        autoform: ApiCommon.AutoformHashPickerDef(ProjectActions.Statuses),
        optional: true
    },

    action: {
        type: String,
        optional: true
    },

    effort: {
        type: Number,
        optional: true
    },

    owner: {
        type: String,
        autoform: ApiCommon.AutoformUserPickerDef(),
        optional: true
    },

    dueDate: {
        type: Date,
        autoform: ApiCommon.AutoformBootstrapDatepickerDef(),
        optional: true
    }

});

ProjectActions.attachSchema(ProjectActions.schema);
AuditHooks(ProjectActions);

ProjectActions.helpers({

    getProject() {
        return Projects.findOne(this.projectId);
    },

    getOwner() {
        debugger;
        return Meteor.users.findOne(this.owner);
    }


});