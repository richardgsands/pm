
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import Projects from './projects';
import AuditHooks from '../../config/audit-hooks';
import ApiCommon from '../api-common';

export default TimeEntrys = new Mongo.Collection('timeentrys');

TimeEntrys.schema = new SimpleSchema({

    userId: {
        type: String
    },

    projectId: {
        type: String,
        autoform: {
            label: "Project Code",
            type: 'select2',
            options: function() {
                return Projects.find({}).map(function(project) {
                    return { label: project.projectCode, value: project._id };
                });
            }
        }
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