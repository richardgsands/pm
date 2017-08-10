import './project.html';
import Projects from '/imports/api/collections/projects.js';

Template.App_project.onCreated(function() {
    this.getProjectCode = () => FlowRouter.getParam('projectCode');

    this.autorun(() => {
        let projectCode = this.getProjectCode();
        if (projectCode) this.subscribe('projects.projectCode', projectCode);
    });
});

Template.App_project.helpers({

    project() {
        return Projects.findOne({ projectCode: Template.instance().getProjectCode() })
    }

});