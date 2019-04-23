import { Meteor } from 'meteor/meteor';
import Tabular from 'meteor/aldeed:tabular';
// import Projects from '../collections/projects';
import ApiCommon from '../api-common';

// import stuff form client needed for table rendering
if (Meteor.isClient) {
  require('/imports/ui/components/autoFormInput/autoFormInput.js');
}

let renderFn = function (val, type, doc) {
  return val && val.toFixed(1)
}

new Tabular.Table({
  name: "Resourcing",
  collection: Meteor.users,
  pub: "users.all",
  columns: [
    { data: 'initials', title: 'Initials' },
    { data: '_effortByWeek.0.actualLogged' , title: 'This week (logged)',            render: renderFn },
    { data: '_effortByWeek.0.estimatedCompleted' , title: 'This week (completed)',   render: renderFn },
    { data: '_effortByWeek.0.estimatedTotal', title: 'This week (total)',            render: renderFn },
    { data: '_effortByWeek.0.actualLogged' , title: 'This month (logged)',           render: renderFn },
    { data: '_effortByMonth.0.estimatedCompleted' , title: 'This month (completed)', render: renderFn },
    { data: '_effortByMonth.0.estimatedTotal', title: 'This month (total)',          render: renderFn },
    { data: '_effortByMonth.1.estimatedTotal' , title: 'Next month (total)',         render: renderFn },
    { data: '_effortByMonth.2.estimatedTotal' , title: 'Next month + 1 (total)',     render: renderFn },
  ],
  // extraFields: [ "projectManagerId", "startDate" ]
});
