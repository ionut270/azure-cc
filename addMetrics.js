require("dotenv").config();

function addMetrics() {
    let appInsights = require('applicationinsights');
    appInsights.setup(`${process.env.INSTRUMENTATIONKEY}`).start();
}

module.exports = { appInsights: addMetrics };