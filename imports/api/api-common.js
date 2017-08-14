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
                    return { label: `${project.projectCode} (${project.projectName})`, value: project._id };
                });
            }
        };
    }

} 