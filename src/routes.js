const { registerUserHandler, loginUserHandler } = require('./userHandler');
const { gsmDataHandler } = require('./gsmHandler');

const routes = [
    {
        method: 'POST',
        path: '/register',
        handler: registerUserHandler,
    },
    {
        method: 'POST',
        path: '/login',
        handler: loginUserHandler,
    },
    {
        method: 'POST',
        path: '/gsm-data',
        handler: gsmDataHandler,
    },
];

module.exports = routes;