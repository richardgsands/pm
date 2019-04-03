import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import AuditHooks from '../audit-hooks';
import ApiCommon from '../api-common';

import Projects from './projects';
import ProjectActions from './projectActions';

export default ProjectGates = new Mongo.Collection('projectGates');

ProjectGates.Gates = {
    gate1: "Gate 1",
    gate2: "Gate 2",
    gate3: "Gate 3",
    gate4: "Gate 4"
}

ProjectGates.Statuses = {
    // todo: implement others (here and in projectMilestones helpers)
    NS: "Not started",
    IP: "In progress",
    CO: "Complete",
    NA: null
}

ProjectGates.gate1schema = new SimpleSchema({

    gate1TargetDate: {
        type: Date,
        autoform: ApiCommon.AutoformBootstrapDatepickerDef(),
        optional: true
    },

    somethingForGate1: {
        type: String,
        allowedValues: Object.keys(ProjectActions.Statuses),
        autoform: ApiCommon.AutoformHashPickerDef(ProjectActions.Statuses, { type: 'select-radio', template: 'buttonGroup' })
    }

});

ProjectGates.gate2schema = new SimpleSchema({

    somethingForGate2: {
        type: String,
        allowedValues: Object.keys(ProjectActions.Statuses),
        autoform: ApiCommon.AutoformHashPickerDef(ProjectActions.Statuses, { type: 'select-radio', template: 'buttonGroup' })
    }

});

ProjectGates.gate3schema = new SimpleSchema({

    somethingForGate3: {
        type: String,
        allowedValues: Object.keys(ProjectActions.Statuses),
        autoform: ApiCommon.AutoformHashPickerDef(ProjectActions.Statuses, { type: 'select-radio', template: 'buttonGroup' })
    }

});

ProjectGates.gate4schema = new SimpleSchema({

    somethingForGate4: {
        type: String,
        allowedValues: Object.keys(ProjectActions.Statuses),
        autoform: ApiCommon.AutoformHashPickerDef(ProjectActions.Statuses, { type: 'select-radio', template: 'buttonGroup' })
    }

});

ProjectGates.schema = new SimpleSchema({

    gate1: ProjectGates.gate1schema,
    gate2: ProjectGates.gate2schema,
    gate3: ProjectGates.gate3schema,
    gate4: ProjectGates.gate4schema

});