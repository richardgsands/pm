// import { Meteor } from 'meteor/meteor';

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

