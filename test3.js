const crypto = require('crypto');
const getGMT7Date = require('./src/timeUtils');
const { calculateAndFormatTimeDifference, recordValidIntervals, recordFloodIntervalTime } = require('./src/timeCountHandler');
const { parseRawData } = require('./src/gsmHandler');
const { storeDataSensor, storeDataZero } = require('./src/db/storeData');

async function gsmDataReceiveHandler(req) {
    try {
        const { rawData } = req.body;
        const parsedData = parseRawData(rawData);
        const gsmId = parsedData.id.toString();
        const gsmLvl = parsedData.level;
        const historyId = crypto.randomUUID();
        const time = getGMT7Date(1);

        const gsmData = {
            parsedData, time,
        }  

        await storeDataSensor(gsmId, historyId, gsmData);

        const timeStamp = { time };
        if(parsedData.level.toString() === "0") {
            await storeDataZero(gsmId, historyId, timeStamp);
            await recordFloodIntervalTime(gsmId, gsmLvl, time);
        }

        await calculateAndFormatTimeDifference();
    } catch (error) {
        console.error(error);
    }
};

async function testGsmDataReceiveHandler() {
    // Daftar nilai rawData yang ingin diuji
    const testData = [1000, 1001, 1002, 1003, 1002, 1002, 1001, 1000];

    // Iterasi dan panggil handler untuk setiap nilai rawData
    for (const data of testData) {
        const req = {
            body: {
                rawData: data.toString()  // Pastikan rawData adalah string jika itu yang diharapkan
            }
        };
        try {
            await gsmDataReceiveHandler(req);
            console.log(`Successfully processed raw data: ${data}`);
        } catch (error) {
            console.error(`Failed to process raw data: ${data}`, error);
        }
    }
}

testGsmDataReceiveHandler();

  