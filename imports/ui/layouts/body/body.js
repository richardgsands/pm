import './body.html';

Template.body.onCreated(function() {
    this.subscribe('users.all');
});