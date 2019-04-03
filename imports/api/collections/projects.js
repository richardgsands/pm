// Definition of the links collection

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import AuditHooks from '../audit-hooks';
import ApiCommon from '../api-common';

import moment from 'moment';

import TimeEntrys from './timeentrys';
import ProjectGates from './projectGates';

export default Projects = new Mongo.Collection('projects');

// enums

Projects.Departments = {
    CP: "Company", 
    PM: "Product Management",
    RD: "Research and Development", 
    AE: "Application Engineerning", 
    SU: "Support", 
    MK: "Marketing",
    HR: "Human Resources", 
    IT: "Information Technology", 
    HS: "Health and Safety"
}

// TODO: remove the need for this
Projects.MissingDataDefaults = {
    // defaults to be used if data missing
    DefaultStartDate: moment("2017-01-01"),
    DefaultEndDate:   moment("2018-12-31")
}

Projects.schema = new SimpleSchema({

    starred: {
        type: Boolean,
        defaultValue: false
    },

    parentId: {
        type: String,
        autoform: ApiCommon.AutoformProjectPickerDef({
            label: 'Parent project'
        }),
        optional: true
    },
    
    code: {
        type: String,
        unique: true
    },

    name: {
        type: String,
        autoform: {
            hint: "Test"
        }
    },

    department: {
        type: String,
        allowedValues: Object.keys(Projects.Departments),
        // autoform: ApiCommon.AutoformHashPickerDef(Projects.Departments, { type: 'select-radio', template: 'buttonGroup' }),
    },

    priority: {
        type: SimpleSchema.Integer,
        allowedValues: [0, 1, 2, 3],
        optional: true,
    },

    startDate: {            // actual date of initiation gate
        type: Date,
        autoform: ApiCommon.AutoformBootstrapDatepickerDef({
            hint: "Actual date of initiation gate"
        }),
        optional: true
    },

    completionDate: {       // actual date of closure gate
        type: Date,
        autoform: ApiCommon.AutoformBootstrapDatepickerDef(),
        optional: true
    },

    projectManagerId: {
        type: String,
        autoform: ApiCommon.AutoformUserPickerDef(),
        optional: true,
        label: 'Project Manager'
    },

    projectBoardIds: {
        type: Array,
        autoform: ApiCommon.AutoformUserPickerDef({multiple: true}),
        optional: true,
        label: 'Project Board'
    },
    'projectBoardIds.$': { type: String, optional: true },

    ratingCoreContext: {
        type: SimpleSchema.Integer,
        min: -4,
        max: 4,
        optional: true,
    },

    ratingMissionCritical: {
        type: SimpleSchema.Integer,
        min: -4,
        max: 4,
        optional: true,
    },

    gatePassed: {
        type: SimpleSchema.Integer,
        min: 1,
        max: Object.keys(ProjectGates.Gates).length,
        optional: true,
        autoform: ApiCommon.AutoformGatePickerDef()
    },

    gate1date: {
        type: Date,
        autoform: ApiCommon.AutoformBootstrapDatepickerDef(),
        optional: true,
        label: "Gate 1 target"
    },
    
    gate2date: {
        type: Date,
        autoform: ApiCommon.AutoformBootstrapDatepickerDef(),
        optional: true,
        label: "Gate 2 target"
    },
    
    gate3date: {
        type: Date,
        autoform: ApiCommon.AutoformBootstrapDatepickerDef(),
        optional: true,
        label: "Gate 3 target"
    },
    
    gate4date: {
        type: Date,
        autoform: ApiCommon.AutoformBootstrapDatepickerDef(),
        optional: true,
        label: "Gate 4 target"
    },
    
    // _NO_AUDIT is a flag for AuditHooks, and should never be set to true in the database
    _NO_AUDIT: {
        type: Boolean,
        optional: true,
        autoform: { hidden: true }
    },

    _effort: {
        type: Number,
        defaultValue: 0,
        autoform: { readonly: true }
    },

    _effortWithChildren: {
        type: Number,
        defaultValue: 0,
        autoform: { readonly: true }
    }

});

