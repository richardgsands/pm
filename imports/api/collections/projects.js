// Definition of the links collection

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import AuditHooks from '../../config/audit-hooks';

import TimeEntrys from './timeentrys';

export default Projects = new Mongo.Collection('projects');

Projects.schema = new SimpleSchema({

    projectCode: {
        type: String,
        unique: true
    },

    projectName: {
        type: String
    },

    priority: {
        type: SimpleSchema.Integer,
        allowedValues: [0, 1, 2, 3]
    }

});

Projects.attachSchema(Projects.schema);
AuditHooks(Projects);

Projects.helpers({

    timeEntrys() {
        return TimeEntrys.find({ projectId: this._id });
    }

});