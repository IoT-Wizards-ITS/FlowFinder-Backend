const db = require("./initializeDB");
 
async function storeDataSensor(gsmId, historyId, data) {
  const sensorDataCollection = db.collection('sensor-data').doc(gsmId);
  const sensorDataHistory = sensorDataCollection.collection('sensor-history');
  await sensorDataHistory.doc(historyId).set(data);
}

async function storeDataStatus(id, data) {
  const sensorDataCollection = db.collection('status-data');
  return sensorDataCollection.doc(id).set(data);
}

async function storeDataLocation(id, data) {
  const sensorDataCollection = db.collection('location-data');
  return sensorDataCollection.doc(id).set(data);
}

module.exports = { 
  storeDataSensor,
  storeDataStatus,
  storeDataLocation,
};