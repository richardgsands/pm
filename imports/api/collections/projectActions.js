
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import AuditHooks from '../audit-hooks';
import ApiCommon from '../api-common';
import Projects from './projects';

export default ProjectActions = new Mongo.Collection('projectActions');

ProjectActions.schema = new SimpleSchema({

    projectId: {
        type: String,
        autoform: {
            type: 'hidden'
        }
    },

    status: {
        type: String,
        allowedValues: [
            'NS - Not started',
            'IP - In progress',
            'OH - On hold',
            'CO - Complete'
        ]
    },

    action: {
        type: String
    },

    effort: {
        type: Number
    },

    owner: {
        type: String,
        autoform: ApiCommon.AutoformUserPickerDef()
    },

    dueDate: {
        type: Date,
        autoform: ApiCommon.AutoformBootstrapDatepickerDef()
    }

});

ProjectActions.attachSchema(ProjectActions.schema);
AuditHooks(ProjectActions);

ProjectActions.helpers({

    getProject() {
        return Projects.findOne(this.projectId);
    },

    getOwner() {
        return Meteor.users.findOne(this.owner);
    }


});