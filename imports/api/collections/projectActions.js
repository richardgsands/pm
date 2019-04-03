
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
    RS: null,
    SD: null,
    TR: null,
    NA: null
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