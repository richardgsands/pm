// Definition of the links collection

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export default Projects = new Mongo.Collection('projects');

Projects.schema = new SimpleSchema({

    projectCode: {
        type: String
    },

    projectName: {
        type: String
    },

    // priority: {
    //     type
    // }

});

Projects.attachSchema(Projects.schema);

