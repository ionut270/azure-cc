const fs = require("fs");
var fileExists = (dir) => new Promise((resolve, reject) => fs.exists(dir, (exists) => resolve(exists)))
module.exports.makeDir = (dir) => new Promise(async (resolve, reject) =>{
    if(!await fileExists(dir)) fs.mkdir(dir, (err) => resolve())
    else resolve()
});
module.exports.readDir = (dir) => new Promise(async (resolve, reject) =>{
    if(await fileExists(dir)) fs.readdir(dir, (err, data) => resolve(data))
    else resolve([])
});
module.exports.readFile = (dir) => new Promise(async (resolve, reject) =>{
    if(await fileExists(dir)) fs.readFile(dir, (err, file) => resolve(file))
    else resolve('')
});
module.exports.removeDir = (dir) => new Promise(async (resolve, reject) =>{
    if(await fileExists(dir)) fs.rmdir(dir, {recursive: true}, (err) => resolve())
    else resolve()
});
module.exports.removeFile = (dir) => new Promise(async (resolve, reject) =>{
    if(await fileExists(dir)) fs.unlink(dir, (err) => resolve())
    else resolve()
});
module.exports.isDirectory = (dir) => new Promise(async (resolve, reject) =>{
    if(await fileExists(dir)) fs.lstat(dir, (err, stats) => resolve( stats ? stats.isDirectory() : false))
    else resolve(false)
});
module.exports.fileExists = fileExists;