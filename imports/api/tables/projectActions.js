import ProjectActions from '../collections/projectActions.js';
import ApiCommon from '../api-common';
import Tabular from 'meteor/aldeed:tabular';
import moment from 'moment';

new Tabular.Table({
  name: "ProjectActions",
  collection: ProjectActions,
  order: [[0, "asc"]],
  columns: [
    {data: "_order", visible: false},   // for sorting
    {data: "status", title: "Status"},
    ApiCommon.TabularGetColumn('description', 'Action'),
    {data: "description", title: "Action"},
    {data: "effort", title: "Effort (days)"},
    {
      data: "owner",
      title: "Owner",
      render: function (val, type, doc) {
        return ( o = doc.getOwner() ) ? o.displayInitials() : "(No owner)";
      }
    },
    {
      data: "dueDate",
      title: "Due",
      render: function (val, type, doc) {
        if (val instanceof Date) {
          return moment(val).format("DD/MM/YYYY");
        } else {
          return "(None)";
        }
      }
    },
    {
      data: "completedDate",
      title: "Completed",
      render: function (val, type, doc) {
        if (val instanceof Date) {
          return moment(val).format("DD/MM/YYYY");
        } else {
          return "(None)";
        }
      }
    }
  ],
  extraFields: ['projectId', 'ownerId', '_order', 'milestone', 'gateId'],  // NB: data for edit form is dependent on subscription created by table, 
                                                                           // i.e. include all fields that need to be fetched for edit form in columns or extraFields

  // DataTables options
  paging: false,
  stateSave: false
});