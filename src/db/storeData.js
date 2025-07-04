const db = require("./initializeDB");
 
async function storeDataSensor(gsmId, historyId, data) {
  const sensorDataCollection = db.collection('sensor-data').doc(gsmId);
  const sensorDataHistory = sensorDataCollection.collection('sensor-history');
  await sensorDataHistory.doc(historyId).set(data);
}

async function storeDataStatus(id, data) {
  const sensorDataCollection = db.collection('status-data');
  await sensorDataCollection.doc(id).set(data);
}

async function storeDataZero(gsmId, historyId, data) {
  const sensorDataCollection = db.collection('level-zero').doc(gsmId);
  const sensorDataHistory = sensorDataCollection.collection('sensor-history');
  await sensorDataHistory.doc(historyId).set(data);
}

async function storeDataFirstLevelAfterZero(gsmId, historyId, data) {
  const sensorDataCollection = db.collection('sensor-data').doc(gsmId);
  const sensorDataHistory = sensorDataCollection.collection('first-level-detected');
  await sensorDataHistory.doc(historyId).set(data);
}

async function storeDataFloodTimeHistory(ID, data) {
  const floodTimeCollection = db.collection('floodtime-history');
  await floodTimeCollection.doc(ID).set(data);
}

async function storeDataTimeDiff(ID, data) {
  const floodTimeCollection = db.collection('time-diff');
  await floodTimeCollection.doc(ID).set(data);
}

module.exports = { 
  storeDataSensor,
  storeDataStatus,
  storeDataZero,
  storeDataFirstLevelAfterZero,
  storeDataFloodTimeHistory,
  storeDataTimeDiff,
};