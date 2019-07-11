import './timeline.html';
import moment from 'moment';
import { Random } from 'meteor/random';

Template.timeline.onCreated(function() {
    this.id = Random.id()
})

Template.timeline.onRendered(function() {

    // DOM element where the Timeline will be attached
    var container = document.getElementById(`visualization_${this.id}`);

    // Configuration for the Timeline
    var options = {
        selectable: false,
        showTooltips: true,
        tooltip: {
            followMouse: true
        }
    };

    this.autorun(() => {

        actions = this.data.actions;
        if (!actions)
        {
            container.innerHTML = "<p>Loading...</p>";
        }
        else if (actions.count() === 0) 
        {
            container.innerHTML = "<p>No actions with due dates / effort to display</p>";
        }
        else 
        {
            // console.clear()
            // actions.forEach(a => {
            //     console.log(a.getProject().code, a.description, a.effort, a.dueDate);
            // });

            // debugger
            let actionsWithDate = []
            actions.forEach(a => {
                if (!a.dueDate || 
                    !a.effort)

                    return
                actionsWithDate.push(a);
            })

            if (actionsWithDate.length === 0) 
            {
                container.innerHTML = "<p>No actions with due dates / effort to display</p>";
                return
            }

            // Create a DataSet (allows two way data-binding)
            var items = new vis.DataSet(actionsWithDate.map((a, i) => {
                let end   = moment(a.dueDate).format('YYYY-MM-DD')
                let start = moment(a.dueDate).add(-a.effort, 'd').format('YYYY-MM-DD')
                return { 
                    id: i, 
                    content: `${a.getProject().code}: ${a.description}`, 
                    title: `<b>${a.getProject().code}</b><br/><span>${a.description}</span>`,
                    start, 
                    end} 
            }))

            // Create a Timeline
            container.innerHTML = "";
            var timeline = new vis.Timeline(container, items, options);
        } 

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
    id: () => Template.instance().id
});
