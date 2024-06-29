//const { handleFailure } = require("./locationHandler");
const { storeDataSensor, storeDataStatus, storeDataZero, storeDataFirstLevelAfterZero } = require("./db/storeData");
const crypto = require('crypto');
const { getLatestSensorData, getLatestTimeDiff, getAllFloodTImeHistoryById, getLatestSensorDataById } = require("./db/getData");
const { calculateAndFormatTimeDifference, recordFloodIntervalTime } = require("./timeCountHandler");
const getGMT7Date = require("./timeUtils");

async function gsmDataReceiveHandler(req, res) {
    try {
        const { rawData } = req.body;
        const parsedData = parseRawData(rawData);
        console.log(parsedData);
        const gsmId = parsedData.id.toString();
        const gsmLevel = parsedData.level;
        const historyId = crypto.randomUUID();
        const time = getGMT7Date(1);

        const isLevelZeroPreviously = await getLatestSensorDataById(gsmId, 1);

        if(isLevelZeroPreviously[0].parsedData.level === 0 && gsmLevel > 0) {
            const firstLevelFloodDetected = true;
            const gsmData = {
                parsedData, time, firstLevelFloodDetected,
            }
            await storeDataFirstLevelAfterZero(gsmId, historyId, gsmData);
        }
        
        const gsmData = {
            parsedData, time,
        }
        await storeDataSensor(gsmId, historyId, gsmData);

        const timeStamp = { time };
        if(parsedData.level.toString() === "0") {
            await storeDataZero(gsmId, historyId, timeStamp);
            await recordFloodIntervalTime(gsmId, gsmLevel, time);
        }

        await calculateAndFormatTimeDifference();

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
        //handleFailure("Failed to receive data from GSM module", error);
        console.error(error);
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
        const time = getGMT7Date(1);
        const statusId = crypto.randomUUID();

        const gsmStatus = {
            statusMSG,
            time,
        }
        await storeDataStatus(statusId, gsmStatus);

        //Response
        const gsmLatestData = await getLatestSensorData();
        res.status(200).json({
            status: 'success',
            message: statusMSG,
            data: {
                parsedData: gsmLatestData
            },
        });
    } catch (error) {
        //Kirim status handler ke database
        //handleFailure("Failed to send data from GSM module", error);
        res.status(502).json({
            status: 'fail',
            message: 'Failed to send data from GSM module',
            error: error.message,
        });
    }
};

async function gsmDataDiffSendHandler(req, res) {
    try {
        //Kirim status handler ke database
        const statusMSG = 'Diff data successfully sent';
        const time = getGMT7Date(1);
        const statusId = crypto.randomUUID();

        const gsmStatus = {
            statusMSG,
            time,
        }
        await storeDataStatus(statusId, gsmStatus);

        //Response
        const latestDiffData = await getLatestTimeDiff();
        res.status(200).json({
            status: 'success',
            message: statusMSG,
            data: {
                parsedData: latestDiffData
            },
        });
    } catch (error) {
        //Kirim status handler ke database
        //handleFailure("Failed to send data from GSM module", error);
        res.status(502).json({
            status: 'fail',
            message: 'Failed to send data from GSM module',
            error: error.message,
        });
    }
}

async function gsmSendAllFloodHistoryDataByIdHandler (req, res) {
    try {
        const gsmId = req.params.id;
        const statusMSG = `All sensor ${gsmId} flood history data successfully sent`;
        const time = getGMT7Date(1);
        const statusId = crypto.randomUUID();

        const gsmStatus = {
            statusMSG,
            time,
        }
        await storeDataStatus(statusId, gsmStatus);

        //Response
        const latestDiffData = await getAllFloodTImeHistoryById(gsmId);
        res.status(200).json({
            status: 'success',
            message: statusMSG,
            data: {
                latestDiffData: latestDiffData
            },
        });
    } catch (error) {
        //Kirim status handler ke database
        //handleFailure("Failed to send data from GSM module", error);
        res.status(502).json({
            status: 'fail',
            message: 'Failed to send data from GSM module',
            error: error.message,
        });
    }
}

//fungsi
function parseRawData(rawData) {
    // Convert rawData to a string to handle cases where it's a number
    const rawDataStr = rawData.toString();

    // Validation: Ensure the format is correct
    const isValidFormat = /^[0-9]{3}[0-4]$/.test(rawDataStr);
    if (!isValidFormat) {
        throw new Error("Invalid input format. The input should be exactly 4 digits long with the first 3 digits as random numbers and the last digit in the range 0-4.");
    }

    const id = parseInt(rawDataStr.slice(0, 3), 10);
    const level = parseInt(rawDataStr.slice(-1), 10);

    const result = {
        id,
        level
    };

    return result;
}

module.exports = { 
    gsmDataReceiveHandler,
    gsmDataSendHandler,
    gsmSendAllFloodHistoryDataByIdHandler,
    parseRawData,
    gsmDataDiffSendHandler,
};
