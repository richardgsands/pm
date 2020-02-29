import { Accounts } from 'meteor/accounts-base';

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY",
    extraSignupFields: [{
        fieldName: 'firstName',
        fieldLabel: 'First name',
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
            if (!value) {
                errorFunction("Please complete all fields");
                return false;
            } else {
                return true;
            }
        }
    }, {
        fieldName: 'lastName',
        fieldLabel: 'Last name',
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
            if (!value) {
                errorFunction("Please complete all fields");
                return false;
            } else {
                return true;
            }
        }            
    }, {
        fieldName: 'initials',
        fieldLabel: 'Initials',
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
            if (!value) {
                errorFunction("Please complete all fields");
                return false;
            } else {
                return true;
            }
        }            
    }, {
        fieldName: 'department',
        fieldLabel: 'Department',

        inputType: 'select',
        showFieldLabel: true,
        empty: 'Please select your department',
        data: [{
            id: '1',
            label: 'AE',
            value: 'AE'
          }, {
            id: 2,
            label: 'RD',
            value: 'RD',
        }],

        visible: true,
        validate: function(value, errorFunction) {
            if (!value) {
                errorFunction("Please complete all fields");
                return false;
            } else {
                return true;
            }
        }            
    }]
});
