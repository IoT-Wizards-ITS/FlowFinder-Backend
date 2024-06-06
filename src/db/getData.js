const { Firestore } = require('@google-cloud/firestore');
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
    
    console.log('Latest Parsed Data:', JSON.stringify(response, null, 2));
    return response;
  } catch (error) {
    //console.error('Error retrieving latest parsed data:', error);
    return { data: { parsedData: [] }, error: error.message };
  }
}

async function getLatestStatusData(limitCount = 1) {
  const db = new Firestore({
    databaseId: 'flowfinder-db'
  });

  const predictCollection = db.collection('status-data');

  try {
    const querySnapshot = await predictCollection
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

module.exports ={
  getLatestSensorData,
  getLatestStatusData
};