const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/routes');

const app = express();

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
