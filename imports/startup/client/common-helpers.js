Template.registerHelper('renderIf', (cond, str) => {
    return (cond) ? str : null;
});

Template.registerHelper('renderUnless', (cond, str) => {
    return (!cond) ? str : null;
});

// extensions to raix handlebars helpers
Template.registerHelper('$concat', (a, b) => {
    return a + b;
});

Template.registerHelper('isActive', (a, b) => {
  return (a === b) ? " active" : null;
});