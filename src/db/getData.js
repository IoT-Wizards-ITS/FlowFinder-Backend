const db = require('./initializeDB');

async function getLatestSensorData() {
  const sensorsSnapshot = await db.collection('sensor-data').get();

  try {
    if (sensorsSnapshot.empty) {
      //console.log('No sensor documents found.');
      return { data: { parsedData: [] } };
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
      return { ...latestParsedData.parsedData };
    });

    const latestParsedDataResults = await Promise.all(latestParsedDataPromises);
    const filteredResults = latestParsedDataResults.filter(data => data !== null);
    const response = {
        parsedData: filteredResults
    };
    
    //console.log('Latest Parsed Data:', JSON.stringify(response, null, 2));
    return response;
  } catch (error) {
    //console.error('Error retrieving latest parsed data:', error);
    return { data: { parsedData: [] }, error: error.message };
  }
}

async function getLatestSensorDataById(ID, limitCount) {
  const collectionPath = `sensor-data/${ID}/sensor-history`;
  const collection = db.collection(collectionPath);
  try {
    const querySnapshot = await collection
      .orderBy('time', 'desc') 
      .limit(limitCount)       
      .get();
    
    if (querySnapshot.empty) {
      //console.log('No matching documents.');
      return [];
    }

    const latestData = [];
    querySnapshot.forEach(doc => {
      latestData.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return latestData;
  } catch (error) {
    //console.error('Error getting documents: ', error);
    throw new Error('Failed to get latest sensor data by id from Firestore', error);
  }
}

async function getLatesFirstFloodDetectedAfterZero(ID) {
  const collectionPath = `sensor-data/${ID}/first-level-detected`;
  const collection = db.collection(collectionPath);

  try {
    const querySnapshot = await collection
      .orderBy('time', 'desc') 
      .limit(1)       
      .get();

    if (querySnapshot.empty) {
      //console.log('No matching documents.');
      return [];
    }

    const latestData = [];
    querySnapshot.forEach(doc => {
      latestData.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return latestData;
  } catch (error) {
    //console.error('Error getting documents: ', error);
    throw new Error('Failed to get latest sensor data by id from Firestore', error);
  }
}

async function getAllFloodTImeHistoryById (ID) {
  const collectionPath = `floodtime-history/${ID}/time-intervals`;
  const collection = db.collection(collectionPath);

  try {
    const querySnapshot = await collection
      .orderBy("floodedStart", "desc")   
      .get();

    if (querySnapshot.empty) {
      return [];
    }

    const allData = [];
    querySnapshot.forEach(doc => {
      allData.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return allData;
  } catch (error) {
    throw new Error('Failed to get flood data from Firestore', error);
  }
}

async function getLatestStatusData(limitCount = 1) {
  const Collection = db.collection('status-data');

  try {
    const querySnapshot = await Collection
      .orderBy('time', 'desc') 
      .limit(limitCount)       
      .get();

    if (querySnapshot.empty) {
      //console.log('No matching documents.');
      return [];
    } 

    const latestData = [];
    querySnapshot.forEach(doc => {
      latestData.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return latestData;
  } catch (error) {
    //console.error('Error getting documents: ', error);
    throw new Error('Failed to get latest data from Firestore');
  }
}

async function getLatestTimeDiff() {
  const Collection = db.collection('time-diff');
  try {
    const querySnapshot = await Collection
      .orderBy('time', 'desc') 
      .limit(1)       
      .get();

    if (querySnapshot.empty) {
      //console.log('No matching documents.');
      return [];
    } 

    const latestData = [];
    querySnapshot.forEach(doc => {
      latestData.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return latestData;
  } catch (error) {
    //console.error('Error getting documents: ', error);
    throw new Error('Failed to get latest data from Firestore');
  }
}

module.exports ={
  getLatestSensorData,
  getLatestSensorDataById,
  getLatesFirstFloodDetectedAfterZero,
  getAllFloodTImeHistoryById,
  getLatestStatusData,
  getLatestTimeDiff,
};