// Server side module for importing data
// Usage: Open terminal in project directory and execute `meteor shell` 
//        Run `Migration.importJSON(<filename>)`
//        where filename is for the file in the private/migration folder
import moment from 'moment';
const csv=require('csvtojson');

import '/imports/api/collections';
import { isNumber } from 'util';

let Opms_Exceptions = JSON.parse( Assets.getText('migration/opms_exceptions.json') );

export default Migration = {

    clearAll(checkStr) {
        if ( !_safetyCheck(checkStr) ) return;

        ProjectActions.remove({});
        ProjectGates.remove({});
        Projects.remove({});
        TimeEntrys.remove({});
        Meteor.users.remove({});

        console.log('All projects, timeentrys and users removed.');
    },

    clearAllProjects(checkStr) {
        if ( !_safetyCheck(checkStr) ) return;

        ProjectActions.remove({});
        ProjectGates.remove({});
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
            if (project.code == "TEMPLATES") return;

            console.log(project.code);

            // if (!project.name) {
            //     console.log('skipping project with no name...', project.code, project.name, project.priority, project.start_date);    
            //     return;
            // }

            console.log('importing...', project.code, project.name, project.priority, project.start_date);

            Opms_Exceptions.owner.forEach((owner) => {
                if (project.project_manager && project.project_manager.toUpperCase() == owner.find.toUpperCase()) project.project_manager = owner.replace
                // TODO: project board
            });

            Opms_Exceptions.project_status.forEach((project_status) => {
                if (project.current_status && project.current_status.toUpperCase() == project_status.find.toUpperCase()) project.current_status = project_status.replace
            });

            if (!project.current_status) project.current_status = "IP"

            let projectId;
            {
                let p = Projects.findOne({ code: project.code });
                projectId = p && p._id;
            }
            if ( !projectId ) {

                // create project

                try {
                    projectId = Projects.direct.insert({
                        code: project.code,
                        name: project.name,
                        priority: (p = project.priority) ? parseInt(p) : null,
                        status: project.current_status,
                        startDate: _getDate(project.start_date),
                        department: project.code.substr(0,2),
                        projectManagerId: _getUserIdByInitials(project.project_manager)
                    });                    
                } catch(e) {
                    console.log('error adding project...', project.code, project.name, project.priority, project.start_date);
                    console.log(e);
                    return;
                }

            } else {
                console.log('  > project already exists, updating project, and wiping / importing actions...');
                //TODO: upsert

                Projects.update(projectId, {
                    $set: {
                        name: project.name,
                        priority: (p = project.priority) ? parseInt(p) : null,
                        status: project.current_status,
                        startDate: _getDate(project.start_date),
                        department: project.code.substr(0,2),
                        projectManagerId: _getUserIdByInitials(project.project_manager)
                    }
                });

                ProjectActions.remove({projectId});
            };

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

            // check if gates are in tracker for this project
            let haveGate = {};
            project.actions.forEach(action => {
                [1,2,3,4].forEach((g) => {
                    if ( `Gate ${g}`.toUpperCase() == action.description.toUpperCase() || `G${g}`.toUpperCase() == action.description.toUpperCase() )
                        haveGate[g] = true;                    
                });
            });

            // let milestoneCounter = 0;
            let gateReached = {};
            project.actions.forEach(action => {         // loop over all 'actions' (including milestones)
                // console.log(action.description);
                // if (action.milestone) {
                //     milestoneCounter++;
                    
                // decide gate
                let gateId;

                // first, set gateId if gates are in tracker
                [1,2,3,4].some((g) => {
                    if ( haveGate[g] && (!gateReached[g] || g===4) ) {
                        gateId = `gate${g}`
                        if ( `Gate ${g}`.toUpperCase() == action.description.toUpperCase() || `G${g}`.toUpperCase() == action.description.toUpperCase() )
                            gateReached[g] = true;
                        // console.log(g, haveGate[g], gateReached[g]);
                        return true                 // returns true, so some loop will stop
                    }

                    return false                    // continue some loop
                });

                // if gateId hasn't been set, do a few other checks
                if (!gateId) {
                    if ( 'Fill out Tracker'.toUpperCase() == action.description.toUpperCase() )
                        gateId = 'gate1';
                    else if ( 'Create Project Brief'.toUpperCase() == action.description.toUpperCase() )
                        gateId = 'gate1';
                    else if ( 'Initiation gate'.toUpperCase() == action.description.toUpperCase() )
                        gateId = 'gate1';                        
                }

                // default to gate2 if still not set
                if (!gateId) gateId = 'gate2';

                // specific data cleanup

                Opms_Exceptions.action_status.forEach((action_status) => {
                    if (action.status && action.status.toUpperCase() == action_status.find.toUpperCase()) action.status = action_status.replace
                });
                Opms_Exceptions.owner.forEach((owner) => {
                    if (action.responsible && action.responsible.toUpperCase() == owner.find.toUpperCase()) action.responsible = owner.replace
                });

                // if (action.status == 'CIO') action.status = 'CO';
                // if (action.status == 'CP') action.status = 'CO';
                // if (action.responsible == '??') action.responsible = null;
                // if (action.responsible && action.responsible.toUpperCase() == 'All'.toUpperCase()) action.responsible = null;
                // if (action.responsible && action.responsible.toUpperCase() == 'All developers'.toUpperCase()) action.responsible = null;
                // if (action.responsible && action.responsible.toUpperCase() == 'All developers'.toUpperCase()) action.responsible = null;
                // if (action.responsible && action.responsible.toUpperCase() == 'ABL'.toUpperCase()) action.responsible = 'AL';
                // if (action.responsible && action.responsible.toUpperCase() == 'M'.toUpperCase()) action.responsible = null;


                ProjectActions.direct.insert({

                    projectId: projectId,
                    // milestoneId: milestoneIds[milestoneCounter] || null,
                    gateId: gateId,
                    milestone: (!!action.milestone),
                    status: (s = action.status) ? s.toUpperCase() : Object.keys(Enums.ProjectActionsStatuses)[0],
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

            })

        });

        Migration.updateCachedValues();

    },

    importTimesheetCsv(filename) {

        csv()
        .fromString( Assets.getText(`migration/${filename}`) )
        .then(Meteor.bindEnvironment((data)=>{
            console.log(`read in ${data.length} time records...`);

            // find latest updated record in database
//            let latestImported = TimeEntrys.findOne({}, {sort: {_importIndex: -1}});
//            let latestImportedIndex = (latestImported && (latestImported._importIndex != null) && latestImported._importIndex) || -1;
//            console.log(`Importing time records from ${latestImportedIndex+1}...`);

            TimeEntrys.remove({});

            let i, record, project;
            // for (i=latestImportedIndex+1; i<data.length; i++) {
            for (i=0; i<data.length; i++) {
                record = data[i];

                project = Projects.findOneByCode(record['Activity Code']);
                if ( !project ) {
                    console.log(`  > line ${i}: skipping time entry with Activity Code ${ record['Activity Code'] }`);
                    continue
                }

                let date = _getDate(record.Date);
                if ( !date ) {
                    console.log(`  > line ${i}: ERROR: no date!`);
                    continue
                }
                if ( isNaN(date.valueOf()) ) {
                    console.log(`  > line ${i}: ERROR: invalid date!`);
                    continue
                }

                if (!record.Hours) {
                    console.log(`  > line ${i}: ERROR: no hours!`);
                    continue
                }

                if ( isNaN(record.Hours) ) {
                    console.log(`  > line ${i}: ERROR: hours is NaN!`);
                    continue
                }

                // store time record
                TimeEntrys.direct.insert({
                    userId: _getUserIdByTimeRecord(record.Person),
                    projectId: project._id,
                    actionId: null,
                    date: date,
                    hours: record.Hours,
                    description: record.Description || null,
                    _importIndex: i
                });
            }

        }));

    },

    // import native format
    import(filename) {
        let data = JSON.parse( Assets.getText(`migration/${filename}`) );

        console.log(`importing ${data.users.length} users...`);
        data.users
        .forEach(user => {

            existingUser = Meteor.users.findOne({ initials: user.initials });

            if (!existingUser) {

                let userId = Accounts.createUser({
                    username: user.username,
                    // nb: ** profile is used in onCreateUser to add fields as top-level **
                    profile: { 
                        firstName: user.firstName,
                        lastName: user.lastName,
                        initials: user.initials,
                        department: user.department
                    }
                });
                // todo: remove once invitation flow is set up, but fine for a PoC internal system
                Accounts.setPassword(userId, Meteor.settings.defaultPassword);
                console.log(`  > created user: ${user.initials}, ${user.username}`);

            } else {

                if (existingUser.username !== user.username) {
                    console.log(`  > ERROR: user to import with initials ${user.initials} and username ${user.username} exists in database with username ${existingUser.username} - skipping`);
                    return
                }

                console.log(`  > updating user: ${user.initials}, ${user.username}`);
                Meteor.users.update(user._id, {
                    $set: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        department: user.department
                    }
                });

            }

        });

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

        // update any projects without a parent to be AOF1 (apart from other AOFs)
        Projects.update({
            code: { $nin: ["AOF1","AOF2","AOF3","AOF4","AOF5","AOF6","AOFX"] },
            parentId: null
        }, {
            $set: {
                parentId: Projects.findOneByCode('AOFX')._id
            }
        }, {
            multi: true
        });

    },

    updateCachedValues() {

        // update all projects at bottom of tree (which should in turn update their parents)
        Projects.find().forEach((project) => {
            Projects.updateActionsCachedStatus(project);
            
            if ( project.getChildren().count() == 0 ) {
                Projects.updateCachedValuesForProject(project);
            }
        });

        // update all users
        Meteor.users.find().forEach((user) => {
            console.log(`Updating ${user.initials}`);
            Meteor.users.updateCachedValuesForUser(user);
        });

    }

}

