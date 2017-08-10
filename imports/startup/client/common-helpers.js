Template.registerHelper('renderIf', (cond, str) => {
    return (cond) ? str : null
});

Template.registerHelper('renderUnless', (cond, str) => {
    return (!cond) ? str : null
});

// flow router

Template.registerHelper('groupRoutes', function (groupName) {  
  FlowRouter.watchPathChange();
  groupName = groupName || FlowRouter.current().route.group && FlowRouter.current().route.group.name;
  return _.filter(FlowRouter._routes, function (route) {
    return route.group && route.group.name === groupName;
  });
})