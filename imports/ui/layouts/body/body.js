import './body.html';

Template.body.onCreated(function() {
    console.log('body created');
    this.subscribe('users.all');
});