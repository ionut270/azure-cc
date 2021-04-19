const fs        = require('fs');
const utils     = require('../utils/utils');
const mongo     = require('../utils/database').client();
const db        = mongo.db('picourl').collection('urlList');


module.exports= (req,res)=>{
    switch(req.url.split('/')[1]){
        case 'url':
            var id=req.url.split('/')[2];
            //is the id valid ? 
            if(id.match(utils.id_regExp)){
                // the id pass is good ? 
                db.findOne({id:id, pass: req.body.pass},(err,data)=>{
                    if(err) utils.sendErr(res,500,{ err : "error on db data retrival", data : err})
                    else if(!data) utils.sendErr(res,404,{ err : "Client Err", data : "The provided id is expired or the pass is incorect"})
                    else {
                        var timeout= Date.now() + 1000 * 60 * 60 * 24 // remove the url after 24h ..
                        db.deleteOne({id:id, pass: req.body.pass},(err)=>{
                            if(err) utils.sendErr(res,500,{ err : "error on db data remove", data : err})
                            else { res.statusCode = 200; res.end(JSON.stringify({msg : 'url removed'})) }
                        })
                    }
                })
            } else utils.sendErr(res,400,{ err : "Client Err", data : "The provided id is invalid"})
            break;
        case 'domain':
            var id=req.url.split('/')[2];
            if(req.headers.auth === process.env.TOKEN){
                db.findOne({domain: req.body.domain},(err,data)=>{
                    if(err) utils.sendErr(res,500,{ err : "error on db data retrival", data : err})
                    else if(!data) utils.sendErr(res,404,{ err : "Client Err", data : "The provided domain is expired or the pass is incorect"})
                    else {
                        var timeout= Date.now() + 1000 * 60 * 60 * 24 // remove the url after 24h ..
                        db.deleteMany({domain: req.body.domain},(err)=>{
                            if(err) utils.sendErr(res,500,{ err : "error on db data remove", data : err})
                            else { res.statusCode = 200; res.end(JSON.stringify({msg : 'Domain removed'})) }
                        })
                    }
                })
            } else utils.sendErr(res,403,{ err : "Client Err", data : "You do not have acess to this request"})
            break;
        default:
            utils.sendErr(res,404,{ err : "Not found !", data : "Route not implemented"})
            break;
    }
}