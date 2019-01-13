// TODO: maybe move this to a 'project' component which is rendered once project page subscriptions are ready?
import './relatedProjects.html';

Template.relatedProjects.onRendered(function() {
    $('[data-toggle="tooltip"]').tooltip({placement: 'bottom'});
});