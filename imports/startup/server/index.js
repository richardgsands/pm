// Import server startup through a single index entry point

import './register-api.js';

import ProjectActions from '/imports/api/collections/projectActions';

// todo!: partition sortable collection by projectId field
// todo!: make sortable more robust when if corrupted order sequences (i.e. duplicated order values) occur
Sortable.collections = ['projectActions'];
