import './timeline.html';
import moment from 'moment';

Template.timeline.onRendered(function(template) {

    // DOM element where the Timeline will be attached
    var container = document.getElementById('visualization');

    // Configuration for the Timeline
    var options = {
        selectable: false,
        showTooltips: true,
        tooltip: {
            followMouse: true
        }
    };

    this.autorun(() => {

        actions = Template.instance().closest('App_mytasks').getAllActionsOutstanding()
        if (!actions) return
        console.log('actions count', actions.count())

        // debugger
        let actionsWithDate = []
        actions.forEach(a => {
            if (!a.dueDate || 
                !a.effort)

                return
            actionsWithDate.push(a);
        })

        // Create a DataSet (allows two way data-binding)
        var items = new vis.DataSet(actionsWithDate.map((a, i) => {
            let end   = moment(a.dueDate).format('YYYY-MM-DD')
            let start = moment(a.dueDate).add(-a.effort, 'd').format('YYYY-MM-DD')
            return { 
                id: i, 
                content: a.description, 
                title: a.description,
                start, 
                end} 
        }))

        // Create a Timeline
        container.innerHTML = "";
        var timeline = new vis.Timeline(container, items, options);

    });                




    // var items = new vis.DataSet([
    // {id: 1, content: 'item 1', start: '2013-04-20'},
    // {id: 2, content: 'item 2', start: '2013-04-14'},
    // {id: 3, content: 'item 3', start: '2013-04-18'},
    // {id: 4, content: 'item 4', start: '2013-04-16', end: '2013-04-19'},
    // {id: 5, content: 'item 5', start: '2013-04-25'},
    // {id: 6, content: 'item 6', start: '2013-04-27'}
    // ]);



});

Template.timeline.helpers({

});
