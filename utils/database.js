const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_CONN_STRING;
const client = new MongoClient(uri,{useUnifiedTopology: true});

async function mongoConnect() {
  try {
    await client.connect();
    console.log("~~~  Connected to mongoDB  ~~~");
  } catch (e) {
    console.error(e);
  }
}

mongoConnect();
module.exports = { client : ()=> client }