const { Firestore } = require('@google-cloud/firestore');

async function getLatestSensorData(limitCount = 1) {
    const db = new Firestore({
      databaseId: 'flowfinder-db'
    });
  
    const predictCollection = db.collection('sensor-data');
  
    try {
      const querySnapshot = await predictCollection
        .orderBy('time', 'desc') 
        .limit(limitCount)       
        .get();
  
      if (querySnapshot.empty) {
        console.log('No matching documents.');
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
      console.error('Error getting documents: ', error);
      throw new Error('Failed to get latest data from Firestore');
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
        console.log('No matching documents.');
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
      console.error('Error getting documents: ', error);
      throw new Error('Failed to get latest data from Firestore');
    }
  }

  module.exports ={
    getLatestSensorData,
    getLatestStatusData
  };