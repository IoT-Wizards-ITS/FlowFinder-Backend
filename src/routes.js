const { gsmDataHandler } = require('./gsmHandler');

const routes = [
    {
        method: 'POST',
        path: '/gsm-data',
        handler: gsmDataHandler,
    },
];

module.exports = routes;