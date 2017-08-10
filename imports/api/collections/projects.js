// Definition of the links collection

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import AuditHooks from '/imports/config/audit-hooks';

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
