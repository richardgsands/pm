import Projects from '../api/projects';
import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';

new Tabular.Table({
  name: "Projects",
  collection: Projects,
  columns: [
    {data: "projectCode", title: "Project Code"},
    {data: "projectName", title: "Project Name"}
  ]
});