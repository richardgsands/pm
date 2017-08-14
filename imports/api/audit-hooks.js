export default AuditHooks = function(collection) {

    collection.before.insert((userId, doc) => {
        doc._createdAt = Date.now();
        doc._createdBy = userId;
    });

    collection.before.update((userId, doc, fieldNames, modifier, options) => {
        modifier.$set = modifier.$set || {};
        modifier.$set._updatedAt = Date.now();
        modifier.$set._updatedBy = userId;
    });

}