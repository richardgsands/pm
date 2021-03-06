import Tabular from 'meteor/aldeed:tabular';
import Projects from '../collections/projects';
import ApiCommon from '../api-common';

// import stuff form client needed for table rendering
if (Meteor.isClient) {
  require('/imports/ui/components/autoFormInput/autoFormInput.js');
}

new Tabular.Table({
  name: "Projects",
  collection: Projects,
  pub: "tabular_Projects",
  columns: [
    ApiCommon.TabularGetColumn('code', 'Code'),
    ApiCommon.TabularGetColumn('name', 'Name'),
    ApiCommon.TabularGetColumn('priority', 'Pri'),
    ApiCommon.TabularGetColumn('status', 'Status'),
    ApiCommon.TabularGetColumn('starred', 'Starred'),
    ApiCommon.TabularGetColumn('startDate', 'Plan Start', 'getStartDateHuman()'),
    // {
    //   data: "getStartDateHuman()", 
    //   title: "Plan Start"
    // },           // todo: use getStartDate() ?
    // {data: "(d = startDate) ? d.toDateString()", title: "Plan Start"},           // todo: use getStartDate() ?
    // {data: "startDate", title: "Plan Start"},           // todo: use getStartDate() ?
    // {data: "completionDate", title: "Plan Complete"},   // todo: use getEndDate()   ?
    {data: "getProjectManagerInitials()", title: "Project Manager"},
    // {data: "(o = getProjectManager()) ? o.displayInitials() : (No PM)", title: "Project Manager"},
    {data: "_effortWithChildren", title: "Effort Days"}
  ],
  extraFields: [ "projectManagerId", "startDate" ]
});
