// Initialize .env file
require("dotenv").config();
// Import modules & define params
const port = process.env.PORT ? process.env.PORT : 8080
const { appInsights } = require('./addMetrics');

require("dotenv").config();
require("./utils/database");

const http  = require("http");
const utils = require("./utils/utils");

// Define an object containing the status of the app

http.createServer((req, res) => {
    // Metrics & stuff
    appInsights();

    let body = [];
    switch (req.method) {
        case "GET":
            req = utils.queryParse(req);
            require('./router/get')(req, res);
            break;
        case "POST":
            body = [];
            req.on('data', (chunk) => { body.push(chunk) }).on('end', () => {
                req.body = Buffer.concat(body).toString();
                req.body ? req.body = JSON.parse(req.body) : null;
                require('./router/post')(req, res);
            });
            break;
        case "PUT":
            body = [];
            req.on('data', (chunk) => { body.push(chunk) }).on('end', () => {
                req.body = Buffer.concat(body).toString();
                req.body ? req.body = JSON.parse(req.body) : null;
                require('./router/put')(req, res);
            });
            break;
        case "DELETE":
            body = [];
            req.on('data', (chunk) => { body.push(chunk) }).on('end', () => {
                req.body = Buffer.concat(body).toString();
                req.body ? req.body = JSON.parse(req.body) : null;
                require('./router/delete')(req, res);
            });
            break;
        default:
            utils.sendErr(res,405,{ err: "Request method not implemented !", data: "Please use GET/POST/PUT/DELETE method only !" })
            break;
    }
}).listen(port, () => {
    console.log("====================================================================");
    console.log(' _______  ___   _______  _______        __   __  ______    ___     ');
    console.log('|       ||   | |       ||       |      |  | |  ||    _ |  |   |    ');
    console.log('|    _  ||   | |       ||   _   |      |  | |  ||   | ||  |   |    ');
    console.log('|   |_| ||   | |       ||  | |  |      |  |_|  ||   |_||_ |   |    ');
    console.log('|    ___||   | |      _||  |_|  | ___  |       ||    __  ||   |___ ');
    console.log('|   |    |   | |     |_ |       ||   | |       ||   |  | ||       |');
    console.log('|___|    |___| |_______||_______||___| |_______||___|  |_||_______|');
    console.log("===================================================================");
    console.log("");
    console.log(`~~~ Server running on ${port} ~~~`);
});
