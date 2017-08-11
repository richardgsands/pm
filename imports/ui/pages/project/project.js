import './project.html';
import Projects from '/imports/api/collections/projects.js';

Template.App_project.onCreated(function() {
    this.getProjectCode = () => FlowRouter.getParam('projectCode');

    this.autorun(() => {
        console.log('autorun')
        let projectCode = this.getProjectCode();
        if (projectCode) {
            const s = this.subscribe('projects.projectCode', projectCode);
            if (s.ready()) {
                console.log('> subs ready')
                debugger;
                this.data = this.data || {};
                this.data.project = Projects.findOne({ projectCode: Template.instance().getProjectCode() });
            }
        }
    });

});

Template.App_project.helpers({

    // project() {
    //     return Projects.findOne({ projectCode: Template.instance().getProjectCode() })
    // }

});