import ProjectActions from '../collections/projectActions.js';
import Tabular from 'meteor/aldeed:tabular';
import moment from 'moment';

new Tabular.Table({
  name: "ProjectActions",
  collection: ProjectActions,
  columns: [
    {data: "status", title: "Status"},
    {data: "action", title: "Action"},
    {data: "effort", title: "Effort (days)"},
    {data: "getOwner().displayName()", title: "Owner"},
    {
      data: "dueDate",
      title: "Due Date",
      render: function (val, type, doc) {
        if (val instanceof Date) {
          return moment(val).format("DD/MM/YYYY");
        } else {
          return "(None))";
        }
      }
    }
  ],
  extraFields: ['projectId', 'owner']
});