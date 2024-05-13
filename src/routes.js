const { gsmDataReceiveHandler, gsmDataSendHandler } = require('./gsmHandler');
const { locationReceiveHandler, locationSendHandler, placeReceiveHandler, placeSendHandler } = require('./locationHandler');
const statusHandler = require('./statusHandler');

const routes = [
    {
        method: 'POST',
        path: '/gsmData',
        handler: gsmDataReceiveHandler,
    },
    {
        method: 'GET',
        path: '/gsmData',
        handler: gsmDataSendHandler,
    },
    {
        method: 'POST',
        path: '/locationData',
        handler: locationReceiveHandler,
    },
    {
        method: 'GET',
        path: '/locationData',
        handler: locationSendHandler,
    },
    {
        method: 'POST',
        path: '/placeData',
        handler: placeReceiveHandler,
    },
    {
        method: 'GET',
        path: '/placeData',
        handler: placeSendHandler,
    },
    {
        method: 'GET',
        path: '/statusData',
        handler: statusHandler,
    },
];

module.exports = routes;