Projects.attachSchema(Projects.schema);
AuditHooks(Projects);

Projects.helpers({

    displayCodeAndName() {
        return `${this.code} (${this.name})`;
    },

    getProjectManager() {
        return this.projectManagerId && Meteor.users.findOne(this.projectManagerId);
    },

    getActions() {
        // return ProjectActions.find({ projectId: this._id }, { sort: { _order: 1 } });    // for using sortable
        return ProjectActions.find({ projectId: this._id }, { sort: { comGpletionDate: 1 } });       // sort by completion date, then milestone status
    },

    getParent() {
        return this.parentId && Projects.findOne(this.parentId);
    },

    getChildren() {
        return Projects.find({ parentId: this._id });
    },

    getRelatedProjects() {
        let relatedProjects = [];

        if ( parent = this.getParent() ) 
            relatedProjects.push(parent)
        
        this.getChildren().forEach((child) => {
            relatedProjects.push(child);
        });
        
        return relatedProjects;
    },

        
    getFamilyAsArray() {
        // return family tree, including this project

        let family = [];

        function recurse(project) {
            family.push(project);
            project.getChildren().forEach((child) => {
                recurse(child);
            });
        }
        recurse(this);

        return family;
    },

    getDescendentsAsArray() {
        return _.filter(this.getFamilyAsArray(), (p) => { return p._id != this._id });;
    },


    getStartDate() {
        // use inputted start date if present
        if (this.startDate) 
            return this.startDate;

        // otherwise determine from actions (for project)
        let startDate = 0;
        this.getActions().forEach((a) => {
            startDate = Math.min(startDate, (a.startDate||0))      // use actual inputted value here (rather than aggregated value defined in action helpers)
        });
        
        // if we have found a start date, use that
        if (startDate != 0)
            return startDate;

        // otherwise use default
        return Projects.MissingDataDefaults.DefaultStartDate;
    },

    getStartDateHuman() {
        return moment(this.getStartDate()).format("MMM-YY");
    },

    getEndDate() {
        // use inputted end date if present
        if (this.endDate) 
            return this.endDate;

        // otherwise determine from actions (for project)
        let endDate = 0;
        this.getActions().forEach((a) => {
            if (a.completedDate) endDate = max(endDate, a.completedDate);
            else if (a.dueDate) endDate = max(endDate, a.dueDate);
        });
        
        // if we have found an end date, use that
        if (endDate != 0)
            return endDate;

        // otherwise use default
        return Projects.MissingDataDefaults.DefaultEndDate;
    },

    timeEntrys() {
        return TimeEntrys.find({ projectId: this._id });
    },

    hoursSummaryActual() {
        // map of TimeEntrys by month
        let hoursSummaryMap = {
            byMonth: {},
            byUser: {},
            byMonthAndUser: {}
        };
        TimeEntrys.find({ projectId: this._id }, { sort: { date: 1 } }).forEach(function(timeEntry) {
            let monthKey = moment(timeEntry.date).format('YYYYMM');
            let userKey = timeEntry.userId;

            hoursSummaryMap.byMonth[monthKey] = hoursSummaryMap.byMonth[monthKey] || 0;
            hoursSummaryMap.byMonth[monthKey] += timeEntry.hours;

            hoursSummaryMap.byUser[userKey] = hoursSummaryMap.byUser[userKey] || 0;
            hoursSummaryMap.byUser[userKey] += timeEntry.hours;

            hoursSummaryMap.byMonthAndUser[monthKey] = hoursSummaryMap.byMonthAndUser[monthKey] || {};
            hoursSummaryMap.byMonthAndUser[monthKey][userKey] = hoursSummaryMap.byMonthAndUser[monthKey][userKey] || 0;
            hoursSummaryMap.byMonthAndUser[monthKey][userKey] += timeEntry.hours;
        });

        let hoursSummary = {
            byMonth: [],
            byUser: [],
            byMonthAndUser: [],
            byUserAndMonth: []
        }

        let sortedMonthsArray = Object.keys(hoursSummaryMap.byMonth);
        let usersArray = Object.keys(hoursSummaryMap.byUser);

        if (!sortedMonthsArray.length) {
            // no timesheet entries
            return null;
        }

        let mStartMonth = moment( sortedMonthsArray[0],                          'YYYYMM' );
        let mEndMonth   = moment( sortedMonthsArray[sortedMonthsArray.length-1], 'YYYYMM' ).add('months', 1);

        // looping months first
        for ( let m=moment(mStartMonth); m.isBefore(mEndMonth); m.add('months', 1) ) {
            let monthKey = m.format('YYYYMM');

            hoursSummary.byMonth.push({ month_YYYYMM: monthKey, hours: hoursSummaryMap.byMonth[monthKey] || 0 });

            let monthAndUser = { month_YYYYMM: monthKey, users: [] };
            usersArray.forEach((userId) => {
                let hours = ( hoursSummaryMap.byMonthAndUser[monthKey] && hoursSummaryMap.byMonthAndUser[monthKey][userId] ) || 0;
                monthAndUser.users.push({ userId, hours });
            });
            hoursSummary.byMonthAndUser.push(monthAndUser);
        }

        // looping users first
        usersArray.forEach((userId) => {
            hoursSummary.byUser.push({ userId: userId, hours: hoursSummaryMap.byUser[userId] || 0 });

            let userAndMonth = { userId: userId, months: [] };
            for ( let m=moment(mStartMonth); m.isBefore(mEndMonth); m.add('months', 1) ) {
                let monthKey = m.format('YYYYMM');
                let hours = ( hoursSummaryMap.byMonthAndUser[monthKey] && hoursSummaryMap.byMonthAndUser[monthKey][userId] ) || 0;
                userAndMonth.months.push({ month_YYYYMM: monthKey, hours: hours });
            }
            hoursSummary.byUserAndMonth.push(userAndMonth);
        });

        return hoursSummary;

    }

});

