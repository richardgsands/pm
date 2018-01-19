
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
    },

    _order: {
        type: Number,
        // autoValue() {
        //     if (this.insert) {

        //     }
        // }
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
        // aggregated effort is based on child actions
        let ns = true;
        let co = true;
        this.getActions().forEach((a) => {
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
        // aggregated effort is based on child actions (could be zero)
        let effort = 0;
        this.getActions().forEach((a) => {
            effort += a.effort || 0;
        });
        return effort;
    },

    getStartDate() {
        // start date is based on child actions (for milestone), falling back to project if none have start dates
        let startDate = 0;
        this.getActions().forEach((a) => {
            startDate = min(startDate, (a.startDate||0))      // use actual inputted value here (rather than aggregated value defined in action helpers)
        });
        
        // if we have found a start date, use that
        if (startDate != 0)
            return startDate;
        
        // otherwise use project start date
        return this.project.getStartDate();
    },

    getEndDate() {
        // end date is based on child actions (for milestone) (dueDate/completedDate), or project if none have end dates
        let endDate = 0;
        this.getActions().forEach((a) => {
            if (a.completedDate) endDate = max(endDate, a.completedDate);
            else if (a.dueDate) endDate = max(endDate, a.dueDate);
        });

        // if we have found an end date, use that
        if (endDate != 0)
            return endDate;
        
        // otherwise use project end date
        return this.project.getEndDate();
    }

});