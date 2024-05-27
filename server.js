//require('@google-cloud/debug-agent').start();

const Hapi = require('@hapi/hapi');
const routes = require('./src/routes');
//const admin = require('firebase-admin');
//const serviceAccountKey = require('./src/serviceAccountKey.json');

const init = async () => {
    const server = Hapi.server({
        port: 8000,
        host: 'localhost',
    });

    // Inisialisasi Firebase Admin SDK
    /*admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
        // tambahkan konfigurasi database URL Firebase Anda di sini jika diperlukan
        databaseURL: "https://protel-e376b-default-rtdb.asia-southeast1.firebasedatabase.app"
    });*/

    server.route(routes);

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
};

init();
