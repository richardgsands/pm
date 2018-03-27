// import { Meteor } from 'meteor/meteor';

// Meteor.users is automatically created by accounts package

Meteor.users.helpers({

    displayName() {
        if ( this.profile && this.profile.firstName && this.profile.lastName ) 
            if (this.profile.initials)
                return `${this.profile.initials} (${this.profile.firstName} ${this.profile.lastName})` 
            else
                return `${this.profile.firstName} ${this.profile.lastName}`;
        else if ( this.profile && this.profile.initials )
            return `${this.profile.initials}`;
        else
            return `(No name: ${this._id})`;
    },

    displayInitials() {
        if ( this.profile && this.profile.initials )
            return `${this.profile.initials}`;
        else
            return `(No initials)`;
    }

})