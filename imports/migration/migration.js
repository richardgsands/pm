// Server side module for importing data
// Usage: Open terminal in project directory and execute `meteor shell` 
//        Run `Migration.importJSON(<filename>)`
//        where filename is for the file in the private/migration folder
import moment from 'moment';

import '/imports/api/collections';

export default Migration = {

    clearAllProjects(checkStr) {
        if ( !_safetyCheck(checkStr) ) return;

        ProjectActions.remove({});
        // ProjectMilestones.remove({});
        Projects.remove({});

        console.log('All projects removed.');
    },

    // import from OPMS export
    importOPMS(filename) {

        // TODO:try/catch to remove project if error occurs?

        let data = JSON.parse( Assets.getText(`migration/${filename}`) );
        console.log(`migrating ${data.projects.length} projects...`);

        let actionIndex = 0;
        data.projects
        // _.where(data.projects, {})
        .forEach(project => {
            // if (!project.name) {
            //     console.log('skipping project with no name...', project.code, project.name, project.priority, project.start_date);    
            //     return;
            // }

            console.log('importing...', project.code, project.name, project.priority, project.start_date);

            if ( Projects.findOne({ code: project.code }) ) {
                console.log('  > project already exists, skipping...');
                return
            };

            // create project

            try {
                projectId = Projects.insert({
                    code: project.code,
                    name: project.name,
                    priority: (p = project.priority) ? parseInt(p) : null,
                    startDate: _getDate(project.start_date),
                    department: project.code.substr(0,2)
                });                    
            } catch(e) {
                console.log('error adding project...', project.code, project.name, project.priority, project.start_date);    
                return;
            }

            // create project milestones

            // let milestoneIds = [];
            // _.where(project.actions, {milestone:true}).forEach((milestone, milestoneIndex) => {

            //     milestoneIds.push(
            //         ProjectMilestones.insert({
            //             projectId: projectId,
            //             description: milestone.description,
            //             _order: index
            //         })
            //     );

            // });

            // create project actions

            // let milestoneCounter = 0;
            project.actions.forEach(action => {         // loop over all 'actions' (including milestones)

                // if (action.milestone) {
                //     milestoneCounter++;
                    
                // } else {
                    ProjectActions.insert({

                        projectId: projectId,
                        // milestoneId: milestoneIds[milestoneCounter] || null,
                        milestone: (!!action.milestone),
                        status: (s = action.status) ? s.toUpperCase() : Object.keys(ProjectActions.Statuses)[0],
                        description: action.description,
                        effort: (e = action.effort) ? parseFloat(e) : null,
                        ownerId: _getUserIdByInitials(action.responsible),
                        dueDate: _getDate(action.due_date),
                        completedDate: _getDate(action.complete_date),
                        progress: _getProgressFromStatus(action.status),
                        _order: actionIndex
    
                        // todo: io - should this be linked to outcomes?
    
                    });
                    actionIndex++
                // }

            })

        });

    },

    // import native format
    import(filename) {
        let data = JSON.parse( Assets.getText(`migration/${filename}`) );

        console.log(`importing ${data.projects.length} projects...`);
        data.projects
        .forEach(project => {

            // NB: collection2 interferes with upsert, so doing it manually...

            if ( Projects.findOne({code: project.code}) ) {
                // project exists
                try {
                    Projects.update({
                        code: project.code
                    }, {
                        $set: project
                    });
                        
                } catch(e) {
                    console.log('error updating project...', project.code, project.name);    
                    return;
                }    
            } else {
                // project does not exist
                try {
                    Projects.insert(project);
                } catch(e) {
                    console.log('error inserting project...', project.code, project.name);    
                    return;
                }    
            }

        });

        console.log(`importing ${data.parents.length} parents...`);
        data.parents
        .forEach(parent => {

            let parentId;
            try {
                parentId = Projects.findOne({code: parent.parent})._id;
                Projects.update({
                    code: parent.code
                }, {
                    $set: { parentId }
                });
            } catch(e) {
                console.log('error setting parent...', parent, parentId);
                return;
            }    

        });
    }

}

function _getDate(dateStr) {
    if (!dateStr) return null;
    return moment(dateStr, 'YYYY-MM-DD').toDate()
}

function _getUserIdByInitials(initialsStr) {
    if (!initialsStr) return null;

    // pick first user if multiple are listed

    if      (_.contains(initialsStr, "/")) initials = initialsStr.split("/")[0];
    else if (_.contains(initialsStr, ",")) initials = initialsStr.split(",")[0];
    else    initials = initialsStr

    // sanitise capitalisation
    initials = _.reduce(_.clone(initials), (result, elem, index)  => {
        return result += (index<2) ? elem.toUpperCase() : elem.toLowerCase();
    }, "");

    console.log('initials', initials, initialsStr);
    
    // returns userId for mongo query (creating user if necessary)
    let user = Meteor.users.findOne({ initials });

    if (user) 
        return user._id;

    // no user found, need to create
    console.log("creating user", initials);
    let userId = Accounts.createUser({
        username: initials,
        // todo: import username like rsands, etc (look up from json file)
        // todo: import email (look up from json file)
        // nb: profile is used in onCreateUser to add fields as top-level
        profile: { 
            initials: initials ,
            // todo: firstName (look up from json file)
            // todo: lastName (look up from json file)
            // todo: departmemnt (look up from json file)
            department: "AE"
        }
    });
    return userId;
}

function _getProgressFromStatus(status) {
    if (!status) return 0;

    switch (status.toUpperCase()) {
        case ProjectActions.Statuses.NS:
            return 0;
        case ProjectActions.Statuses.CO:
            return 1
        default:
            return 0.5
    }
}

function _safetyCheck(checkStr) {
    let nowStr = moment().format('HHmm');
    if ( checkStr != nowStr ) {
        console.log("Safety check failed, please provide current server system time in format HHmm as string, e.g., '" + nowStr + "'");
        return false;
    }
    return true;
}

