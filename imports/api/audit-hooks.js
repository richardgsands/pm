export default AuditHooks = function(collection) {

    collection.before.insert((userId, doc) => {
        if (doc._NO_AUDIT) {
            delete doc._NO_AUDIT;
            return
        }
        
        doc._createdAt = Date.now();
        doc._createdBy = userId;
    });

    collection.before.update((userId, doc, fieldNames, modifier, options) => {
        modifier.$set = modifier.$set || {};

        if (modifier.$set._NO_AUDIT) {
            delete modifier.$set._NO_AUDIT;
            return
        }

        modifier.$set._updatedAt = Date.now();
        modifier.$set._updatedBy = userId;
    });

}