function _getDate(dateStr) {
    if (!dateStr) return null;
    // TODO: more validation?
    return moment(dateStr, 'YYYY-MM-DD').toDate()
}

function _getUserIdByInitials(initialsStr, skipCreation) {
    if (!initialsStr) return null;

    // trim white space and invalid characters
    initialsStr = initialsStr.replace('\r', '');
    initialsStr = initialsStr.replace('\n', '');
    initialsStr = initialsStr.replace('(', '');
    initialsStr = initialsStr.replace(')', '');
    initialsStr = initialsStr.trim()

    // pick first user if multiple are listed

    if      (_.contains(initialsStr, "/")) initials = initialsStr.split("/")[0];
    else if (_.contains(initialsStr, ",")) initials = initialsStr.split(",")[0];
    else    initials = initialsStr

    // sanitise capitalisation
    initials = _.reduce(_.clone(initials), (result, elem, index)  => {
        return result += (index<2) ? elem.toUpperCase() : elem.toLowerCase();
    }, "");

    // special cases
    Opms_Exceptions.special_initials.forEach((special) => {
        if (initials.toUpperCase() === special.toUpperCase()) initials = special;
    });

    // returns userId for mongo query (creating user if necessary)
    let user = Meteor.users.findOne({ initials });

    if (user) 
        return user._id;

    if (skipCreation) {
        console.log('ERROR: NO USER FOUND (and skipCreation is true)');
        return;
    }

    // no user found, need to create - this will be a dummy user without password
    // TODO: could remove this, and require users to be created in import file
    console.log("creating user", initials);
    let userId = Accounts.createUser({
        username: initials,
        // todo: import username like rsands, etc (look up from json file)
        // todo: import email (look up from json file)
        // nb: ** profile is used in onCreateUser to add fields as top-level **
        profile: { 
            initials: initials
        }
    });
    return userId;
}

function _getUserIdByTimeRecord(personStr) {

    let personStrArr = personStr.split(" ");
    let initials = `${personStrArr[0][0]}${personStrArr[1][0]}`;
    
    // special cases
    Opms_Exceptions.time_person_initials.forEach((tpi) => {
        if (tpi.person == personStr) initials = tpi.initials;
    });    

    return _getUserIdByInitials(initials);

}

function _getProgressFromStatus(status) {
    if (!status) return 0;

    switch (status.toUpperCase()) {
        case Enums.ProjectActionsStatuses.NS:
            return 0;
        case Enums.ProjectActionsStatuses.CO:
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

