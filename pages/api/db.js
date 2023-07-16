import proxy from 'json-server/dist/cli/run.js';

// Run JSON Server
proxy({
    source: 'db.json',
    routes: 'routes.json',
});