// extend functions

Projects.findOneByCode = (code, selector, options) => Projects.findOne(  _.extend({ code }, selector), options );

// server side functions

if (Meteor.server) {

    Projects.updateCachedValuesForProject = function(project) {
        console.log(`Updating cached values for ${project.code}...`);

        // effort (without children)

        let _effort = 0;
        // debugger;
        project.getActions().forEach((a) => {
            if (a.effort) _effort += a.effort;
        });

        // effort (with children)

        let _effortWithChildren = _effort;
        project.getDescendentsAsArray().forEach((childProject) => {
            if (childProject._effortWithChildren == null) return; //throw new Meteor.Error(`_effortWithChildren not defined for ${childProject.code}`);
            _effortWithChildren += childProject._effortWithChildren;
        });

        

        // update project
        Projects.update(project._id, {
            $set: _.extend({ _effort, _effortWithChildren }, { })
        });

        // update parents (recursive)
        if (parent = project.getParent()) {
            Projects.updateCachedValuesForProject(parent);
        }

    }



    // hooks

    Projects.after.insert((userId, doc) => {
        Projects.updateCachedValuesForProject(doc);
    });

    // NB: modifier is the original modifier, not the one after the before hooks (e.g. in AuditHooks)
    Projects.after.update((userId, doc, fieldNames, modifier, options) => {
        
        // do nothing if we are updating cached values
        if ( Object.keys( _.omit(modifier.$set, [ '_effort', '_effortWithChildren' ]) ).length === 0) 
            return

        console.log(`Project ${doc.code} updated!`);
        Projects.updateCachedValuesForProject( Projects.findOne(doc._id) );     // need to call findOne, as doc in mongo doc without helpers

    }, {fetchPrevious: false});

    Projects.after.remove((userId, doc) => {
        // TODO
    });


}
