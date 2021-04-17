// Initialize .env file
require("dotenv").config();

// Import modules & define params
const port = process.env.PORT ? process.env.PORT : 8080
const app = require("express")();

// Base app Listener
app.listen(port,(err)=>{
    if(err) console.error(err);
    else console.log(`App running on port ${port}`);
})

// Define an object containing the status of the app
var status = {
    app : "OK",
    mongo : null
}

// App router
app.get('/',(req,res)=>{
    res.status(200).send(status);
})

var mongoClient = require("mongodb").MongoClient;
mongoClient.connect(process.env.MONGO_CONN_STRING,{ useUnifiedTopology: true },  function (err, client) {
    if(err){
        console.log(err);
        status.mongo = err;
    } else {
        status.mongo = "Connected to mongodb !";
    }
  client.close();
});