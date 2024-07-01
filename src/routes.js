const express = require('express');
const { gsmDataReceiveHandler, gsmDataSendHandler, gsmDataDiffSendHandler, gsmSendAllFloodHistoryDataByIdHandler } = require('./gsmHandler');
const statusHandler = require('./statusHandler');

const router = express.Router();

// Define the routes
router.get('/', (req, res) => {
    console.log("Backend service running normally");
    res.send("Backend service running normally");
});

router.post('/gsmData', gsmDataReceiveHandler);
router.get('/gsmData', gsmDataSendHandler);

router.get('/floodHistory/:id', gsmSendAllFloodHistoryDataByIdHandler);

router.get('/diffData', gsmDataDiffSendHandler);

router.get('/statusData', statusHandler);

module.exports = router;
