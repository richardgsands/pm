// Server side module for importing data
// Usage: Open terminal in project directory and execute `meteor shell` 
//        Run `Migration.importJSON(<filename>)`
//        where filename is for the file in the private/migration folder

import '/imports/api/collections';

export default Migration = {

    importJSON(filename) {

        let data = JSON.parse( Assets.getText(`migration/${filename}`) );
        console.log(`migrating ${data.projects.length} projects...`);

        data.projects.forEach((project) => {

            Projects.insert({

                projectCode: project.code

            })

        });

    }

}

function _getUserId(initials) {
    // returns userId for mongo query (creating user if necessary)
    let user = Meteor.users.findOne({'profile.initials': initials});

    if (user) 
        return user._id;

    // no user found, need to create
    let userId = Accounts.createUser({
        username: initials,
        // todo: email instead of username (look up from json file)
        profile:{
            intials: initials
            // todo: firstName (look up from json file)
            // todo: lastName (look up from json file)
        }
    });
    return userId;
}