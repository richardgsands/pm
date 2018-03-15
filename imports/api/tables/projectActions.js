import ProjectActions from '../collections/projectActions.js';
import Tabular from 'meteor/aldeed:tabular';
import moment from 'moment';

new Tabular.Table({
  name: "ProjectActions",
  collection: ProjectActions,
  columns: [
    {data: "status", title: "Status"},
    {data: "description", title: "Action"},
    {data: "effort", title: "Effort (days)"},
    {data: "(o = this.getOwner()) ? o.displayName() : (No owner)", title: "Owner"},
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
  extraFields: ['projectId', 'ownerId', '_order', 'milestone'],  // NB: data for edit form is dependent on subscription created by table, 
                                                                // i.e. include all fields that need to be fetched for edit form in columns or extraFields

  // DataTables options
  paging: false,
});