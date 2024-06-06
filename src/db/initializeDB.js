const { Firestore } = require('@google-cloud/firestore');
const admin = require('firebase-admin')

const serviceAccount = require('./protel-e376b-5f7fa74b2a07.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = new Firestore({
  databaseId: 'flowfinder-db'
});

module.exports = db;