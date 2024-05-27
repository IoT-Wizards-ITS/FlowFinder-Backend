const { Firestore } = require('@google-cloud/firestore');
 
async function storeDataSensor(id, data) {
  const db = new Firestore({
    databaseId: 'flowfinder-db'
  });
 
  const predictCollection = db.collection('sensor-data');
  return predictCollection.doc(id).set(data);
}

async function storeDataStatus(id, data) {
  const db = new Firestore({
    databaseId: 'flowfinder-db'
  });
 
  const predictCollection = db.collection('status-data');
  return predictCollection.doc(id).set(data);
}
 
module.exports = { 
  storeDataSensor,
  storeDataStatus 
};