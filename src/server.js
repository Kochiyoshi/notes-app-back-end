'use strict';

const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {

    const server = Hapi.server({
        host: 'localhost',
        port: 5000,
        routes: {
            cors: {
              origin: ['http://notesapp-v1.dicodingacademy.com'],
            }
          }
    });

    server.route(routes);

    await server.start();
    console.log(`server running in ${server.info.uri}`);
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();