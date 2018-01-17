import './gantt.html';

Template.gantt.onRendered(function() {
    gantt.init("gantt_container");
});

Template.gantt.helpers({

    ganttData(projects) {
        let ganttTasks = [];

        projects.forEach((p) => {

            ganttTasks.push({
                id: p._id,
                text: p.displayCodeAndName(),
                start_date: moment(p.start_date).format("YYYY-MM-DD hh:mm:ss"),
                duration: p.effort || 1,
                progress: p.progress,
                parent: null
            })

        });

    }

});
