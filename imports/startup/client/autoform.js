
// collapse all action panels on any successful autoform submission
// todo: make less general (somehow...)

AutoForm.addHooks(null, {
    onSuccess: (formType, result) => {
        $(`.collapse.action`).collapse('hide')
    }
}, true);