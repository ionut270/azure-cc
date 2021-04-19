const fs        = require('fs');
const utils     = require('../utils/utils');
const mongo     = require('../utils/database').client();
const db        = mongo.db('picourl').collection('urlList');


module.exports= (req,res)=>{
    switch(req.url){
        case '/new':
            // check that url is not blacklisted
            if(req.body.url.match(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/))
                mongo.db('picourl').collection('blacklist').findOne({_id:req.body.url},(err,data)=>{
                    if(err) utils.sendErr(res,500,{ err : "error on db data retrival", data : err})
                    else if(data) utils.sendErr(res,404,{ err : "Client Err", data : "The provided url is blacklisted"})
                    else {
                        //generate an id and return the data
                        var id     = generate(Math.floor(Math.random()*5+4));
                        var pass   = generate(Math.floor(Math.random()*5+32));
                        
                        var domain = req.body.url.match(/https?:\/\//) ? req.body.url.split(/https?:\/\//)[1].split(/\//)[0] : req.body.url.split(/\//)[0] 
                        var timeout= Date.now() + 1000 * 60 * 60 * 24 // remove the url after 24h ..

                        req.body.url = req.body.url.match(/https?:\/\//) ? req.body.url : `http://${req.body.url}`

                        db.insertOne({ id:id, pass:pass, url:req.body.url, timeout: timeout, domain: domain },(err)=>{
                            if(err) utils.sendErr(res,500,{ err : "error on db data insertion", data : err})
                            else { res.statusCode = 200; res.end(JSON.stringify({"url":`${process.env.APP_HOST}/r/${id}`,pass:pass, msg: `The url will expire on ${new Date(timeout)}`})) }
                        })
                    }
                })
                else utils.sendErr(res,400,{ err : "Client Err", data : "The provided url is not an actual url :D"})
                break;
        case '/blacklist':
            if(req.headers.auth === process.env.TOKEN){
                mongo.db('picourl').collection('blacklist').insertOne({_id:req.body.url},(err)=>{
                    if(err) utils.sendErr(res,500,{ err : "error on db data insertion", data : err})
                    else { db.deleteMany({url:req.body.url}); res.statusCode = 200; res.end(JSON.stringify({"status":"Sucess !" }))}
                })
            } else utils.sendErr(res,401,{ err : "Client Err", data : "You do not have acess to this request"})
            break;
        default:
            utils.sendErr(res,404,{ err : "Not found !", data : "Route not implemented"})
            break;
    }
}

function generate(count) {
    var _sym = 'abcdefghijklmnopqrstuvwxyz1234567890'
    var str = '';
    for(var i = 0; i < count; i++) str += _sym[parseInt(Math.random() * (_sym.length))];
    return str;
}