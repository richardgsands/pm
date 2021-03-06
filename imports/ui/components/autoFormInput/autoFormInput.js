import './autoFormInput.html'
import { ReactiveVar } from 'meteor/reactive-var';

Template.autoFormInput.onCreated(function() {
    let data = this.data;
    data.autoformId = `${data.doc._id}_${data.data}`;

    this.editing = new ReactiveVar(false);
});

Template.autoFormInput.helpers({

    editing: () => Template.instance().editing.get(),

    displayValue: () => {

        if (helper = Template.instance().data.helper)
            return eval(`Template.instance().data.doc.${helper}`);
        else
            return Template.instance().data.doc[Template.instance().data.data];
            
    }

});

Template.autoFormInput.events({

    'click .editable, focus .editable': function(event, template) {
        console.log('click');
        template.editing.set(true);
    },

    // TODO: this may need to be done at higher level for better UX
    'blur .editable': function(event, template) {
        console.log('unclick');
        template.editing.set(false);
    }

});