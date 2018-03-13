const port = 8090;
const server = require('./libraries/server.js')(port);
const defaultPage = require('./pages/defaultPage');

server.assets('assets');
server.libraries([
  'bootstrap'
]);

server.get('/', defaultPage);

server.init();
server.run();
