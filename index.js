// Initialize .env file
require("dotenv").config();

// Import modules & define params
const port = process.env.PORT ? process.env.PORT : 80
const app = require("express")();

// Base app Listener
app.listen(port,(err)=>{
    if(err) console.error(err);
    else console.log(`App running on port ${port}`);
})

// App router
app.get('/',(req,res)=>{
    res.status(200).send("Hello World");
})