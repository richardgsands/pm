// TODO: pull request to https://github.com/jankapunkt/meteor-autoform-hint

// NB: this will override autoform template, so should be kept in line with:
// https://github.com/aldeed/meteor-autoform/blob/master/templates/bootstrap3-horizontal/components/afFormGroup/afFormGroup.html

import { Template } from 'meteor/templating'

import './autoform-hint.html'

Template.registerHelper('afHintTop', function (target) {
  const context = (target || this)
  return context.afFieldInputAtts.hintTop || context.afFieldInputAtts.hint
})

Template.registerHelper('afHintBottom', function (target) {
  const context = (target || this)
  return context.afFieldInputAtts.hintBottom
})

Template.registerHelper('afHintDropdown', function (target) {
    const context = (target || this)
    return context.afFieldInputAtts.hintTop || context.afFieldInputAtts.hint
  })
  

// // Helper shim to override template renderFunctions
// // Inspired by replaces() from aldeed:template-extension package. Good stuff.
// Template.prototype._override = function (replacement) {
//   if (typeof replacement === 'string') {
//     replacement = Template[ replacement ]
//   }
//   if (replacement && replacement instanceof Blaze.Template) {
//     this.renderFunction = replacement.renderFunction
//   }
// }

// Template.afFormGroup_bootstrap3._override('afFormGroup_hint3')
// Template.afFormGroup_bootstrap4._override('afFormGroup_hint4')
Template.afFormGroup_bootstrap3._override('afFormGroup_bs3horiz_hint');