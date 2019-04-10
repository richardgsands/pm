import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import AuditHooks from '../audit-hooks';
import ApiCommon from '../api-common';
import Enums from './enums';

export default ProjectGates = new Mongo.Collection('projectGates');

ProjectGates.gate1schema = new SimpleSchema({

    gate1TargetDate: {
        type: Date,
        autoform: ApiCommon.AutoformBootstrapDatepickerDef(),
        optional: true
    },

    somethingForGate1: {
        type: String,
        allowedValues: Object.keys(Enums.ProjectActionsStatuses),
        autoform: ApiCommon.AutoformHashPickerDef(Enums.ProjectActionsStatuses, { type: 'select-radio', template: 'buttonGroup' })
    }

});

ProjectGates.gate2schema = new SimpleSchema({

    somethingForGate2: {
        type: String,
        allowedValues: Object.keys(Enums.ProjectActionsStatuses),
        autoform: ApiCommon.AutoformHashPickerDef(Enums.ProjectActionsStatuses, { type: 'select-radio', template: 'buttonGroup' })
    }

});

ProjectGates.gate3schema = new SimpleSchema({

    somethingForGate3: {
        type: String,
        allowedValues: Object.keys(Enums.ProjectActionsStatuses),
        autoform: ApiCommon.AutoformHashPickerDef(Enums.ProjectActionsStatuses, { type: 'select-radio', template: 'buttonGroup' })
    }

});

ProjectGates.gate4schema = new SimpleSchema({

    somethingForGate4: {
        type: String,
        allowedValues: Object.keys(Enums.ProjectActionsStatuses),
        autoform: ApiCommon.AutoformHashPickerDef(Enums.ProjectActionsStatuses, { type: 'select-radio', template: 'buttonGroup' })
    }

});

ProjectGates.schema = new SimpleSchema({

    gate1: ProjectGates.gate1schema,
    gate2: ProjectGates.gate2schema,
    gate3: ProjectGates.gate3schema,
    gate4: ProjectGates.gate4schema

});

AuditHooks(ProjectGates);