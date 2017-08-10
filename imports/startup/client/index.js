// Import client startup through a single index entry point

import './routes.js';
import './common-helpers.js';

// datatables theme

import { $ } from 'meteor/jquery';
import dataTablesBootstrap from 'datatables.net-bs';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
dataTablesBootstrap(window, $);