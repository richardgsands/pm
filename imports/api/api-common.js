export default ApiCommon = {
    
    AutoformHashPickerDef(object, options) {
        options = options || {};

        return _.extend({
            type: 'select2',
            options: function() {
                return Object.keys(object).map(key => {
                    return { label: `${key} (${object[key]})`, value: key }
                });
            }
        }, options);
    },

    AutoformCollectionPickerDef(collection, labelProperty, options) {
        options = options || {};

        return _.extend({
            type: 'select2',
            options: function() {
                return collection.find({}).map(function(doc) {
                    debugger;
                    return { label: doc[labelProperty], value: doc._id };
                });
            }
        }, options);
    },

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
            },
            select2Options: {
                width: '50%'
            }
        };
    }

} 