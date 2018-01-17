// Definition of the links collection

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import AuditHooks from '../audit-hooks';
import ApiCommon from '../api-common';

import moment from 'moment';

import TimeEntrys from './timeentrys';

export default Projects = new Mongo.Collection('projects');

Projects.schema = new SimpleSchema({

    code: {
        type: String,
        unique: true
    },

    name: {
        type: String
    },

    priority: {
        type: SimpleSchema.Integer,
        allowedValues: [0, 1, 2, 3],
        optional: true
    },

    startDate: {
        type: Date,
        autoform: ApiCommon.AutoformBootstrapDatepickerDef(),
        optional: true
    }

});

Projects.attachSchema(Projects.schema);
AuditHooks(Projects);

Projects.helpers({

    displayCodeAndName() {
        return `${this.code} (${this.name})`;
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