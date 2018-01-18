import './gantt.html';
import moment from 'moment';

Template.gantt.onRendered(function() {
    gantt.init("gantt_container");

    let projects = [ this.data ];
    gantt.parse({ data: _getGanttDataForProjects(projects) });

});

Template.gantt.helpers({



});

function _getGanttDataForProjects(projects) {
    let ganttTasks = [];
    debugger
    projects.forEach((p) => {
        ganttTasks.push({
            id: p._id,
            text: p.displayCodeAndName(),
            start_date: moment(p.start_date).format("DD-MM-YYYY"),
            duration: p.effort || 1,
            progress: p.progress,
            parent: null
        })
    });
    return ganttTasks;
}