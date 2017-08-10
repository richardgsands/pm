import Projects from '../collections/projects';
import Tabular from 'meteor/aldeed:tabular';

new Tabular.Table({
  name: "Projects",
  collection: Projects,
  columns: [
    {data: "projectCode", title: "Project Code"},
    {data: "projectName", title: "Project Name"}
  ]
});