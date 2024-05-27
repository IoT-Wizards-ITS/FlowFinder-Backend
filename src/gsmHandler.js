const { handleFailure } = require("./locationHandler");
const { storeDataSensor, storeDataStatus } = require("./db/storeData");
const crypto = require('crypto');
const { getLatestSensorData } = require("./db/getData");

async function gsmDataReceiveHandler(req, res) {
    try {
        const { rawData } = req.body;
        const parsedData = parseBinaryData(rawData);
        const time = getGMT7Date().toString();
        const gsmId = crypto.randomUUID();

        const gsmData = {
            parsedData, time,
        }
        await storeDataSensor(gsmId, gsmData);

        //Kirim status handler ke database
        const statusMSG = 'Data from GSM module successfully received and processed';
        const statusId = crypto.randomUUID();
        const gsmStatus = {
            statusMSG, time,
        }
        await storeDataStatus(statusId, gsmStatus);

        //Response
        res.status(200).json({
            status: 'success',
            message: statusMSG,
        });
    } catch (error) {
        //Kirim status handler ke database
        handleFailure("Failed to receive data from GSM module", error);
        res.status(500).json({
            status: 'fail',
            message: 'Failed to receive data from GSM module',
            error: error.message,
        });
    }
};

async function gsmDataSendHandler(req, res) {
    try {
        //Kirim status handler ke database
        const statusMSG = 'Data from GSM module successfully sent';
        const time = getGMT7Date().toString();
        const statusId = crypto.randomUUID();

        const gsmStatus = {
            statusMSG,
            time,
        }
        await storeDataStatus(statusId, gsmStatus);

        //Response
        const gsmLatestData = await getLatestSensorData(1);
        res.status(200).json({
            status: 'success',
            message: statusMSG,
            data: {
                parsedData: gsmLatestData.map(item => item.parsedData),
                time: gsmLatestData.map(item=>item.time)
            },
        });
    } catch (error) {
        //Kirim status handler ke database
        handleFailure("Failed to send data from GSM module", error);
        res.status(500).json({
            status: 'fail',
            message: 'Failed to send data from GSM module',
            error: error.message,
        });
    }
};

//fungsi
function parseBinaryData(binaryData) {
    // Pisahkan 2 digit pertama sebagai ID dan 2 digit terakhir sebagai level
    const id = binaryData.slice(0, 2);
    const level = binaryData.slice(2);

    // Konversi level dari biner ke desimal
    const levelDecimal = parseInt(level, 2);

    const result = {
        id,
        level: levelDecimal + 1
    };

    return result;
};

function getGMT7Date() {
    const date = new Date();
    const utcOffset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
    const gmt7Offset = 7 * 60 * 60000; // GMT+7 offset in milliseconds
    const gmt7Date = new Date(date.getTime() + utcOffset + gmt7Offset);
    return gmt7Date;
};

module.exports = { 
    gsmDataReceiveHandler,
    gsmDataSendHandler,
    getGMT7Date,
};
