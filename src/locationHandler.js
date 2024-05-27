const locationDataBase = require('./locationDataBase');
const placeDataBase = require('./placeDataBase');
const { v4: uuidv4 } = require('uuid');
const handlerStatus = require('./status');
const { getGMT7Date } = require('./gsmHandler');

async function locationReceiveHandler (req, res) {
    try {
        const { Loc_latitude, loc_longitude, loc_address, loc_city } = req.body;

        const locID = uuidv4().slice(0, 16);

        const locData = {
            locID, Loc_latitude, loc_longitude, loc_address, loc_city,
        };

        locationDataBase.push(locData);

        // Send status handler to the database
        const statusMSG = 'Location data successfully received';
        const time = getGMT7Date().toString();
        const statusId = crypto.randomUUID();

        const gsmStatus = {
            statusMSG, time,
        };
        await storeDataStatus(statusId, gsmStatus);

        // Response
        res.status(200).json({
            status: 'success',
            message: statusMSG,
        });
    } catch (error) {
        // Send status handler to the database
        handleFailure('Failed to receive location data', error, res);
    }
};

async function locationSendHandler (req, res) {
    try {
        // Send status handler to the database
        const statusMSG = 'Location data successfully sent';
        const time = new Date().toString();
        const statusId = crypto.randomUUID();

        const gsmStatus = {
            statusMSG, time,
        };
        await storeDataStatus(statusId, gsmStatus);

        // Response
        res.status(200).json({
            status: 'success',
            message: statusMSG,
            data: locationDataBase,
        });
    } catch (error) {
        // Send status handler to the database
        handleFailure('Failed to send location data', error, res);
    }
};

const placeReceiveHandler = (req, res) => {
    try {
        const { name, category } = req.body;

        const placeID = uuidv4().slice(0, 16);

        const placeData = {
            placeID, name, category,
        };

        placeDataBase.push(placeData);

        // Send status handler to the database
        const statusMSG = 'Place data successfully received';
        const time = new Date().toString();

        const gsmStatus = {
            statusMSG, time,
        };
        handlerStatus.push(gsmStatus);

        // Response
        res.status(200).json({
            status: 'success',
            message: statusMSG,
            data: placeDataBase,
        });
    } catch (error) {
        // Send status handler to the database
        handleFailure('Failed to receive place data', error, res);
    }
};

const placeSendHandler = (req, res) => {
    try {
        // Send status handler to the database
        const statusMSG = 'Place data successfully sent';
        const time = new Date().toString();

        const gsmStatus = {
            statusMSG, time,
        };
        handlerStatus.push(gsmStatus);

        // Response
        res.status(200).json({
            status: 'success',
            message: statusMSG,
            data: placeDataBase,
        });
    } catch (error) {
        // Send status handler to the database
        handleFailure('Failed to send place data', error, res);
    }
};

const handleFailure = (statusMSG, error, res) => {
    // Send status handler to the database
    const time = getGMT7Date().toString();
    const statusId = crypto.randomUUID();

    const statusData = { statusMSG, time };
    storeDataStatus(statusId, statusData);

    // Response
    res.status(500).json({
        status: 'fail',
        message: statusMSG,
        error: error.message,
    });
};

module.exports = {
    locationReceiveHandler,
    locationSendHandler,
    placeReceiveHandler,
    placeSendHandler,
};
