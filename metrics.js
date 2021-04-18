const fetch = require('node-fetch');
require("dotenv").config();

function metrics(res) {
    fetch(`https://api.applicationinsights.io/v1/apps/${process.env.APP_ID}/metrics/requests/duration?timespan=P1D&interval=PT1H`, {
            method: 'GET',
            headers: {
                "x-api-key": `${process.env.API_KEY}`
            },
        })
        .then(response => response.text())
        .then(result => res.send(result))
        .catch(error => console.log('error', error));
}

module.exports = { metrics: metrics };