
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import AuditHooks from '../audit-hooks';
import ApiCommon from '../api-common';
import Projects from './projects';
import ProjectActions from './projectActions';

export default ProjectMilestones = new Mongo.Collection('projectMilestones');

ProjectMilestones.schema = new SimpleSchema({

    projectId: {
        type: String,
        autoform: {
            type: 'hidden'
        }
    },

    description: {
        type: String,
        optional: true
    }

});

ProjectMilestones.attachSchema(ProjectMilestones.schema);
AuditHooks(ProjectMilestones);

ProjectMilestones.helpers({

    getProject() {
        return Projects.findOne(this.projectId);
    },

    // associated actions (and aggregrated properties)

    getActions() {
        return ProjectActions.find({milestoneId: this._id});
    },

    getStatus() {
        let ns = true;
        let co = true;
        ProjectActions.getActions.forEach((a) => {
            if ( a.status === ProjectActions.Statuses.NS ) {
                co = false;
            } else if ( a.status === ProjectActions.IP || a.status === ProjectActions.OH ) {
                co = false;
                ns = false;
            } else if ( a.status === ProjectActions.CO ) {
                ns = false;
            }
        });
        if (ns) {
            return ProjectActions.Statuses.NS;
        } else if (co) {
            return ProjectActions.Statuses.CO;
        } else {
            return ProjectActions.Statuses.IP;
        }
    },

    getEffort() {
        let effort = 0;
        ProjectActions.getActions.forEach((a) => {
            effort += a.effort || 0;
        });
        return effort;
    },

    getDueDate() {
        let dueDate = 0;
        ProjectActions.getActions.forEach((a) => {
            dueDate = max(dueDate, a.dueDate)
        });
        return dueDate;
    },

    getCompletedDate() {
        let completedDate = 0;
        ProjectActions.getActions.forEach((a) => {
            completedDate = max(completedDate, a.completedDate)
        });
        return completedDate;
    }

});