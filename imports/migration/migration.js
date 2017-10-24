// Server side module for importing data
// Usage: Open terminal in project directory and execute `meteor shell` 
//        Run `Migration.importJSON(<filename>)`
//        where filename is for the file in the private/migration folder
import moment from 'moment';

import '/imports/api/collections';

export default Migration = {

    importJSON(filename) {

        let data = JSON.parse( Assets.getText(`migration/${filename}`) );
        console.log(`migrating ${data.projects.length} projects...`);

        data.projects.forEach(project => {
            console.log('importing...', project.code, project.name, project.priority, project.start_date);

            // create project

            projectId = Projects.insert({

                code: project.code,
                name: project.name,
                priority: (p = project.priority) ? parseInt(p) : null,
                startDate: _getDate(project.start_date)

            });

            // create project actions

            project.actions.forEach(action => {

                ProjectActions.insert({

                    projectId: projectId,
                    status: (s = action.status) ? s.toUpperCase() : null,
                    action: action.description,
                    effort: (e = action.effort) ? parseFloat(e) : null,
                    owner: _getUserIdByInitials(action.responsible),
                    dueDate: _getDate(action.due_due)

                    // todo: io - should this be linked to outcomes?

                });

            })

        });

    }

}

function _getDate(dateStr) {
    if (!dateStr) return null;
    return moment(dateStr, 'YYYY-MM-DD').toDate()
}

function _getUserIdByInitials(initials) {
    if (!initials) return null;
    console.log('initials', initials);
    
    // returns userId for mongo query (creating user if necessary)
    let user = Meteor.users.findOne({'profile.initials': initials});

    if (user) 
        return user._id;

    // no user found, need to create
    let userId = Accounts.createUser({
        username: initials,
        // todo: email instead of username (look up from json file)
        profile:{
            initials: initials
            // todo: firstName (look up from json file)
            // todo: lastName (look up from json file)
        }
    });
    return userId;
}