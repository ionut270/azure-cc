const fs        = require('fs');
const utils     = require('../utils/utils');
const mongo     = require('../utils/database').client();
const db        = mongo.db('picourl').collection('urlList');

module.exports = (req,res)=>{
    switch(req.url.split('/')[1]){
        case 'file':
            if(req.query && req.query.path){
                res.statusCode = 200;
                fs.createReadStream(`./client/${decodeURIComponent(req.query.path)}`).pipe(res);
            } else utils.sendErr(res,404,{ err : "No path provided", data : "Invalid path"})
            break;
        case '':
            res.statusCode = 200;
            fs.createReadStream(`./client/index.html`, 'utf8').pipe(res);
            break;
        case 'r':
            var id = req.url.split('/')[2];
            //check if url id is valid
            if(id.match(utils.id_regExp)){
                db.findOne({id:id},(err,data)=>{
                    if(err) utils.sendErr(res,500,{ err : "error on db data retrival", data : err})
                    else if(!data) utils.sendErr(res,404,{ err : "Client Err", data : "The provided id is expired"})
                    else res.writeHead(301, { Location: data.url }).end();
                })
            } else utils.sendErr(res,400,{ err : "Client Err", data : "The provided id is invalid"})
            break;
        case 'metrics':
            require('../utils/metrics').metrics(res);
            break;
        default:
            utils.sendErr(res,404,{ err : "Not found !", data : "Route not implemented"})
            break;
    }
}

