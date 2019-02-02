
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import AuditHooks from '../audit-hooks';
import ApiCommon from '../api-common';
import Projects from './projects';

export default TimeEntrys = new Mongo.Collection('timeentrys');

TimeEntrys.schema = new SimpleSchema({

    userId: {
        type: String
    },

    projectId: {
        type: String,
        autoform: ApiCommon.AutoformProjectPickerDef()
    },

    actionId: {
        type: String,
        autoform: ApiCommon.AutoformProjectActionPickerDef(),
        optional: true
    },

    date: {
        type: Date,
        autoform: ApiCommon.AutoformBootstrapDatepickerDef()
    },

    hours: {
        type: Number
    },

    description: {
        type: String,
        optional: true
    }

});

TimeEntrys.attachSchema(TimeEntrys.schema);
AuditHooks(TimeEntrys);

TimeEntrys.helpers({

    getUser() {
        return Meteor.users.findOne(this.userId);
    },

    getProject() {
        return Projects.findOne(this.projectId);
    }


})