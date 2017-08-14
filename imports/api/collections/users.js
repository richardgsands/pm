// import { Meteor } from 'meteor/meteor';

Meteor.users.helpers({

    displayName() {
        return (this.profile && this.profile.firstName && this.profile.lastName) ? `${this.profile.firstName} ${this.profile.lastName}` : `(No name: ${this._id})`;
    }

})