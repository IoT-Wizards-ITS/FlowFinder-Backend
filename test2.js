const db = require("./src/db/initializeDB");

async function getLatestParsedData() {
  try {
    const sensorsSnapshot = await db.collection('sensor-data').get();

    if (sensorsSnapshot.empty) {
      console.log('No sensor documents found.');
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
        console.log(`No history found for sensor ${sensorId}`);
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
    console.error('Error retrieving latest parsed data:', error);
    return { data: { parsedData: [] }, error: error.message };
  }
}

getLatestParsedData()

