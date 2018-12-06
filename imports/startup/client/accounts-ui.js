import { Accounts } from 'meteor/accounts-base';

Accounts.ui.config({
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
    }]
});
