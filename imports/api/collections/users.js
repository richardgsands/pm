// import { Meteor } from 'meteor/meteor';
import moment from 'moment';

// Meteor.users is automatically created by accounts package

// make initials unique
// Meteor.users._ensureIndex({initials: 1}, {unique: 1});       TODO: get this to work

Meteor.users.helpers({

    displayName() {
        if ( this.firstName && this.lastName ) 
            if (this.initials)
                return `${this.initials} (${this.firstName} ${this.lastName})` 
            else
                return `${this.firstName} ${this.lastName}`;
        else if ( this.initials )
            return `${this.initials}`;
        else
            return `(No name: ${this._id})`;
    },

    displayInitials() {
        if ( this.initials )
            return `${this.initials}`;
        else
            return `(No initials)`;
    }

})

Meteor.users.findUserByInitials = (initials) => Meteor.users.findOne({ initials });
Meteor.users.findUserByUsername = (username) => Meteor.users.findOne({ username });

Meteor.users.before.insert((userId, doc) => {
    doc._effortByWeek = {};
    doc._effortByMonth = {};
});

Meteor.users.updateCachedValuesForUser = (user) => {
    console.log(`Updating cached values for ${user.initials}...`);

    const CACHE_WEEKS  = 4;
    const CACHE_MONTHS = 4;
    
    // iterate over the coming weeks
    let _effortByWeek = {};
    let week     = moment().startOf('week');
    let stopWeek = moment(week).add(CACHE_WEEKS, 'weeks');

    let weekCounter = 0;
    for (week; week.isBefore(stopWeek); week.add(1, 'weeks')) {
        // sum project actions that fall in this week
        // todo: figure out overlapping weeks (for now, just use due date)

        _effortByWeek[weekCounter] = getTotalsForDateRange(user, { 
            $gte: week.toDate(),
            $lt:  moment(week).add(1,'weeks').toDate(),
        });

        weekCounter++;
    }

    // iterate over the coming months
    let _effortByMonth = {};
    let month     = moment().startOf('month');
    let stopMonth = moment(month).add(CACHE_MONTHS, 'months');

    let monthCounter = 0;
    for (month; month.isBefore(stopMonth); month.add(1, 'months')) {
        // sum project actions that fall in this month
        // todo: figure out overlapping months (for now, just use due date)

        _effortByMonth[monthCounter] = getTotalsForDateRange(user, { 
            $gte: month.toDate(),
            $lt:  moment(month).add(1,'months').toDate(),
        });

        monthCounter++;
    }

    Meteor.users.update(user._id, {
        $set: { _effortByWeek, _effortByMonth }
    });
}

// helpers (todo: move somewhere else perhaps?)
// TODO: duplicated in projects.js
let getTotalsForDateRange = (user, dueDateSelector) => {
    let estimatedTotal = 0;
    let estimatedTodo = 0;

    ProjectActions.find({
        ownerId: user._id,
        // status: { $in: [ 'NS', 'IP' ] },
        dueDate: dueDateSelector
    }).forEach((action) => {
        // TODO: add 'OH'
        // TODO: switch to same format as projects.js
        estimatedTotal += action.effort || 0;
        if (action.status == 'NS' || action.status == 'IP') {
            estimatedTodo += action.effort || 0;
        }
    });

    return { estimatedTotal, estimatedTodo };
}