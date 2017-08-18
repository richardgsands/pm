import Projects from '../collections/projects';
import Tabular from 'meteor/aldeed:tabular';

new Tabular.Table({
  name: "Projects",
  collection: Projects,
  columns: [
    {data: "code", title: "Project Code"},
    {data: "name", title: "Project Name"}
  ]
});