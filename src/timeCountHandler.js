const db = require("./db/initializeDB");
const { getLatestSensorDataById, getLatesFirstFloodDetectedAfterZero } = require("./db/getData");
const { storeDataTimeDiff } = require("./db/storeData");
const getGMT7Date = require("./timeUtils");

// Konversi milisecond ke format hour:minute:second
function formatTimeDifference(diffMs) {
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// Hitung perbedaan waktu
function getTimeDifferenceInMilliseconds(time1, time2) {
    const timestamp1 = new Date(time1).getTime();
    const timestamp2 = new Date(time2).getTime();
    return Math.abs(timestamp1 - timestamp2);
}

// Ambil waktu terbaru dari level pada tiap ID yang ada
async function getLatestTimeData() {
  const sensorsSnapshot = await db.collection('sensor-data').get();

  try {
    if (sensorsSnapshot.empty) {
      //console.log('No sensor documents found.');
      return { time: [] };
    }

    const latestParsedDataPromises = sensorsSnapshot.docs.map(async (sensorDoc) => {
      const sensorId = sensorDoc.id;
      const sensorHistorySnapshot = await db.collection('sensor-data')
        .doc(sensorId)
        .collection('sensor-history')
        .orderBy('time', 'desc')
        .limit(1)
        .get();

      if (sensorHistorySnapshot.empty) {
        //console.log(`No history found for sensor ${sensorId}`);
        return null;
      }

      const latestHistoryDoc = sensorHistorySnapshot.docs[0];
      const latestParsedData = latestHistoryDoc.data();
      const formattedTime = new Date(latestParsedData.time).toISOString();
      return { time:formattedTime };
    });

    const latestParsedDataResults = await Promise.all(latestParsedDataPromises);
    const filteredResults = latestParsedDataResults.filter(data => data !== null);
    const response = {
        time: filteredResults
    };
    
    //console.log('Latest Parsed Data:', JSON.stringify(response, null, 2));
    return response;
  } catch (error) {
    //console.error('Error retrieving latest parsed data:', error);
    return { data: { time: [] }, error: error.message };
  }
}

// Ambil waktu terbaru dari level 0 pada tiap ID yang ada
async function getLatestZero(limitCount) {
  const sensorsSnapshot = await db.collection('level-zero').get();

  try {
    if (sensorsSnapshot.empty) {
      //console.log('No sensor documents found.');
      return { time: [] };
    }

    const latestParsedDataPromises = sensorsSnapshot.docs.map(async (sensorDoc) => {
      const sensorId = sensorDoc.id;
      const sensorHistorySnapshot = await db.collection('level-zero')
        .doc(sensorId)
        .collection('sensor-history')
        .orderBy('time', 'desc')
        .limit(limitCount)
        .get();

      if (sensorHistorySnapshot.empty) {
        //console.log(`No history found for sensor ${sensorId}`);
        return null;
      }

      const latestHistoryDoc = sensorHistorySnapshot.docs[limitCount-1];
      const latestParsedData = latestHistoryDoc.data();
      const formattedTime = new Date(latestParsedData.time).toISOString();
      return { time:formattedTime };
    });

    const latestParsedDataResults = await Promise.all(latestParsedDataPromises);
    const filteredResults = latestParsedDataResults.filter(data => data !== null);
    const response = {
        time: filteredResults
    };
    
    //console.log('Latest Parsed Data:', JSON.stringify(response, null, 2));
    return response;
  } catch (error) {
    //console.error('Error retrieving latest parsed data:', error);
    return { data: { time: [] }, error: error.message };
  }
}

// Fungsi yang menampilkan status terkini dari tiap ID (menampilkan lama waktu genangan)
async function calculateAndFormatTimeDifference() {
  const latestTimeData = await getLatestTimeData();
  const latestZero = await getLatestZero(1);
  
  if (latestTimeData.time.length === 0 || latestZero.time.length === 0) {
      console.error('No data available to calculate time difference');
      return;
  }
  
  const formattedDifferences = [];
  for (let i = 0; i < Math.min(latestTimeData.time.length, latestZero.time.length); i++) {
    const time1 = latestTimeData.time[i].time;
    const time2 = latestZero.time[i].time;
    
    const timeDifferenceMs = getTimeDifferenceInMilliseconds(time1, time2);
    const formattedTimeDifference = formatTimeDifference(timeDifferenceMs);

    const sensorId = 100 + i;
    
    if( timeDifferenceMs !== 0 ) {
      const msg = `Genangan air telah terdeteksi pada sensor ${sensorId} selama ${formattedTimeDifference}`;
      formattedDifferences.push(msg);
    } else {
      const msg = `Tidak terdetaksi adanya genangan air pada sensor ${sensorId}`;
      formattedDifferences.push(msg);
    }
        
  }
  const uniqueId = crypto.randomUUID();
  const time = getGMT7Date(1);
  const timeDiffData = { formattedDifferences, time };
  await storeDataTimeDiff(uniqueId, timeDiffData);
}

// Hitung lama waktu banjir yang terlampau
async function recordFloodIntervalTime(ID, level, timeNow) {
  const secondLatestDataFromSensor = await getLatestSensorDataById(ID, 2);
  const secondLatestLevelDataFromSensor = secondLatestDataFromSensor[1].parsedData.level;
  try{
    if (level == 0 && secondLatestLevelDataFromSensor != 0) {
      const floodFirstLevelZero = await getLatesFirstFloodDetectedAfterZero(ID);
      const intervalTime = getTimeDifferenceInMilliseconds(timeNow, floodFirstLevelZero[0].time);
      const floodDuration = formatTimeDifference(intervalTime);
      const floodedStart = floodFirstLevelZero[0].time;
      const floodedEnd = timeNow;

      const uniqueId = crypto.randomUUID();
      const history = {
        floodedStart, floodedEnd, floodDuration,
      }
      const floodDataCollection = db.collection('floodtime-history').doc(ID);
      const floodDataHistory = floodDataCollection.collection('time-intervals');
      await floodDataHistory.doc(uniqueId).set(history);
    }
  } catch (error) {
    throw new Error('Failed to send data to Firestore: ' + error.message);
  }
} 

module.exports = { 
  calculateAndFormatTimeDifference,
  recordFloodIntervalTime,
};