// Initialize .env file
require("dotenv").config();
const path = require('path');
// Import modules & define params
const port = process.env.PORT ? process.env.PORT : 8080
const app = require("express")();
const { metrics } = require('./metrics');
const { appInsights } = require('./addMetrics');

// Base app Listener
app.listen(port, (err) => {
    if (err) console.error(err);
    else console.log(`App running on port ${port}`);
})

// Define an object containing the status of the app
var status = {
    app: "OK",
    mongo: null
}

// App router
app.get('/', (req, res) => {
    appInsights();
    res.sendFile(path.join(__dirname + '/index.html'));
})
app.get('/errorAuth', (req, res) => {
    res.statusCode = 200;
    res.redirect("https://noauth.azurewebsites.net");
    res.end();
})

app.get('/metrics', (req, res) => {
    metrics(res);
})

var mongoClient = require("mongodb").MongoClient;
mongoClient.connect(process.env.MONGO_CONN_STRING, { useUnifiedTopology: true }, function(err, client) {
    if (err) {
        console.log(err);
        status.mongo = err;
    } else {
        status.mongo = "Connected to mongodb !";
    }
    client.close();
});