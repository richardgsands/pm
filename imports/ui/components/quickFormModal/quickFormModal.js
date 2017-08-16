import './quickFormModal.html';

Template.quickFormModal.onCreated(function() {

});

Template.quickFormModal.helpers({

    // delete button
    onSuccess: function () {
        return function (result) { 
            Modal.hide('quickFormModal');
        };
    }

})