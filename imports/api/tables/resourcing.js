import { Meteor } from 'meteor/meteor';
import Tabular from 'meteor/aldeed:tabular';
// import Projects from '../collections/projects';
import ApiCommon from '../api-common';

// import stuff form client needed for table rendering
if (Meteor.isClient) {
  require('/imports/ui/components/autoFormInput/autoFormInput.js');
}

new Tabular.Table({
  name: "Resourcing",
  collection: Meteor.users,
  pub: "users.all",
  columns: [
    { data: 'initials', title: 'Initials' },
    { data: '_effortByWeek.0.estimatedTodo' , title: 'This week (todo)'  },
    { data: '_effortByWeek.0.estimatedTotal', title: 'This week (total)' },
    { data: '_effortByMonth.0.estimatedTodo' , title: 'This month (todo)'  },
    { data: '_effortByMonth.0.estimatedTotal', title: 'This month (total)' },
  ],
  // extraFields: [ "projectManagerId", "startDate" ]
});
