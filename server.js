const express = require('express');
const bodyParser = require('body-parser');
//const admin = require('firebase-admin');
const routes = require('./src/routes');
//const serviceAccountKey = require('./src/serviceAccountKey.json');

const app = express();

/* Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    // Add your Firebase database URL if needed
    databaseURL: "https://protel-e376b-default-rtdb.asia-southeast1.firebasedatabase.app"
});*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

app.get("/", (req, res) => {
    console.log("Response success");
    res.send("Response Success!");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("Server is up and listening on " + "http://localhost:" + PORT);
});
