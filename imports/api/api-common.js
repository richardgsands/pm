export default ApiCommon = {
    
    AutoformBootstrapDatepickerDef() {
        return {
            type: "bootstrap-datepicker",
            datePickerOptions: {
                autoclose: true,
                format: "dd/mm/yyyy"
            }
        };
    },

    AutoformProjectPickerDef() {
        return {
            label: "Project Code",
            type: 'select2',
            options: function() {
                return Projects.find({}).map(function(project) {
                    return { label: `${project.code} (${project.name})`, value: project._id };
                });
            }
        };
    },
    
    AutoformUserPickerDef() {
        return {
            type: 'select2',
            options: function() {
                return Meteor.users.find({}).map(function(user) {
                    return { label: `${user.displayName()}`, value: user._id };
                });
            }
        };
    }

} 