import Projects from '../collections/projects';
import Tabular from 'meteor/aldeed:tabular';

new Tabular.Table({
  name: "Projects",
  collection: Projects,
  pub: "tabular_Projects",
  columns: [
    {data: "priority", title: "Pri"},
    {data: "code", title: "Project Code"},
    {data: "name", title: "Project Name"},
    {data: "(d = startDate) ? d.toDateString()", title: "Plan Start"},           // todo: use getStartDate() ?
    // {data: "startDate", title: "Plan Start"},           // todo: use getStartDate() ?
    // {data: "completionDate", title: "Plan Complete"},   // todo: use getEndDate()   ?
    {data: "(o = this.getProjectManager()) ? o.displayInitials() : (No PM)", title: "Project Manager"},
    {data: "(o = this.getProjectManager()) ? o.displayInitials() : (No board)", title: "Project Board"},
    {data: "getEffort()", title: "Effort Days"}
  ],
  extraFields: [ "projectManagerId", "startDate" ]
});
