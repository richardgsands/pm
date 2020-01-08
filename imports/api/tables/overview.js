import Tabular from 'meteor/aldeed:tabular';
import Projects from '../collections/projects';
import ApiCommon from '../api-common';

// import stuff form client needed for table rendering
if (Meteor.isClient) {
  require('/imports/ui/components/autoFormInput/autoFormInput.js');
}

let renderFn = function (val, type, doc) {
  return val && val.toFixed(1)
}

new Tabular.Table({
  name: "Overview",
  collection: Projects,
  pub: "tabular_Projects",
  order: [[0, "asc"]],
  columns: [
    ApiCommon.TabularGetColumn('code', 'Code'),
    ApiCommon.TabularGetColumn('name', 'Name'),
    {data: "getProjectManagerInitials()", title: "Project Manager"},
    { data: '_effortWithChildrenByHalf.0.actualLogged',       title: 'H1 Actual Logged'         , render: renderFn },
    { data: '_effortWithChildrenByHalf.0.estimatedCompleted', title: 'H1 Estimated (Completed)' , render: renderFn },              // TODO: don't hardcode H1!
    { data: '_effortWithChildrenByHalf.0.estimatedTotal',     title: 'H1 Estimated (Total)'     , render: renderFn },
  ],
  extraFields: [ "projectManagerId", "startDate" ]
});

