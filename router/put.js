const fs        = require('fs');
const utils     = require('../utils/utils');
const mongo     = require('../utils/database').client();
const db        = mongo.db('picourl').collection('urlList');


module.exports= (req,res)=>{
    switch(req.url.split('/')[1]){
        case 'renew':
            var id=req.url.split('/')[2];
            //is the id valid ? 
            if(id.match(utils.id_regExp)){
                // the id pass is good ? 
                db.findOne({id:id, pass: req.body.pass},(err,data)=>{
                    if(err) utils.sendErr(res,500,{ err : "error on db data retrival", data : err})
                    else if(!data) utils.sendErr(res,404,{ err : "Client Err", data : "The provided id is expired or the pass is incorect"})
                    else {
                        var timeout= Date.now() + 1000 * 60 * 60 * 24 // remove the url after 24h ..
                        db.updateOne({id:id, pass: req.body.pass},{$set: {timeout: timeout} },(err)=>{
                            if(err) utils.sendErr(res,500,{ err : "error on db data update", data : err})
                            else { res.statusCode = 200; res.end(JSON.stringify({"url":`${process.env.APP_HOST}/r/${id}`,pass: req.body.pass, msg: `The url will expire on ${new Date(timeout)}`})) }
                        })
                    }
                })
            } else utils.sendErr(res,400,{ err : "Client Err", data : "The provided id is invalid"})
            break;
        case 'change_url':
            var id=req.url.split('/')[2];
            var domain = req.body.url.match(/https?:\/\//) ? req.body.url.split(/https?:\/\//)[1].split(/\//)[0] : req.body.url.split(/\//)[0] 
            if(id.match(utils.id_regExp)){
                mongo.db('picourl').collection('blacklist').findOne({_id:req.body.url},(err,data)=>{
                    if(err) utils.sendErr(res,500,{ err : "error on db data retrival", data : err})
                    else if(data) utils.sendErr(res,404,{ err : "Client Err", data : "The provided url is blacklisted"})
                    else db.findOne({id:id, pass: req.body.pass},(err,data)=>{
                            if(err) utils.sendErr(res,500,{ err : "error on db data retrival", data : err})
                            else if(!data) utils.sendErr(res,404,{ err : "Client Err", data : "The provided id is expired or the pass is incorect"})
                            else {
                                var timeout= Date.now() + 1000 * 60 * 60 * 24 // remove the url after 24h ..
                                db.updateOne({id:id, pass: req.body.pass},{$set:{ url: req.body.url, timeout: timeout, domain: domain}},(err)=>{
                                    if(err) utils.sendErr(res,500,{ err : "error on db data update", data : err})
                                    else { res.statusCode = 200; res.end(JSON.stringify({"url":`${process.env.APP_HOST}/r/${id}`,pass: req.body.pass, msg: `The url will expire on ${new Date(timeout)}`})) }
                                })
                            }
                        })
                    })
            } else utils.sendErr(res,400,{ err : "Client Err", data : "The provided id is invalid"})
            break;
        default:
            utils.sendErr(res,404,{ err : "Not found !", data : "Route not implemented"})
            break;
    }
}