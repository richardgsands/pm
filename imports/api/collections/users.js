// import { Meteor } from 'meteor/meteor';

Meteor.users.helpers({

    displayName() {
        if ( this.profile && this.profile.firstName && this.profile.lastName ) 
            return `${this.profile.firstName} ${this.profile.lastName}`;
        else if ( this.profile && this.profile.initials )
            return `${this.profile.initials}`;
        else
            return `(No name: ${this._id})`;
    }

})