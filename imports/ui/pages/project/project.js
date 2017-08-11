import './project.html';
import Projects from '/imports/api/collections/projects.js';

Template.App_project.onCreated(function() {

    // subscribe

    this.getProjectCode = () => FlowRouter.getParam('projectCode');
    this.autorun(() => {
        console.log('autorun')
        let projectCode = this.getProjectCode();
        if (projectCode) {
            const s = this.subscribe('project.projectCode.joins', projectCode);
            if (s.ready()) {
                console.log('> subs ready')
                this.data = this.data || {};
                this.data.project = Projects.find({ projectCode: Template.instance().getProjectCode() });
            }
        }
    });

    // set up sub naviation
    this.navStates = [
        { query: 'tor', template: 'project_tor', label: 'TOR' },
        { query: 'outcomes', template: 'project_outcomes', label: 'Outcomes' },
        { query: 'actions', template: 'project_actions', label: 'Actions' },
        { query: 'people', template: 'project_people', label: 'People' },
        { query: 'money', template: 'project_money', label: 'Money' },
        { query: 'status', template: 'project_status', label: 'Status' }
    ];

});

Template.App_project.helpers({

    project() {
        return Projects.findOne({ projectCode: Template.instance().getProjectCode() })
    },

    navStates() {
        return Template.instance().navStates;
    },

    isActiveNavState(navState) {
        // FlowRouter.watchPathChange();
        return navState.query === FlowRouter.getQueryParam('section');
    },

    subTemplate() {
        // FlowRouter.watchPathChange();
        navState = _.findWhere(Template.instance().navStates, { query: FlowRouter.getQueryParam('section') })
                        || Template.instance().navStates[0];

        return navState.template;
    }
});