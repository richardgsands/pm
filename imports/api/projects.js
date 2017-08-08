// Definition of the links collection

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Projects = new Mongo.Collection('projects');

// Projects.schema = new SimpleSchema({

//     projectCode: {
//         type: String
//     },

//     projetName: {
//         type: String
//     },

//     priority: {
//         type
//     }

// })