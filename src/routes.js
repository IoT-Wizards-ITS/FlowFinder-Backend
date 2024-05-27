const express = require('express');
const { gsmDataReceiveHandler, gsmDataSendHandler } = require('./gsmHandler');
const { locationReceiveHandler, locationSendHandler, placeReceiveHandler, placeSendHandler } = require('./locationHandler');
const statusHandler = require('./statusHandler');

const router = express.Router();

// Define the routes
router.get('/', (req, res) => {
    console.log("Backend service running normally");
    res.send("Backend service running normally");
});

router.post('/gsmData', gsmDataReceiveHandler);
router.get('/gsmData', gsmDataSendHandler);

router.post('/locationData', locationReceiveHandler);
router.get('/locationData', locationSendHandler);

router.post('/placeData', placeReceiveHandler);
router.get('/placeData', placeSendHandler);

router.get('/statusData', statusHandler);

module.exports = router;
