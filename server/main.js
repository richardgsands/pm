// Server entry point, imports all server code

import '/imports/startup/simple-schema';
import '/imports/startup/server';
import '/imports/api/tables';

import '/imports/migration/migration.js';

// Custom create user logic

Accounts.onCreateUser((options, user) => {

    // set profile
    Object.assign(user, options.profile);
    
    // do nothing if username is set
    if (user.username)
        return user;

    let email = user.emails && user.emails[0] && user.emails[0].address;

    if (!email) {
        throw Meteor.Error("No username or email for new user!", user._id)
    }
    
    // use first portion of email for username
    user.username = email.split('@')[0];

    return user;

});